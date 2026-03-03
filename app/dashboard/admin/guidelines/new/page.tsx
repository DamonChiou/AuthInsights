"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequirementBuilder } from "@/src/components/admin/RequirementBuilder";

type Medication = {
    id: string;
    name: string;
};

type Insurance = {
    id: string;
    name: string;
};

export default function NewGuidelinePage() {
    const router = useRouter();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [insurances, setInsurances] = useState<Insurance[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    //Form States
    const [medicationId, setMedicationId] = useState("");
    const [insuranceId, setInsuranceId] = useState("");
    const [requestType, setRequestType] = useState("new");
    const [baseRequirements, setBaseRequirements] = useState<any[]>([]);
    const [formLinks, setFormLinks] = useState<{url: string, name: string}[]>([]);

    const [additionalInfo, setAdditionalInfo] = useState("");

    const addFormLink = () => {
        setFormLinks([...formLinks, { url: "", name: "" }]);
    };

    const updateFormLink = (index: number, field: "url" | "name", value: string) => {
        const updatedLinks = [...formLinks];
        updatedLinks[index][field] = value;
        setFormLinks(updatedLinks);
    };
    
    const removeFormLink = (index: number) => {
        const updatedLinks = formLinks.filter((_, i) => i !== index);
        setFormLinks(updatedLinks);
    };

    // Fetch medications and insurances on mount
    useEffect(() => {
        async function fetchData() {
            try{
                const [medsRes, insRes] = await Promise.all([
                    fetch("/api/medications"),
                    fetch("/api/insurances"),
                ])
                const meds = await medsRes.json();
                const ins = await insRes.json();
                setMedications(meds);
                setInsurances(ins);
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
            const res = await fetch("/api/guidelines", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    medicationId,
                    insuranceId,
                    requestType,
                    baseRequirements,
                    additionalInfo: additionalInfo || null,
                    formLinks: formLinks.length > 0 ? formLinks : null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create guideline.");
            }

            router.push("/dashboard/admin/guidelines");          
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    

    // Render JSX
    if (loading) {
        return <div className="p-8"> 
            <p>Loading...</p>
        </div>
    }

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Add New Guideline</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* For Medications */}
                <div>
                    <label className="block text-sm font medium text-gray-700 mb-1">
                        Medication
                    </label>
                    <select
                        value={medicationId}
                        onChange={(e) => setMedicationId(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    >
                        <option value="">Select Medication</option>
                        {medications.map((med) => (
                            <option key={med.id} value={med.id}>
                                {med.name}
                            </option>       
                        ))}
                    </select>
                </div>

                {/* For Insurances */}
                <div>
                    <label className="block text-sm font medium text-gray-700 mb-1">
                        Insurance
                    </label>
                    <select
                        value={insuranceId} 
                        onChange={(e) => setInsuranceId(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    >
                        <option value="">Select Insurance</option>
                        {insurances.map((ins) => (
                            <option key={ins.id} value={ins.id}>
                                {ins.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Request Type */}
                <div>
                    <label className="block text-sm font medium mb-2">Request Type</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="requestType"
                                value="New"
                                checked={requestType === "New"}
                                onChange={(e) => setRequestType("New")}
                            />
                            New Patient
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="requestType"
                                value="Renewal"
                                checked={requestType === "Renewal"}
                                onChange={(e) => setRequestType("Renewal")}
                            />
                            Renewal
                        </label>
                    </div>
                </div>

                {/* Requirement Builder */}
                <RequirementBuilder
                    value={baseRequirements}
                    onChange={setBaseRequirements}
                />

                {/* Form Links */}
                <div className="space-y-2">
                    <label className="block text-sm font medium text-gray-700 mb-1"> Form Links (Optional) </label>
                    <button
                        type="button"
                        onClick={addFormLink}
                        className="text-sm bg-gray-600 text-white hover:bg-gray-700 px-3 py-1 rounded-md mb-2"
                    >
                        Add Link 
                    </button>
                </div>

                {formLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center mb-2">
                        <input
                            type="text"
                            value={link.name}
                            onChange={(e) => updateFormLink(index, "name", e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md"
                            placeholder="Link Name"
                        />
                        <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateFormLink(index, "url", e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md"
                            placeholder="https://..."
                        />
                        <button
                            type="button"
                            onClick={() => removeFormLink(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                { /* Additional Info */ }
                <div>
                    <label className="block text-sm font medium text-gray-700 mb-1">
                        Additional Information
                    </label>
                    <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md"
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? "Submitting..." : "Save Guideline"}
                </button>
                
            </form>
        </div>
    );
     
}