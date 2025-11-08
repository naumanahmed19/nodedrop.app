import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/admin/login");
    }

    return <AdminDashboard user={session.user} />;
}
