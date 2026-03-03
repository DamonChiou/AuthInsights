import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import Navbar from "@/src/components/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="min-h-screen bg-sky-50">
            <Navbar userName={session.user.name ?? session.user.email ?? "User"} />
            <main>{children}</main>
        </div>
    );
}