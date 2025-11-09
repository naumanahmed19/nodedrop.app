"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminSettingsProps {
    user: {
        name?: string | null;
        email?: string;
    };
}

export function AdminSettings({ user }: AdminSettingsProps) {
    const router = useRouter();
    const [emailLoading, setEmailLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Email form state
    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/admin/login");
    };

    const handleEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailLoading(true);

        try {
            const response = await fetch("/api/admin/settings/email", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    newEmail,
                    password: emailPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Email updated successfully. Please sign in again.");
                setNewEmail("");
                setEmailPassword("");
                setTimeout(() => {
                    handleSignOut();
                }, 1500);
            } else {
                toast.error(data.error || "Failed to update email");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setEmailLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await fetch("/api/admin/settings/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password updated successfully. Please sign in again.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setTimeout(() => {
                    handleSignOut();
                }, 1500);
            } else {
                toast.error(data.error || "Failed to update password");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminHeader user={user} onSignOut={handleSignOut} />

            <main className="container py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Account Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your admin account settings
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Email Change Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Email</CardTitle>
                            <CardDescription>
                                Update your admin email address. You will be signed out after
                                changing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleEmailChange} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-email">Current Email</Label>
                                    <Input
                                        id="current-email"
                                        type="email"
                                        value={user.email || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-email">New Email</Label>
                                    <Input
                                        id="new-email"
                                        type="email"
                                        placeholder="Enter new email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-password">
                                        Current Password (for verification)
                                    </Label>
                                    <Input
                                        id="email-password"
                                        type="password"
                                        placeholder="Enter your current password"
                                        value={emailPassword}
                                        onChange={(e) => setEmailPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={emailLoading}>
                                    {emailLoading ? "Updating..." : "Update Email"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Password Change Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your admin password. You will be signed out after
                                changing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder="Enter new password (min 6 characters)"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <Button type="submit" disabled={passwordLoading}>
                                    {passwordLoading ? "Updating..." : "Update Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
