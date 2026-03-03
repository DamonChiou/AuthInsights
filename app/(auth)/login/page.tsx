"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/src/lib/validations/auth";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setError("");
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-sky-900 mb-1">Welcome back</h2>
            <p className="text-sm text-slate-500 mb-6">Log in to your AuthInsights account</p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                    </label>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        className="w-full px-4 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                        Password
                    </label>
                    <input
                        {...register("password")}
                        id="password"
                        type="password"
                        className="w-full px-4 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-sky-600 text-white py-2.5 px-4 rounded-lg hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition"
                >
                    {isSubmitting ? "Logging in..." : "Log In"}
                </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-sky-600 hover:underline font-medium">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}
