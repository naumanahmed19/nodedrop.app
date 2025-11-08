"use client";

import Link from "next/link";

import { LogOut, Package } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
    user: {
        name?: string | null;
        email?: string;
    };
    onSignOut: () => void;
}

export function AdminHeader({ user, onSignOut }: AdminHeaderProps) {
    const initials = user.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || user.email?.[0].toUpperCase() || "A";

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/admin" className="flex items-center gap-2 font-semibold">
                        <Package className="size-6" />
                        <span>NodeDrop Admin</span>
                    </Link>
                    <nav className="flex items-center gap-4 text-sm">
                        <Link
                            href="/admin"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Nodes
                        </Link>
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            View Site
                        </Link>
                    </nav>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative size-9 rounded-full">
                            <Avatar className="size-9">
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-muted-foreground text-xs leading-none">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onSignOut}>
                            <LogOut className="mr-2 size-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
