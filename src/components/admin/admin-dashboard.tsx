"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/admin-header";
import { NodeDialog } from "@/components/admin/node-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Node {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconUrl?: string;
    category: string;
    version: string;
    author: string;
    downloads: number;
    rating: number;
    tags: string[];
    longDescription: string;
    features: string[];
    requirements: string[];
    published: boolean;
    githubUrl?: string;
}

interface AdminDashboardProps {
    user: {
        name?: string | null;
        email?: string;
    };
}

export function AdminDashboard({ user }: AdminDashboardProps) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<Node | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchNodes();
    }, []);

    const fetchNodes = async () => {
        try {
            const response = await fetch("/api/admin/nodes");
            if (response.ok) {
                const data = await response.json();
                setNodes(data);
            }
        } catch {
            toast.error("Failed to fetch nodes");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/admin/login");
    };

    const handleCreate = () => {
        setEditingNode(null);
        setDialogOpen(true);
    };

    const handleEdit = (node: Node) => {
        setEditingNode(node);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this node?")) return;

        try {
            const response = await fetch(`/api/admin/nodes/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Node deleted successfully");
                fetchNodes();
            } else {
                toast.error("Failed to delete node");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    const handleTogglePublish = async (id: string, published: boolean) => {
        try {
            const response = await fetch(`/api/admin/nodes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ published: !published }),
            });

            if (response.ok) {
                toast.success(`Node ${!published ? "published" : "unpublished"}`);
                fetchNodes();
            } else {
                toast.error("Failed to update node");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    const handleSave = async (data: Partial<Node>) => {
        try {
            const url = editingNode
                ? `/api/admin/nodes/${editingNode.id}`
                : "/api/admin/nodes";
            const method = editingNode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success(`Node ${editingNode ? "updated" : "created"} successfully`);
                setDialogOpen(false);
                fetchNodes();
            } else {
                toast.error("Failed to save node");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminHeader user={user} onSignOut={handleSignOut} />

            <main className="container py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Node Management</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage marketplace nodes
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 size-4" />
                        Add Node
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Icon</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Version</TableHead>
                                    <TableHead>Downloads</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nodes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12">
                                            No nodes found. Create your first node!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    nodes.map((node) => (
                                        <TableRow key={node.id}>
                                            <TableCell>
                                                <div className="text-2xl flex items-center justify-center">
                                                    {node.iconUrl ? (
                                                        <img
                                                            src={node.iconUrl}
                                                            alt={node.title}
                                                            className="size-8 object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                e.currentTarget.parentElement!.textContent = node.icon;
                                                            }}
                                                        />
                                                    ) : (
                                                        node.icon
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{node.title}</TableCell>
                                            <TableCell>{node.category}</TableCell>
                                            <TableCell>{node.version}</TableCell>
                                            <TableCell>{node.downloads.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={node.published ? "default" : "secondary"}>
                                                    {node.published ? "Published" : "Draft"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => handleTogglePublish(node.id, node.published)}
                                                    >
                                                        {node.published ? (
                                                            <EyeOff className="size-4" />
                                                        ) : (
                                                            <Eye className="size-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => handleEdit(node)}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => handleDelete(node.id)}
                                                    >
                                                        <Trash2 className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </main>

            <NodeDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                node={editingNode}
                onSave={handleSave}
            />
        </div>
    );
}
