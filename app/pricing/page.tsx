import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg=-white">
            {/*Top bar */}
            <header className="bg-white border-b border-sky-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-sky-700">
                        AuthInsights
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="text-sm text-sky-700 border border-sky-200 px-4 py-2 rounded-lg hover:bg-sky-50 transition">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-sky-50 py-20 px-6 text-center">
                <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                    Free during early access
                </span>
                <h1 className="text-4xl font-bold text-sky-900 mb-4">Simple, transparent pricing</h1>
                <p className="text-lg text-slate-500 max-w-xl mx-auto">
                    Join now and get full access for free while we&apos;re in early access. No credit card required.
                </p>
            </section>

             {/* Pricing card */}
            <section className="py-20 px-6">
                <div className="max-w-md mx-auto bg-white rounded-2xl border border-sky-100 shadow-md p-10">

                    <p className="text-sm font-medium text-sky-600 mb-2">Practice Plan</p>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-5xl font-bold text-sky-900">Free</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">
                        <span className="line-through">$99/month</span>
                        {" "}· during early access
                    </p>

                    <ul className="space-y-3 mb-8">
                        {[
                            "Unlimited PA outcome lookups",
                            "Biosimilar-level approval rate data",
                            "Breakdown by initial PA and appeals",
                            "All insurance plans covered",
                            "Submit and contribute your own outcomes",
                            "New drugs and payers added regularly",
                        ].map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                                <span className="text-sky-500 mt-0.5">✓</span>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <a
                        href="mailto:authinsights@gmail.com"
                        className="block w-full text-center bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700 transition"
                    >
                        Request Access
                    </a>
                    <p className="text-xs text-slate-400 text-center mt-3">
                        We&apos;ll reach out within 1 business day.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6 bg-sky-50">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-2xl font-bold text-sky-900 text-center mb-10">Common questions</h2>
                    {[
                        {
                            q: "Where does the data come from?",
                            a: "All outcomes are submitted by rheumatology providers — real results from actual PA submissions at practices like yours.",
                        },
                        {
                            q: "How many practices are contributing?",
                            a: "We're in early access. The more practices that join and contribute, the more accurate and comprehensive the data becomes.",
                        },
                        {
                            q: "Can I cancel anytime?",
                            a: "Yes. No contracts, no commitment. Cancel anytime from your account.",
                        },
                        {
                            q: "Is patient data ever stored?",
                            a: "No. Outcome reports contain only drug, insurance, indication, and result — never any patient identifiers.",
                        },
                    ].map(({ q, a }) => (
                        <div key={q}>
                            <p className="font-semibold text-sky-900 mb-1">{q}</p>
                            <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
                        </div>
                    ))}
                </div>
            </section>


        </div>
    )
}