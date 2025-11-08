import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const node = await prisma.node.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        iconUrl: data.iconUrl || null,
        category: data.category,
        version: data.version,
        author: data.author,
        downloads: data.downloads,
        rating: data.rating,
        tags: data.tags,
        longDescription: data.longDescription,
        features: data.features,
        requirements: data.requirements,
        published: data.published,
        githubUrl: data.githubUrl || null,
      },
    });

    return NextResponse.json(node);
  } catch {
    return NextResponse.json(
      { error: "Failed to update node" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const node = await prisma.node.update({
      where: { id },
      data,
    });

    return NextResponse.json(node);
  } catch {
    return NextResponse.json(
      { error: "Failed to update node" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.node.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete node" },
      { status: 500 }
    );
  }
}
