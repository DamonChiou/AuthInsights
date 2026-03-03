import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-white">

            {/* Top bar */}
            <header className="bg-white border-b border-sky-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-sky-700">AuthInsights</span>
                    <div className="flex items-center gap-3">
                        <Link href="/pricing" className="text-sm text-sky-700 hover:underline">
                            Pricing
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm text-sky-700 border border-sky-200 px-4 py-2 rounded-lg hover:bg-sky-50 transition"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="text-sm bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-sky-50 py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: copy */}
                    <div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="inline-block bg-sky-100 text-sky-700 text-sm font-medium px-4 py-1.5 rounded-full">
                                Built for rheumatology practices
                            </span>
                            <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full">
                                Free during early access
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold text-sky-900 tracking-tight leading-tight mb-6">
                            Know what works —<br />before you submit
                        </h1>
                        <p className="text-xl text-slate-500 mb-10 leading-relaxed">
                            Community-sourced prior authorization outcome data, organized by drug, biosimilar, and insurance plan.
                            Stop guessing — see what&apos;s actually getting approved.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="/signup"
                                className="bg-sky-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-sky-700 transition"
                            >
                                Get Started →
                            </Link>
                            <Link
                                href="/login"
                                className="border border-sky-300 text-sky-700 px-6 py-3 rounded-lg text-base font-medium hover:bg-sky-50 transition"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>

                    {/* Right: app screenshot */}
                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-sky-100 ring-1 ring-sky-100">
                            {/* Browser chrome */}
                            <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                <div className="flex-1 ml-3 bg-white rounded px-3 py-1 text-xs text-slate-400 font-mono">
                                    authinsights.com/dashboard/biosimilar-lookup
                                </div>
                            </div>
                            {/* Screenshot — drop your image at public/screenshot-lookup.png */}
                            <img
                                src="/screenshot-lookup.png"
                                alt="PA Outcomes Lookup"
                                className="w-full block"
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-sky-50 border border-sky-100 rounded-2xl p-8">
                        
                        <h3 className="text-lg font-semibold text-sky-900 mb-2">Approval rates by insurance</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            See exactly which drug and insurance combinations get approved, denied, or appealed — with real numbers.
                        </p>
                    </div>
                    <div className="bg-sky-50 border border-sky-100 rounded-2xl p-8">
                        
                        <h3 className="text-lg font-semibold text-sky-900 mb-2">Biosimilar-level data</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Compare Humira vs Cyltezo vs Hyrimoz for your specific payer. Not all biosimilars are treated equally.
                        </p>
                    </div>
                    <div className="bg-sky-50 border border-sky-100 rounded-2xl p-8">
                        
                        <h3 className="text-lg font-semibold text-sky-900 mb-2">Submitted by providers</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Real data from rheumatology clinics like yours — not insurance websites, not guesswork.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}
