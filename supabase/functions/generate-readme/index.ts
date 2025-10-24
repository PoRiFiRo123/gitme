import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RepoMetadata {
  description?: string;
  features?: string;
  license?: string;
  additionalContext?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repoUrl, metadata } = await req.json() as {
      repoUrl: string;
      metadata: RepoMetadata;
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendLog = (message: string, logType: "info" | "success" | "error" | "warning" = "info") => {
          const data = `data: ${JSON.stringify({ type: "log", message, logType })}\n\n`;
          controller.enqueue(encoder.encode(data));
        };

        const sendComplete = (readme: string) => {
          const data = `data: ${JSON.stringify({ type: "complete", readme })}\n\n`;
          controller.enqueue(encoder.encode(data));
          controller.close();
        };

        const sendError = (message: string) => {
          const data = `data: ${JSON.stringify({ type: "error", message })}\n\n`;
          controller.enqueue(encoder.encode(data));
          controller.close();
        };

        try {
          sendLog("Starting README generation...");
          sendLog(`Repository: ${repoUrl}`);

          // Extract repo info
          const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
          if (!repoMatch) {
            throw new Error("Invalid GitHub URL");
          }
          const [, owner, repo] = repoMatch;
          const cleanRepo = repo.replace(/\.git$/, "");

          sendLog(`Analyzing ${owner}/${cleanRepo}...`, "info");

          // Fetch repository data from GitHub API
          sendLog("Fetching repository information...");
          const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
          if (!repoResponse.ok) {
            throw new Error("Repository not found or not accessible");
          }
          const repoData = await repoResponse.json();
          sendLog("Repository data fetched", "success");

          // Fetch file tree
          sendLog("Extracting file structure...");
          const treeResponse = await fetch(
            `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/${repoData.default_branch}?recursive=1`
          );
          if (!treeResponse.ok) {
            throw new Error("Failed to fetch file tree");
          }
          const treeData = await treeResponse.json();
          const fileTree = treeData.tree
            .filter((item: any) => item.type === "blob")
            .map((item: any) => item.path)
            .slice(0, 100); // Limit to first 100 files
          
          sendLog(`Found ${fileTree.length} files`, "success");

          // Use AI to select important files
          sendLog("AI analyzing important files...");
          const selectedFiles = await selectImportantFiles(fileTree, repoData);
          sendLog(`Selected ${selectedFiles.length} key files for analysis`, "success");

          // Fetch and summarize selected files
          sendLog("Reading file contents...");
          const fileSummaries = await summarizeFiles(owner, cleanRepo, repoData.default_branch, selectedFiles, sendLog);
          sendLog("File analysis complete", "success");

          // Generate final README
          sendLog("Generating comprehensive README...");
          const readme = await generateReadme(repoData, fileSummaries, metadata, fileTree);
          sendLog("README generated successfully!", "success");

          sendComplete(readme);
        } catch (error) {
          console.error("Error:", error);
          sendError(error instanceof Error ? error.message : "Unknown error");
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function callAIWithFailover(prompt: string, model: "gemini" | "groq" = "gemini"): Promise<string> {
  if (model === "gemini") {
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

      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) throw new Error("Empty response from Gemini");
      return content;
    } catch (error) {
      console.error("Gemini failed, falling back to Groq:", error);
      return callAIWithFailover(prompt, "groq");
    }
  } else {
    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) throw new Error("Groq API key not configured");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

async function selectImportantFiles(fileTree: string[], repoData: any): Promise<string[]> {
  const prompt = `Analyze this repository file structure and select the 10-15 most important files for understanding the project.
Focus on: main source files, configuration files, package manifests, and documentation.
Exclude: test files, build outputs, node_modules, .git folders, images, and minified files.

Repository: ${repoData.name}
Description: ${repoData.description || "No description"}
Language: ${repoData.language || "Unknown"}

Files (first 100):
${fileTree.join("\n")}

Return ONLY a JSON array of file paths, nothing else:
["path/to/file1.js", "path/to/file2.json"]`;

  const response = await callAIWithFailover(prompt);
  try {
    const match = response.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Invalid JSON response");
    return JSON.parse(match[0]);
  } catch {
    // Fallback to basic selection
    return fileTree
      .filter(f => !f.includes("node_modules") && !f.includes("test") && !f.includes(".min."))
      .slice(0, 15);
  }
}

async function summarizeFiles(
  owner: string,
  repo: string,
  branch: string,
  files: string[],
  sendLog: (msg: string, type?: "info" | "success" | "error" | "warning") => void
): Promise<Array<{ path: string; summary: string }>> {
  const summaries = [];
  
  for (const file of files.slice(0, 10)) {
    try {
      sendLog(`Reading ${file}...`);
      const response = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`
      );
      if (!response.ok) continue;
      
      const content = await response.text();
      if (content.length > 50000) continue; // Skip very large files
      
      const prompt = `Briefly summarize this file's purpose and key functionality (2-3 sentences):

File: ${file}
Content:
${content.slice(0, 10000)}`;

      const summary = await callAIWithFailover(prompt);
      summaries.push({ path: file, summary });
      sendLog(`Analyzed ${file}`, "success");
    } catch (error) {
      console.error(`Failed to analyze ${file}:`, error);
    }
  }
  
  return summaries;
}

async function generateReadme(
  repoData: any,
  fileSummaries: Array<{ path: string; summary: string }>,
  metadata: RepoMetadata,
  fileTree: string[]
): Promise<string> {
  const prompt = `Generate a comprehensive, professional README.md for this GitHub repository.

REPOSITORY INFORMATION:
- Name: ${repoData.name}
- Description: ${repoData.description || "No description provided"}
- Language: ${repoData.language || "Unknown"}
- Stars: ${repoData.stargazers_count}
- Forks: ${repoData.forks_count}
${metadata.description ? `\nCustom Description: ${metadata.description}` : ""}
${metadata.features ? `\nKey Features: ${metadata.features}` : ""}
${metadata.license ? `\nLicense: ${metadata.license}` : ""}
${metadata.additionalContext ? `\nAdditional Context: ${metadata.additionalContext}` : ""}

FILE STRUCTURE (sample):
${fileTree.slice(0, 30).join("\n")}

KEY FILES ANALYSIS:
${fileSummaries.map(f => `${f.path}:\n${f.summary}`).join("\n\n")}

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
