"use client";

import { useEffect, useState } from "react";

import { GithubIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fetchNodeFromGitHub, generateNodeFeatures, generateNodeRequirements } from "@/lib/github-node-parser";

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

interface NodeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    node: Node | null;
    onSave: (data: Partial<Node>) => void;
}

export function NodeDialog({ open, onOpenChange, node, onSave }: NodeDialogProps) {
    const [githubUrl, setGithubUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon: "",
        iconUrl: "",
        category: "",
        version: "",
        author: "",
        downloads: 0,
        rating: 0,
        tags: "",
        longDescription: "",
        features: "",
        requirements: "",
        published: false,
        githubUrl: "",
    });

    useEffect(() => {
        if (node) {
            setFormData({
                title: node.title,
                description: node.description,
                icon: node.icon,
                iconUrl: node.iconUrl || "",
                category: node.category,
                version: node.version,
                author: node.author,
                downloads: node.downloads,
                rating: node.rating,
                tags: node.tags.join(", "),
                longDescription: node.longDescription,
                features: node.features.join("\n"),
                requirements: node.requirements.join("\n"),
                published: node.published,
                githubUrl: node.githubUrl || "",
            });
        } else {
            setFormData({
                title: "",
                description: "",
                icon: "📦",
                iconUrl: "",
                category: "",
                version: "1.0.0",
                author: "",
                downloads: 0,
                rating: 0,
                tags: "",
                longDescription: "",
                features: "",
                requirements: "",
                published: false,
                githubUrl: "",
            });
            setGithubUrl("");
            setError("");
        }
    }, [node, open]);

    const handleFetchFromGitHub = async () => {
        if (!githubUrl) {
            setError("Please enter a GitHub URL");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const nodeData = await fetchNodeFromGitHub(githubUrl);
            const features = generateNodeFeatures(nodeData);
            const requirements = generateNodeRequirements(nodeData);

            setFormData({
                title: nodeData.displayName || nodeData.name,
                description: nodeData.description || `${nodeData.displayName} node for NodeDrop`,
                icon: nodeData.icon || "📦",
                iconUrl: nodeData.iconUrl || "",
                category: nodeData.category || "General",
                version: nodeData.version || "1.0.0",
                author: nodeData.owner || "Community",
                downloads: 0,
                rating: 0,
                tags: nodeData.tags?.join(", ") || nodeData.name,
                longDescription: nodeData.description || `${nodeData.displayName} node for NodeDrop workflow automation. Fetched from GitHub repository.`,
                features: features.join("\n"),
                requirements: requirements.join("\n"),
                published: false,
                githubUrl: githubUrl,
            });
            setError("");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Failed to fetch node from GitHub");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...formData,
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            features: formData.features.split("\n").filter(Boolean),
            requirements: formData.requirements.split("\n").filter(Boolean),
            downloads: Number(formData.downloads),
            rating: Number(formData.rating),
        };

        onSave(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{node ? "Edit Node" : "Add Node from GitHub"}</DialogTitle>
                    <DialogDescription>
                        {node ? "Update node information" : "Enter a GitHub repository URL to import a node"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!node && (
                        <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                            <div className="space-y-2">
                                <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="githubUrl"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/node-drop/mongodb"
                                        disabled={loading}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleFetchFromGitHub}
                                        disabled={loading || !githubUrl}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 size-4 animate-spin" />
                                                Fetching...
                                            </>
                                        ) : (
                                            <>
                                                <GithubIcon className="mr-2 size-4" />
                                                Fetch
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {error && (
                                    <p className="text-sm text-destructive">{error}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Enter the GitHub URL of a NodeDrop node repository (e.g., https://github.com/node-drop/mongodb)
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon (Emoji) *</Label>
                            <Input
                                id="icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="📦"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description *</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="longDescription">Long Description *</Label>
                        <Textarea
                            id="longDescription"
                            value={formData.longDescription}
                            onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="Database"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="version">Version *</Label>
                            <Input
                                id="version"
                                value={formData.version}
                                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                placeholder="1.0.0"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="author">Author *</Label>
                            <Input
                                id="author"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="downloads">Downloads</Label>
                            <Input
                                id="downloads"
                                type="number"
                                value={formData.downloads}
                                onChange={(e) => setFormData({ ...formData, downloads: Number(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating (0-5)</Label>
                            <Input
                                id="rating"
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated) *</Label>
                        <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="database, mongodb, nosql"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="features">Features (one per line) *</Label>
                        <Textarea
                            id="features"
                            value={formData.features}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                            rows={4}
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="requirements">Requirements (one per line) *</Label>
                        <Textarea
                            id="requirements"
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            rows={3}
                            placeholder="Node.js 16+&#10;MongoDB connection"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                        />
                        <Label htmlFor="published">Published</Label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {node ? "Update" : "Create"} Node
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
