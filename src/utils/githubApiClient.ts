interface FileData {
  path: string;
  content: string;
}

interface RepoData {
  files: FileData[];
  repoInfo: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    defaultBranch: string;
  };
}

/**
 * Parse GitHub repository URL to extract owner and repo name
 */
export function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub URL format");
  }
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, "");
  return { owner, repo: cleanRepo };
}

/**
 * Fetch repository metadata from GitHub API
 */
async function fetchRepoInfo(owner: string, repo: string) {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Repository not found or not accessible: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Fetch full repository file tree
 */
async function fetchRepoTree(owner: string, repo: string, branch: string) {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repository tree: ${response.statusText}`);
  }

  const data = await response.json();
  return data.tree;
}

/**
 * Fetch file content using blob SHA
 */
async function fetchFileContent(owner: string, repo: string, sha: string): Promise<string> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Decode base64 content
  if (data.encoding === "base64") {
    return atob(data.content.replace(/\n/g, ""));
  }
  
  return data.content;
}

/**
 * Filter relevant files (exclude tests, build outputs, assets, etc.)
 */
function isRelevantFile(path: string): boolean {
  const excludePatterns = [
    /node_modules/,
    /\.git\//,
    /dist\//,
    /build\//,
    /coverage\//,
    /\.test\./,
    /\.spec\./,
    /\.min\./,
    /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i,
    /\.(css|scss|sass|less)$/i,
    /\.map$/,
    /package-lock\.json$/,
    /yarn\.lock$/,
    /pnpm-lock\.yaml$/,
  ];

  return !excludePatterns.some((pattern) => pattern.test(path));
}

/**
 * Main function: Fetch all relevant files from a GitHub repository
 */
export async function getFullRepoFiles(
  repoUrl: string,
  onProgress?: (message: string) => void
): Promise<RepoData> {
  onProgress?.("Parsing repository URL...");
  const { owner, repo } = parseRepoUrl(repoUrl);

  onProgress?.(`Fetching repository information for ${owner}/${repo}...`);
  const repoInfo = await fetchRepoInfo(owner, repo);

  onProgress?.("Fetching repository file tree...");
  const tree = await fetchRepoTree(owner, repo, repoInfo.default_branch);

  // Filter to only blob (file) entries
  const fileEntries = tree.filter((item: any) => item.type === "blob");
  
  onProgress?.(`Found ${fileEntries.length} files, filtering relevant ones...`);
  const relevantFiles = fileEntries.filter((item: any) => isRelevantFile(item.path));
  
  onProgress?.(`Selected ${relevantFiles.length} relevant files for analysis`);

  // Fetch content for relevant files (limit to first 20 to avoid rate limits)
  const filesToFetch = relevantFiles.slice(0, 20);
  const files: FileData[] = [];

  for (let i = 0; i < filesToFetch.length; i++) {
    const file = filesToFetch[i];
    try {
      onProgress?.(`Reading file ${i + 1}/${filesToFetch.length}: ${file.path}`);
      const content = await fetchFileContent(owner, repo, file.sha);
      
      // Skip very large files (> 50KB)
      if (content.length > 50000) {
        onProgress?.(`Skipping large file: ${file.path}`);
        continue;
      }

      files.push({
        path: file.path,
        content: content,
      });
    } catch (error) {
      console.error(`Failed to fetch ${file.path}:`, error);
      onProgress?.(`Failed to read: ${file.path}`);
    }
  }

  onProgress?.(`Successfully fetched ${files.length} files`);

  return {
    files,
    repoInfo: {
      name: repoInfo.name,
      description: repoInfo.description || "",
      language: repoInfo.language || "Unknown",
      stars: repoInfo.stargazers_count,
      forks: repoInfo.forks_count,
      defaultBranch: repoInfo.default_branch,
    },
  };
}
