import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { files, repoInfo, metadata } = await req.json();

    console.log(`Processing ${files.length} files for ${repoInfo.name}`);

    // Select important files using AI
    const selectedFiles = await selectImportantFiles(files, repoInfo);
    console.log(`Selected ${selectedFiles.length} files for detailed analysis`);

    // Summarize selected files
    const summaries = await summarizeFiles(selectedFiles);
    console.log(`Generated ${summaries.length} file summaries`);

    // Generate final README
    const readme = await generateReadme(repoInfo, summaries, metadata, files);

    return new Response(JSON.stringify({ readme }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Sleep utility for rate limit handling
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callAIWithFailover(prompt: string, retryCount = 0): Promise<string> {
  const maxRetries = 3;
  const baseDelay = 2000; // 2 seconds

  // Try Gemini first
  try {
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) throw new Error("Gemini API key not configured");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (response.status === 429 && retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Gemini rate limited, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
      await sleep(delay);
      return callAIWithFailover(prompt, retryCount + 1);
    }

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("Empty response from Gemini");

    return content;
  } catch (error) {
    console.error("Gemini failed, falling back to Groq:", error);

    // Fallback to Groq
    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) throw new Error("Groq API key not configured");

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 8192,
        }),
      });

      if (response.status === 429 && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`Groq rate limited, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        await sleep(delay);
        return callAIWithFailover(prompt, retryCount + 1);
      }

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded on both Gemini and Groq. Please try again in a few moments.");
        }
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (groqError) {
      if (groqError instanceof Error && groqError.message.includes("Rate limit")) {
        throw groqError;
      }
      throw new Error(`Both AI providers failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

async function selectImportantFiles(files: any[], repoInfo: any): Promise<any[]> {
  const fileList = files.map((f) => f.path).join("\n");

  const prompt = `Analyze this repository and select the 10-15 most important files for understanding the project.
Focus on: main source files, configuration files, package manifests, documentation.
Exclude: test files, build outputs, minified files.

Repository: ${repoInfo.name}
Description: ${repoInfo.description || "No description"}
Language: ${repoInfo.language}

Files:
${fileList}

Return ONLY a JSON array of file paths:
["path/to/file1.js", "path/to/file2.json"]`;

  const response = await callAIWithFailover(prompt);

  try {
    const match = response.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Invalid JSON response");

    const selectedPaths = JSON.parse(match[0]);
    return files.filter((f) => selectedPaths.includes(f.path));
  } catch {
    // Fallback: return first 15 files
    return files.slice(0, 15);
  }
}

async function summarizeFiles(files: any[]): Promise<any[]> {
  const summaries = [];
  // Reduce to 5 files to avoid rate limits
  const filesToSummarize = files.slice(0, 5);

  for (let i = 0; i < filesToSummarize.length; i++) {
    const file = filesToSummarize[i];
    try {
      // Add delay between calls to avoid rate limits (1 second between calls)
      if (i > 0) {
        await sleep(1000);
      }

      const prompt = `Briefly summarize this file's purpose and key functionality (2-3 sentences):

File: ${file.path}
Content:
${file.content.slice(0, 10000)}`;

      const summary = await callAIWithFailover(prompt);
      summaries.push({ path: file.path, summary });
      console.log(`Successfully summarized ${file.path}`);
    } catch (error) {
      console.error(`Failed to summarize ${file.path}:`, error);
      // Continue with other files even if one fails
    }
  }

  return summaries;
}

async function generateReadme(
  repoInfo: any,
  summaries: any[],
  metadata: any,
  allFiles: any[]
): Promise<string> {
  const fileTree = allFiles.map((f) => f.path).slice(0, 30).join("\n");

  const prompt = `Generate a comprehensive, professional README.md for this GitHub repository.

REPOSITORY INFORMATION:
- Name: ${repoInfo.name}
- Description: ${repoInfo.description || "No description"}
- Language: ${repoInfo.language}
- Stars: ${repoInfo.stars}
- Forks: ${repoInfo.forks}
${metadata.description ? `\nCustom Description: ${metadata.description}` : ""}
${metadata.features ? `\nKey Features: ${metadata.features}` : ""}
${metadata.license ? `\nLicense: ${metadata.license}` : ""}
${metadata.additionalContext ? `\nAdditional Context: ${metadata.additionalContext}` : ""}

FILE STRUCTURE (sample):
${fileTree}

KEY FILES ANALYSIS:
${summaries.map((f) => `${f.path}:\n${f.summary}`).join("\n\n")}

Generate a README with these sections:
1. Project Title and Description
2. Key Features (bullet points)
3. Installation Instructions
4. Usage Examples
5. Project Structure
6. Technologies Used
7. Contributing Guidelines
8. License Information

Use proper markdown formatting, emojis for visual appeal, and make it developer-friendly.
End with: "Generated with GitMe – https://readme-generator-phi.vercel.app"`;

  return await callAIWithFailover(prompt);
}
