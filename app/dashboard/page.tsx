import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Welcome card */}
            <div className="bg-sky-100 border-l-4 border-sky-500 rounded-xl p-6 mb-8">
                <p className="text-sm text-sky-600 font-medium mb-1">Welcome back</p>
                <h2 className="text-2xl font-bold text-sky-900">{session.user.name}</h2>
                <p className="text-slate-500 text-sm mt-1">{session.user.email}</p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/biosimilar-lookup"
                    className="group bg-white rounded-xl border border-sky-100 p-6 hover:border-sky-300 hover:shadow-md transition-all block"
                >
                    
                    <h2 className="text-lg font-semibold text-sky-900 mb-1 group-hover:text-sky-600 transition-colors">
                        Prior Auth Lookup
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Community insights on prior authorization requests, see what has and hasn&apos;t worked for other clinics.
                    </p>
                </Link>

                <Link
                    href="/dashboard/pa-outcomes/submit"
                    className="group bg-white rounded-xl border border-sky-100 p-6 hover:border-sky-300 hover:shadow-md transition-all block"
                >
                    
                    <h2 className="text-lg font-semibold text-sky-900 mb-1 group-hover:text-sky-600 transition-colors">
                        Submit PA Outcome
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Report a PA approval or denial to help other clinics know what each insurance prefers.
                    </p>
                </Link>
            </div>
        </main>
    );
}
