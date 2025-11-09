"use client";

import { usePathname } from "next/navigation";

import { Background } from "@/components/background";
import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <main className={isAdminRoute ? "" : ""}>{children}</main>
            {!isAdminRoute && (
                <Background variant="bottom">
                    <Footer />
                </Background>
            )}
        </>
    );
}
