interface GitHubNodeMetadata {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  iconUrl?: string;
  version: string;
  author?: string;
  category?: string;
  tags?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outputs?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: any[];
}

export async function fetchNodeFromGitHub(repoUrl: string) {
  try {
    // Parse GitHub URL to get owner and repo
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoUrl.match(urlPattern);
    
    if (!match) {
      throw new Error("Invalid GitHub URL");
    }

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, "");

    // Fetch the index.js to get node structure
    const indexUrl = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/index.js`;
    const indexResponse = await fetch(indexUrl);
    
    if (!indexResponse.ok) {
      throw new Error("Could not fetch index.js from repository");
    }

    const indexContent = await indexResponse.text();
    
    // Extract node path from index.js
    // Example: "mongodb": require("./nodes/mongodb.node.js")
    const nodePathMatch = indexContent.match(/nodes\/([^"]+\.node\.js)/);
    
    if (!nodePathMatch) {
      throw new Error("Could not find node definition in index.js");
    }

    const nodePath = nodePathMatch[0];
    
    // Fetch the actual node file
    const nodeUrl = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/${nodePath}`;
    const nodeResponse = await fetch(nodeUrl);
    
    if (!nodeResponse.ok) {
      throw new Error("Could not fetch node file");
    }

    const nodeContent = await nodeResponse.text();
    
    // Parse node metadata
    const metadata = parseNodeMetadata(nodeContent, cleanRepo);
    
    // Try to fetch the SVG icon file if it's not an emoji
    if (metadata.icon && !isEmoji(metadata.icon)) {
      // Try multiple possible locations for the icon (prioritize nodes folder)
      const possiblePaths = [
        `nodes/${metadata.icon}`, // In nodes folder (primary location)
        metadata.icon, // Direct path from node definition
        `icons/${metadata.icon}`, // In icons folder
        `assets/${metadata.icon}`, // In assets folder
      ];

      for (const path of possiblePaths) {
        const iconUrl = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/${path}`;
        try {
          const iconResponse = await fetch(iconUrl, { method: 'HEAD' });
          if (iconResponse.ok) {
            metadata.iconUrl = iconUrl;
            metadata.icon = '📦'; // Set a default emoji as fallback
            break;
          }
        } catch {
          // Try next path
        }
      }
      
      // If no icon found, use default emoji
      if (!metadata.iconUrl) {
        metadata.icon = '📦';
      }
    }
    
    return {
      ...metadata,
      githubUrl: repoUrl,
      owner,
      repo: cleanRepo,
      downloadUrl: `https://github.com/${owner}/${cleanRepo}/archive/refs/heads/main.zip`,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching node from GitHub:", error);
    throw error;
  }
}

function parseNodeMetadata(nodeContent: string, repoName: string): GitHubNodeMetadata {
  const metadata: Partial<GitHubNodeMetadata> = {
    name: repoName,
    displayName: repoName,
    description: "",
    icon: "📦",
    version: "1.0.0",
    tags: [],
  };

  // Extract displayName
  const displayNameMatch = nodeContent.match(/displayName:\s*['"]([^'"]+)['"]/);
  if (displayNameMatch) {
    metadata.displayName = displayNameMatch[1];
  }

  // Extract name
  const nameMatch = nodeContent.match(/name:\s*['"]([^'"]+)['"]/);
  if (nameMatch) {
    metadata.name = nameMatch[1];
  }

  // Extract description
  const descriptionMatch = nodeContent.match(/description:\s*['"]([^'"]+)['"]/);
  if (descriptionMatch) {
    metadata.description = descriptionMatch[1];
  }

  // Extract icon (emoji or file)
  const iconMatch = nodeContent.match(/icon:\s*['"]([^'"]+)['"]/);
  if (iconMatch) {
    const iconValue = iconMatch[1];
    // Check if it's a file reference (e.g., "file:icon.svg" or just "icon.svg")
    if (iconValue.includes('.svg') || iconValue.startsWith('file:')) {
      // Extract just the filename
      metadata.icon = iconValue.replace('file:', '').trim();
    } else {
      metadata.icon = iconValue;
    }
  }

  // Extract version
  const versionMatch = nodeContent.match(/version:\s*['"]?([0-9.]+)['"]?/);
  if (versionMatch) {
    metadata.version = versionMatch[1];
  }

  // Extract category/group
  const groupMatch = nodeContent.match(/group:\s*\[['"]([^'"]+)['"]/);
  if (groupMatch) {
    metadata.category = groupMatch[1];
  }

  // Extract inputs (for features)
  const inputsMatch = nodeContent.match(/inputs:\s*\[([\s\S]*?)\]/);
  if (inputsMatch) {
    metadata.inputs = parseArrayContent(inputsMatch[1]);
  }

  // Extract outputs (for features)
  const outputsMatch = nodeContent.match(/outputs:\s*\[([\s\S]*?)\]/);
  if (outputsMatch) {
    metadata.outputs = parseArrayContent(outputsMatch[1]);
  }

  // Extract properties (for features)
  const propertiesMatch = nodeContent.match(/properties:\s*\[([\s\S]*?)\]/);
  if (propertiesMatch) {
    metadata.properties = parseArrayContent(propertiesMatch[1]);
  }

  return metadata as GitHubNodeMetadata;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseArrayContent(content: string): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: any[] = [];
  const objectMatches = content.matchAll(/\{[\s\S]*?\}/g);
  
  for (const match of objectMatches) {
    try {
      const obj = match[0];
      const displayNameMatch = obj.match(/displayName:\s*['"]([^'"]+)['"]/);
      const nameMatch = obj.match(/name:\s*['"]([^'"]+)['"]/);
      const typeMatch = obj.match(/type:\s*['"]([^'"]+)['"]/);
      
      if (displayNameMatch || nameMatch) {
        items.push({
          displayName: displayNameMatch?.[1] || nameMatch?.[1],
          name: nameMatch?.[1],
          type: typeMatch?.[1],
        });
      }
    } catch {
      // Skip invalid objects
    }
  }
  
  return items;
}

export function generateNodeFeatures(metadata: GitHubNodeMetadata): string[] {
  const features: string[] = [];
  
  if (metadata.inputs && metadata.inputs.length > 0) {
    features.push(`${metadata.inputs.length} input parameter(s)`);
  }
  
  if (metadata.outputs && metadata.outputs.length > 0) {
    features.push(`${metadata.outputs.length} output(s)`);
  }
  
  if (metadata.properties && metadata.properties.length > 0) {
    features.push(`${metadata.properties.length} configurable propert(ies)`);
  }
  
  features.push("Open source on GitHub");
  features.push("Community maintained");
  
  return features;
}

export function generateNodeRequirements(metadata: GitHubNodeMetadata): string[] {
  const requirements: string[] = ["Node.js 16+", "NodeDrop runtime"];
  
  // Add specific requirements based on node type
  if (metadata.name?.toLowerCase().includes("mongo")) {
    requirements.push("MongoDB connection");
  }
  
  if (metadata.name?.toLowerCase().includes("api") || 
      metadata.name?.toLowerCase().includes("http")) {
    requirements.push("Network access");
  }
  
  return requirements;
}

function isEmoji(str: string): boolean {
  const emojiRegex = /[\p{Emoji}\p{Emoji_Presentation}]/u;
  return emojiRegex.test(str) && str.length <= 4;
}

export function getNodeDownloadUrl(githubUrl: string): string {
  const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = githubUrl.match(urlPattern);
  
  if (!match) {
    throw new Error("Invalid GitHub URL");
  }

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, "");
  
  return `https://github.com/${owner}/${cleanRepo}/archive/refs/heads/main.zip`;
}
