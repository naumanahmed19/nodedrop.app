"use client";

import { useState, useMemo, useEffect } from "react";

import { Search, Download, Star, Tag } from "lucide-react";

import { Background } from "@/components/background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type Node } from "@/lib/marketplace-data";

export const Marketplace = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await fetch("/api/nodes");
                if (response.ok) {
                    const data = await response.json();
                    setNodes(data);
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("Failed to fetch nodes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNodes();
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(nodes.map((node) => node.category));
        return ["All", ...Array.from(cats)];
    }, [nodes]);

    const filteredNodes = useMemo(() => {
        return nodes.filter((node) => {
            const matchesSearch =
                node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                node.tags.some((tag) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                );

            const matchesCategory =
                selectedCategory === "All" || node.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory, nodes]);

    const handleDownload = (node: Node) => {
        if (node.downloadUrl) {
            // Download from GitHub as ZIP
            window.open(node.downloadUrl, '_blank');
        } else if (node.githubUrl) {
            // Fallback: construct download URL from githubUrl
            const downloadUrl = `${node.githubUrl}/archive/refs/heads/main.zip`;
            window.open(downloadUrl, '_blank');
        } else {
            alert(`${node.title} v${node.version} - Download not available`);
        }
    };

    return (
        <Background>
            <section className="pb-28 pt-20 lg:pb-32 lg:pt-28">
                <div className="container">
                    {/* Header */}
                    <div className="mx-auto mt-10 max-w-4xl text-center lg:mt-16">
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            Discover Nodes
                        </h1>
                        <p className="text-muted-foreground mt-4 text-lg leading-relaxed md:text-xl">
                            Browse and download nodes to extend your workflow automation
                            capabilities
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mx-auto mt-10 max-w-4xl space-y-6 lg:mt-12">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2" />
                            <Input
                                type="text"
                                placeholder="Search nodes by name, description, or tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-12 pl-11 text-base"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-muted-foreground mx-auto mt-8 max-w-4xl text-sm">
                        Showing {filteredNodes.length} of {nodes.length} nodes
                    </div>

                    {/* Nodes Grid */}
                    {loading ? (
                        <div className="text-center py-12">Loading nodes...</div>
                    ) : (
                        <div className="mx-auto mt-6 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3 lg:mt-8">
                            {filteredNodes.map((node) => (
                                <Card
                                    key={node.id}
                                    className="group cursor-pointer transition-all hover:shadow-lg"
                                    onClick={() => setSelectedNode(node)}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-12 items-center justify-center rounded-lg border bg-gradient-to-br from-primary/10 to-primary/5 text-2xl">
                                                    {node.iconUrl ? (
                                                        <img
                                                            src={node.iconUrl}
                                                            alt={node.title}
                                                            className="size-10 object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                e.currentTarget.parentElement!.textContent = node.icon;
                                                            }}
                                                        />
                                                    ) : (
                                                        node.icon
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                                        {node.title}
                                                    </CardTitle>
                                                    <div className="text-muted-foreground mt-1 text-xs">
                                                        v{node.version}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <CardDescription className="line-clamp-2 text-sm">
                                            {node.description}
                                        </CardDescription>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Download className="size-3.5" />
                                                <span>{node.downloads.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                                                <span>{node.rating}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            {node.tags.slice(0, 3).map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && filteredNodes.length === 0 && (
                        <div className="text-muted-foreground mx-auto mt-12 max-w-md text-center">
                            <p className="text-lg">No nodes found matching your search.</p>
                            <p className="mt-2 text-sm">
                                Try adjusting your search terms or filters.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Node Detail Dialog */}
            <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
                    {selectedNode && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start gap-4">
                                    <div className="flex size-16 items-center justify-center rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 text-4xl">
                                        {selectedNode.iconUrl ? (
                                            <img
                                                src={selectedNode.iconUrl}
                                                alt={selectedNode.title}
                                                className="size-14 object-contain p-2"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.textContent = selectedNode.icon;
                                                }}
                                            />
                                        ) : (
                                            selectedNode.icon
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <DialogTitle className="text-2xl">
                                            {selectedNode.title}
                                        </DialogTitle>
                                        <DialogDescription className="mt-2">
                                            {selectedNode.description}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6 pt-4">
                                {/* Stats */}
                                <div className="flex flex-wrap gap-6 text-sm">
                                    <div>
                                        <div className="text-muted-foreground">Version</div>
                                        <div className="font-medium">{selectedNode.version}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Author</div>
                                        <div className="font-medium">{selectedNode.author}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Category</div>
                                        <div className="font-medium">{selectedNode.category}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Downloads</div>
                                        <div className="font-medium">
                                            {selectedNode.downloads.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Rating</div>
                                        <div className="flex items-center gap-1 font-medium">
                                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                            {selectedNode.rating}
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                        <Tag className="size-4" />
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNode.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Long Description */}
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold">About</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {selectedNode.longDescription}
                                    </p>
                                </div>

                                {/* Features */}
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold">Features</h3>
                                    <ul className="text-muted-foreground space-y-1.5 text-sm">
                                        {selectedNode.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Requirements */}
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold">Requirements</h3>
                                    <ul className="text-muted-foreground space-y-1.5 text-sm">
                                        {selectedNode.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Download Button */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        className="flex-1"
                                        size="lg"
                                        onClick={() => handleDownload(selectedNode)}
                                    >
                                        <Download className="mr-2 size-4" />
                                        Download Node
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setSelectedNode(null)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Background>
    );
};
