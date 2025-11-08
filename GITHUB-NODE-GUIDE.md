# GitHub Node Integration Guide

## Overview
The admin panel now supports importing nodes directly from GitHub repositories. The system automatically fetches node metadata and displays the actual node icon.

## How It Works

### 1. Adding a Node from GitHub

1. Go to Admin Dashboard: `http://localhost:3001/admin`
2. Click "Add Node" button
3. Enter GitHub repository URL (e.g., `https://github.com/node-drop/mongodb`)
4. Click "Fetch" button
5. System automatically:
   - Fetches `index.js` to find node definitions
   - Reads the node file (e.g., `nodes/mongodb.node.js`)
   - Extracts metadata (name, description, icon, version, etc.)
   - Fetches the actual icon file if it's not an emoji
   - Auto-populates the form
6. Review and edit if needed
7. Click "Create Node" to save

### 2. Node Structure Expected

Your GitHub repository should follow this structure:

```
your-node-repo/
├── index.js                    # Node registry
├── nodes/
│   └── yournode.node.js       # Node definition
├── credentials/
│   └── yourcreds.credentials.js
└── icons/
    └── icon.svg               # Optional icon file
```

**index.js example:**
```javascript
module.exports = {
  nodes: {
    "mongodb": require("./nodes/mongodb.node.js"),
  },
  credentials: {
    "mongoDb": require("./credentials/mongoDb.credentials.js"),
  },
};
```

**Node file example (nodes/mongodb.node.js):**
```javascript
module.exports = {
  displayName: 'MongoDB',
  name: 'mongodb',
  icon: 'file:mongodb.svg',  // SVG icon reference
  // or: icon: 'mongodb.svg',
  // or: icon: 'icons/mongodb.svg',
  group: ['Database'],
  version: '1.0.0',
  description: 'Execute MongoDB queries',
  inputs: [
    {
      displayName: 'Connection',
      name: 'connection',
      type: 'string',
    },
  ],
  outputs: [
    {
      displayName: 'Result',
      name: 'result',
      type: 'json',
    },
  ],
  properties: [
    {
      displayName: 'Query',
      name: 'query',
      type: 'string',
    },
  ],
};
```

### 3. Icon Handling (SVG)

The system supports SVG icons from your GitHub repository:

**SVG Icon Reference:**
```javascript
icon: 'file:mongodb.svg'
// or
icon: 'mongodb.svg'
```

**Icon Location:**
The system will search for your SVG icon in multiple locations (in order):
1. **Nodes folder: `nodes/mongodb.svg`** (Primary location)
2. Direct path: `mongodb.svg`
3. Icons folder: `icons/mongodb.svg`
4. Assets folder: `assets/mongodb.svg`

**How it works:**
1. System extracts icon filename from node definition
2. Tries multiple common locations in your repo
3. Fetches from `https://raw.githubusercontent.com/owner/repo/main/path/to/icon.svg`
4. If found, displays the actual SVG icon
5. If not found, falls back to a default emoji (📦)

**SVG Requirements:**
- Must be a valid SVG file
- Should be publicly accessible in your GitHub repo
- Recommended size: 64x64px or larger
- Works best with single-color or simple designs

**Example Repository Structure:**
```
your-node-repo/
├── index.js
├── nodes/
│   ├── mongodb.node.js
│   └── mongodb.svg          ← Icon here (recommended location)
└── credentials/
    └── mongodb.credentials.js
```

**Alternative Structure:**
```
your-node-repo/
├── index.js
├── nodes/
│   └── mongodb.node.js
├── icons/
│   └── mongodb.svg          ← Icon here (also works)
└── credentials/
    └── mongodb.credentials.js
```

### 4. Downloading Nodes

When users click "Download Node" in the marketplace:
- System generates GitHub ZIP download URL
- Opens: `https://github.com/owner/repo/archive/refs/heads/main.zip`
- User gets the complete node package

### 5. Metadata Extraction

The parser automatically extracts:

| Field | Source | Example |
|-------|--------|---------|
| Display Name | `displayName` | "MongoDB" |
| Name | `name` | "mongodb" |
| Description | `description` | "Execute MongoDB queries" |
| Icon | `icon` | "🗄️" or "file:icon.svg" |
| Version | `version` | "1.0.0" |
| Category | `group[0]` | "Database" |
| Features | `inputs`, `outputs`, `properties` | Auto-generated |
| Requirements | Based on node type | Auto-generated |

### 6. Auto-Generated Features

The system automatically generates features based on:
- Number of inputs
- Number of outputs
- Number of properties
- Plus: "Open source on GitHub", "Community maintained"

### 7. Auto-Generated Requirements

Requirements are generated based on:
- Node.js 16+ (always)
- NodeDrop runtime (always)
- Specific requirements based on node name:
  - MongoDB nodes → "MongoDB connection"
  - API/HTTP nodes → "Network access"

## Example Repositories

### MongoDB Node
```
https://github.com/node-drop/mongodb
```

### HTTP Request Node
```
https://github.com/node-drop/http-request
```

## Troubleshooting

### "Could not fetch index.js"
- Ensure repository is public
- Check that `index.js` exists in the root
- Verify the URL is correct

### "Could not find node definition"
- Ensure `index.js` has the correct format
- Check that node path is in `nodes/` directory

### "Icon not loading"
- Verify icon file exists in repository
- Check icon path in node definition
- Ensure icon file is accessible (public repo)

### "Invalid GitHub URL"
- Use full GitHub URL: `https://github.com/owner/repo`
- Don't include `.git` extension
- Don't include branch names

## API Endpoints

### Fetch Node from GitHub (Client-side)
```typescript
import { fetchNodeFromGitHub } from '@/lib/github-node-parser';

const nodeData = await fetchNodeFromGitHub('https://github.com/node-drop/mongodb');
```

### Get Download URL
```typescript
import { getNodeDownloadUrl } from '@/lib/github-node-parser';

const downloadUrl = getNodeDownloadUrl('https://github.com/node-drop/mongodb');
// Returns: https://github.com/node-drop/mongodb/archive/refs/heads/main.zip
```

## Database Schema

Nodes now include:
- `githubUrl` - Original GitHub repository URL
- `iconUrl` - Direct URL to icon file (if applicable)

## Security Notes

1. All GitHub fetches are done client-side
2. No GitHub API token required (uses raw.githubusercontent.com)
3. Only public repositories are supported
4. Icon URLs are stored but not proxied

## Future Enhancements

Potential improvements:
- Support for private repositories (with GitHub token)
- Version management (fetch specific tags/releases)
- Automatic updates when GitHub repo changes
- Icon caching/proxying
- Validation of node structure
- Preview before saving
