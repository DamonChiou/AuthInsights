"use client";

import { useState, useEffect } from "react";
import Link from "next/link";


type Guideline = {
    id: string;
    medication: { genericName: string };
    insurance: {payerName: string };
    requestType: string;
    baseRequirements: any[];
    createdAt: string;
};

export default function GuidelinesPage() {
    const [guidelines, setGuidelines] = useState<Guideline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Fetch guidelines on mount
    useEffect(() => {
        fetchGuidelines();

    }, []);

    const fetchGuidelines = async () => {
        try {
            const res = await fetch("/api/guidelines");
            if (!res.ok) {
                throw new Error("Failed to fetch guidelines");
            }
            const data = await res.json();
            setGuidelines(data);
        } catch (err) {
            setError("Error loading guidelines.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this guideline?")) return;

        try {
            const res = await fetch(`/api/guidelines/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                throw new Error("Failed to delete guideline");
            }
            setGuidelines(guidelines.filter(g => g.id !== id));
        } catch (err) {
            alert("Error deleting guideline.");
            console.error(err);
        }
    };

    if (loading) return <p>Loading guidelines...</p>;

    return (
        <div className="max-w-5xl max-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Guidelines</h1>
                <Link
                    href="/dashboard/admin/guidelines/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add New Guideline
                </Link>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {guidelines.length === 0 ? (
                <p>No guidelines found.</p>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Medication</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Insurance</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Request Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Requirements</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guidelines.map((g) => (
                            <tr key={g.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    {g.medication.genericName}
                                </td>
                                <td className="p-3">
                                    {g.insurance.payerName}
                                </td>
                                <td className="p-3">
                                    {g.requestType}
                                </td>
                                <td className="p-3">
                                    {g.baseRequirements.map((req, i) => (
                                        <div key={i}>
                                            {typeof req === "string"
                                                ? req
                                                : `${req.label}: ${req.options.join(" OR ")}`
                                            }
                                        </div>
                                    ))}
                                </td>

                                 <td className="p-3">
                                    {new Date(g.createdAt).toLocaleDateString()}
                                </td>
                               
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(g.id)}
                                        className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
