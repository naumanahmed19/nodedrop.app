import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const nodes = await prisma.node.findMany({
      where: { published: true },
      orderBy: { downloads: "desc" },
    });

    // Add downloadUrl to each node based on githubUrl
    const nodesWithDownloadUrl = nodes.map(node => ({
      ...node,
      downloadUrl: node.githubUrl 
        ? `${node.githubUrl}/archive/refs/heads/main.zip`
        : null,
    }));

    return NextResponse.json(nodesWithDownloadUrl);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch nodes" },
      { status: 500 }
    );
  }
}
