import { supabase } from "@/integrations/supabase/client";

interface FileData {
  path: string;
  content: string;
}

interface GenerateReadmeParams {
  files: FileData[];
  repoInfo: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
  };
  metadata?: {
    description?: string;
    features?: string;
    license?: string;
    additionalContext?: string;
  };
  onLog?: (message: string, type?: "info" | "success" | "error") => void;
}

/**
 * Generate README using AI with automatic Gemini -> Groq fallover
 * This function sends data to the edge function which handles AI processing securely
 */
export async function generateReadmeWithAI(
  params: GenerateReadmeParams
): Promise<string> {
  const { files, repoInfo, metadata, onLog } = params;

  onLog?.("Sending data to AI pipeline...", "info");

  try {
    // Call the edge function with pre-fetched file data
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-readme-from-files`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          files,
          repoInfo,
          metadata: metadata || {},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`AI processing failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    onLog?.("README generated successfully!", "success");
    return data.readme;
  } catch (error) {
    onLog?.(
      `AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      "error"
    );
    throw error;
  }
}

/**
 * Generate README with streaming logs (for SSE-based processing)
 */
export async function generateReadmeWithStreaming(
  params: GenerateReadmeParams,
  onComplete: (readme: string) => void
): Promise<void> {
  const { files, repoInfo, metadata, onLog } = params;

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-readme-from-files-stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        files,
        repoInfo,
        metadata: metadata || {},
      }),
    }
  );

  if (!response.ok || !response.body) {
    throw new Error("Failed to start streaming");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));

          if (data.type === "log") {
            onLog?.(data.message, data.logType);
          } else if (data.type === "complete") {
            onComplete(data.readme);
          } else if (data.type === "error") {
            throw new Error(data.message);
          }
        } catch (e) {
          console.error("Error parsing SSE:", e);
        }
      }
    }
  }
}
