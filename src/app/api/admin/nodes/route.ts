import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const nodes = await prisma.node.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(nodes);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch nodes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const node = await prisma.node.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        iconUrl: data.iconUrl || null,
        category: data.category,
        version: data.version,
        author: data.author,
        downloads: data.downloads || 0,
        rating: data.rating || 0,
        tags: data.tags,
        longDescription: data.longDescription,
        features: data.features,
        requirements: data.requirements,
        published: data.published || false,
        githubUrl: data.githubUrl || null,
      },
    });

    return NextResponse.json(node);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error creating node:", err);
    return NextResponse.json(
      { error: "Failed to create node", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
