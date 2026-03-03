"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar({ userName }: { userName: string }) {
    const firstLetter = userName.charAt(0).toUpperCase();
    return (
        <nav className="bg-white border-b border-sky-100 shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/dashboard" className="text-xl font-bold text-sky-700">
                    AuthInsights
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-semibold">
                        {firstLetter}
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{userName}</span>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-md hover:bg-sky-50 transition"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </nav>
    );
}
