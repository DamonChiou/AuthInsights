import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-sky-50">
            <div className="py-5 px-8 bg-white border-b border-sky-100">
                <Link href="/" className="text-xl font-bold text-sky-700">AuthInsights</Link>
            </div>
            <div className="flex items-center justify-center py-12 px-4">
                {children}
            </div>
        </div>
    );
}
