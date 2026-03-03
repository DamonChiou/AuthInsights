"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const INDICATIONS = [
    "Rheumatoid Arthritis (RA)",
    "Psoriatic Arthritis (PsA)",
    "Ankylosing Spondylitis / Axial SpA (AS)",
    "Systemic Lupus Erythematosus (SLE)",
    "Giant Cell Arteritis (GCA)",
    "Juvenile Idiopathic Arthritis (JIA)",
    "ANCA-Associated Vasculitis",
    "Other",
];

type Medication = {
    id: string;
    genericName: string;
    brandName: string | null;
};

type Insurance = {
    id: string;
    name: string;
};

export default function ReportPAOutcome() {

    const [medications, setMedications] = useState<Medication[]>([]);
    const [insurances, setInsurances] = useState<Insurance[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Form state
    const [selectedClass, setSelectedClass] = useState("");
    const [medicationId, setMedicationId] = useState("");
    const [insuranceId, setInsuranceId] = useState("");
    const [indication, setIndication] = useState("");
    const [requestType, setRequestType] = useState("");
    const [outcome, setOutcome] = useState("");
    const [notes, setNotes] = useState("");

    // Derived: unique generic names for Step 1 dropdown
    const medicationClasses = Array.from(
        new Set(medications.map((m) => m.genericName))
    ).sort();

    // Derived: biosimilars filtered to selected class for Step 2 dropdown
    const availableBiosimilars = medications.filter(
        (m) => m.genericName === selectedClass
    );

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
                setError("Failed to load medications or insurances.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/pa-outcomes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    medicationId,
                    insuranceId,
                    indication,
                    requestType,
                    outcome,
                    notes: notes || undefined,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit PA outcome.");
            }

            setSubmitSuccess(true);
            setSelectedClass("");
            setMedicationId("");
            setInsuranceId("");
            setIndication("");
            setRequestType("");
            setOutcome("");
            setNotes("");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8"><p>Loading...</p></div>;
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">

            <Link href="/dashboard" className="text-sm text-sky-600 hover:text-sky-800 mb-4 inline-block">
                ← Back to Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-sky-900 mb-6">Submit PA Outcome</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}
            {submitSuccess && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
                    PA outcome submitted successfully!
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Step 1: Medication Class */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Medication Class
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                setMedicationId("");
                            }}
                            required
                            className="w-full border border-sky-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="">Select medication class</option>
                            {medicationClasses.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Step 2: Specific Biosimilar */}
                    {selectedClass && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Specific Biosimilar / Brand
                            </label>
                            <select
                                value={medicationId}
                                onChange={(e) => setMedicationId(e.target.value)}
                                required
                                className="w-full border border-sky-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                            >
                                <option value="">Select biosimilar</option>
                                {availableBiosimilars.map((med) => (
                                    <option key={med.id} value={med.id}>
                                        {med.brandName || med.genericName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <hr className="border-sky-100" />

                    {/* Insurance */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Insurance
                        </label>
                        <select
                            value={insuranceId}
                            onChange={(e) => setInsuranceId(e.target.value)}
                            required
                            className="w-full border border-sky-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="">Select insurance</option>
                            {insurances.map((ins) => (
                                <option key={ins.id} value={ins.id}>{ins.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Indication */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Indication
                        </label>
                        <select
                            value={indication}
                            onChange={(e) => setIndication(e.target.value)}
                            required
                            className="w-full border border-sky-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="">Select diagnosis</option>
                            {INDICATIONS.map((ind) => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>

                    <hr className="border-sky-100" />

                    {/* Request Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Request Type
                        </label>
                        <div className="flex gap-3">
                            {(["initial", "appeal"] as const).map((type) => (
                                <label
                                    key={type}
                                    className={`flex-1 text-center py-2 rounded-lg border cursor-pointer transition select-none text-sm font-medium
                                        ${requestType === type
                                            ? "bg-sky-600 text-white border-sky-600"
                                            : "border-sky-200 text-slate-700 hover:border-sky-400"}`}
                                >
                                    <input
                                        type="radio"
                                        name="requestType"
                                        value={type}
                                        className="sr-only"
                                        checked={requestType === type}
                                        onChange={() => setRequestType(type)}
                                        required
                                    />
                                    {type === "initial" ? "Initial PA" : "Appeal"}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Outcome */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Outcome
                        </label>
                        <div className="flex gap-3">
                            {(["approved", "denied"] as const).map((val) => (
                                <label
                                    key={val}
                                    className={`flex-1 text-center py-2 rounded-lg border cursor-pointer transition select-none text-sm font-medium
                                        ${outcome === val
                                            ? val === "approved"
                                                ? "bg-green-600 text-white border-green-600"
                                                : "bg-red-500 text-white border-red-500"
                                            : "border-sky-200 text-slate-700 hover:border-sky-400"}`}
                                >
                                    <input
                                        type="radio"
                                        name="outcome"
                                        value={val}
                                        className="sr-only"
                                        checked={outcome === val}
                                        onChange={() => setOutcome(val)}
                                        required
                                    />
                                    {val === "approved" ? "Approved" : "Denied"}
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr className="border-sky-100" />

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Notes <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border border-sky-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                            rows={3}
                            placeholder="e.g., step therapy required, missing documentation, appealed and approved..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`px-6 py-2.5 rounded-lg text-white font-medium transition ${submitting ? "bg-slate-300 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"}`}
                    >
                        {submitting ? "Submitting..." : "Submit Report"}
                    </button>
                </form>
            </div>
        </div>
    );
}
