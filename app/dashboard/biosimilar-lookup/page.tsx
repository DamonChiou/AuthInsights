"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Medication = { id: string; genericName: string; brandName: string | null };
type Insurance = { id: string; name: string };

type PAOutcomeResult = {
    id: string;
    outcome: string;
    indication: string | null;
    requestType: string | null;
    notes: string | null;
    submittedAt: string;
    medication: { genericName: string; brandName: string | null };
    insurance: { payerName: string };
};

export default function PAOutcomesLookupPage() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [insurances, setInsurances] = useState<Insurance[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState<PAOutcomeResult[] | null>(null);
    const [selectedGenericName, setSelectedGenericName] = useState("");
    const [selectedInsuranceId, setSelectedInsuranceId] = useState("");
    const [selectedBiosimilar, setSelectedBiosimilar] = useState("");

    // Locked display values — only update when search is submitted
    const [displayGenericName, setDisplayGenericName] = useState("");
    const [displayInsuranceName, setDisplayInsuranceName] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const [medsRes, insRes] = await Promise.all([
                    fetch("/api/medications"),
                    fetch("/api/insurances"),
                ]);
                const meds = await medsRes.json();
                const ins = await insRes.json();
                setMedications(Array.isArray(meds) ? meds : []);
                setInsurances(Array.isArray(ins) ? ins : []);
            } catch (err) {
                setError("Failed to load medications and insurances. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const genericNames = [...new Set(medications.map((med) => med.genericName))].sort();
    const availableBiosimilars = medications
        .filter((m) => m.genericName === selectedGenericName && m.brandName)
        .sort((a, b) => (a.brandName ?? "").localeCompare(b.brandName ?? ""));

    const handleSearch = async () => {
        if (!selectedGenericName || !selectedInsuranceId) {
            setError("Please select both a medication and an insurance.");
            return;
        }
        setError("");
        setSearching(true);
        try {
            const res = await fetch(
                `/api/pa-outcomes?genericName=${encodeURIComponent(selectedGenericName)}&insuranceId=${encodeURIComponent(selectedInsuranceId)}`
            );
            if (!res.ok) throw new Error("Search failed. Please try again.");
            const data = await res.json();
            setResults(data);
            setDisplayGenericName(selectedGenericName);
            setDisplayInsuranceName(insurances.find((i) => i.id === selectedInsuranceId)?.name ?? "");
        } catch (err) {
            setError("Search failed. Please try again.");
        } finally {
            setSearching(false);
        }
    };

    if (loading) {
        return <div className="p-4">Loading medications and insurances...</div>;
    }

    // Apply biosimilar filter client-side
    const filteredResults = selectedBiosimilar && results
        ? results.filter((r) => r.medication.brandName === selectedBiosimilar)
        : results;

    // Summary stats — computed here so the JSX stays clean
    const total = filteredResults?.length ?? 0;
    const approved = filteredResults?.filter((r) => r.outcome === "approved") ?? [];
    const denied = filteredResults?.filter((r) => r.outcome === "denied") ?? [];
    const approvalPct = total > 0 ? Math.round((approved.length / total) * 100) : 0;

    const initialReports = filteredResults?.filter((r) => r.requestType === "initial") ?? [];
    const appealReports = filteredResults?.filter((r) => r.requestType === "appeal") ?? [];
    const initialPct = initialReports.length > 0
        ? Math.round((initialReports.filter((r) => r.outcome === "approved").length / initialReports.length) * 100)
        : null;
    const appealPct = appealReports.length > 0
        ? Math.round((appealReports.filter((r) => r.outcome === "approved").length / appealReports.length) * 100)
        : null;

    const now = new Date();
    const recentCount = filteredResults?.filter((r) => {
        const days = (now.getTime() - new Date(r.submittedAt).getTime()) / (1000 * 60 * 60 * 24);
        return days <= 30;
    }).length ?? 0;


    return (
        <div className="max-w-4xl mx-auto p-8">
            <Link href="/dashboard" className="text-sm text-sky-600 hover:text-sky-800 mb-4 inline-block">
                ← Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-sky-900">PA Outcomes Lookup</h1>
                <Link
                    href="/dashboard/pa-outcomes/submit"
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm font-medium"
                >
                    Submit a Report
                </Link>
            </div>

            <p className="text-slate-500 mb-6">
                Search real-world PA outcomes submitted by rheumatology providers.
            </p>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            {/* Search Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-sky-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Drug Class</label>
                        <select
                            value={selectedGenericName}
                            onChange={(e) => {
                                setSelectedGenericName(e.target.value);
                                setSelectedBiosimilar("");
                            }}
                            className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="">Select a drug class</option>
                            {genericNames.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Plan</label>
                        <select
                            value={selectedInsuranceId}
                            onChange={(e) => setSelectedInsuranceId(e.target.value)}
                            className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="">Select an insurance</option>
                            {insurances.map((ins) => (
                                <option key={ins.id} value={ins.id}>{ins.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {selectedGenericName && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Specific Biosimilar <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <select
                            value={selectedBiosimilar}
                            onChange={(e) => setSelectedBiosimilar(e.target.value)}
                            className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="">All biosimilars</option>
                            {availableBiosimilars.map((med) => (
                                <option key={med.id} value={med.brandName ?? ""}>{med.brandName}</option>
                            ))}
                        </select>
                    </div>
                )}
                <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    {searching ? "Searching..." : "Search"}
                </button>
            </div>

            {/* Results */}
            {filteredResults !== null && (
                <div className="space-y-6">

                    {/* Summary card */}
                    {total > 0 ? (
                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-sky-900 mb-2">
                                Summary — {selectedBiosimilar || displayGenericName} · {displayInsuranceName}
                            </h2>
                            <p className="text-sky-800 text-lg font-medium">
                                {approvalPct}% approval rate
                                <span className="text-sky-700 font-normal text-sm ml-2">
                                    ({approved.length} approved, {denied.length} denied of {total} total)
                                </span>
                            </p>
                            {(initialPct !== null || appealPct !== null) && (
                                <p className="text-sky-700 text-sm mt-1">
                                    {initialPct !== null && `Initial PA: ${initialPct}% (${initialReports.filter((r) => r.outcome === "approved").length} of ${initialReports.length})`}
                                    {initialPct !== null && appealPct !== null && " · "}
                                    {appealPct !== null && `Appeals: ${appealPct}% (${appealReports.filter((r) => r.outcome === "approved").length} of ${appealReports.length})`}
                                </p>
                            )}
                            {recentCount > 0 && (
                                <p className="text-sky-700 text-sm mt-1">
                                    {recentCount} report{recentCount !== 1 ? "s" : ""} in the last 30 days
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 text-center">
                            <p className="text-slate-500">
                                No reports yet for this combination.{" "}
                                <Link href="/dashboard/pa-outcomes/submit" className="text-sky-600 hover:underline">
                                    Be the first to submit one.
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* Individual report cards */}
                    {total > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">All Reports ({total})</h2>
                            <div className="space-y-4">
                                {filteredResults!.map((result) => (
                                    <div
                                        key={result.id}
                                        className={`p-4 rounded-lg border ${
                                            result.outcome === "approved"
                                                ? "border-green-300 bg-green-50"
                                                : "border-red-300 bg-red-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`font-semibold capitalize ${
                                                    result.outcome === "approved" ? "text-green-700" : "text-red-700"
                                                }`}>
                                                    {result.outcome}
                                                </span>
                                                <span className="text-gray-700 font-medium">
                                                    {result.medication.brandName || result.medication.genericName}
                                                </span>
                                                {result.requestType && (
                                                    <span className="text-xs text-gray-500 bg-white border rounded px-2 py-0.5">
                                                        {result.requestType === "initial" ? "Initial PA" : "Appeal"}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-gray-400 text-sm">
                                                {new Date(result.submittedAt).toLocaleDateString("en-US", {
                                                    year: "numeric", month: "short", day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            {result.indication && (
                                                <p><span className="font-medium">Indication:</span> {result.indication}</p>
                                            )}
                                            {result.notes && (
                                                <p><span className="font-medium">Notes:</span> {result.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}
