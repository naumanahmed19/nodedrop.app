import { redirect } from "next/navigation";

import { AdminSettings } from "@/components/admin/admin-settings";
import { auth } from "@/lib/auth";

export default async function AdminSettingsPage() {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/admin/login");
    }

    return <AdminSettings user={session.user} />;
}
