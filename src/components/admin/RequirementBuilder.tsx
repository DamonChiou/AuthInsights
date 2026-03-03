//Displays a list of requirements that I have added
//Each requirement can be a string Or an "or group" with multiple options
//can add and remove
"use client";
//importing react library for state management
import { useState } from "react";

//defining types
type OrGroup = {
    type: "or";
    label: string;
    options: string[];
}

type Requirement = string | OrGroup;

type RequirementBuilderProps = {
    value: Requirement[];
    onChange: (requirements: Requirement[]) => void;
};

//Backend logic for adding/removing requirements
export function RequirementBuilder({ value, onChange}: RequirementBuilderProps) {
    const [editingOrGropup, setEditingOrGroup] = useState<number | null>(null);

    // Add a new requirement
    const addSimpleRequirement = () => {
        onChange([...value, ""]);
    };

    // Add a new OR group
    const addOrGroup = () => {
        onChange([
            ...value,
            { type: "or" as const, label: "", options: ["", ""]},
        ]);
    };

    // Remove a requirement by index
    const removeRequirement = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    // Update a simple requirement
    const updateSimple = (index: number, text: string) => {
        const updated = [...value];
        updated[index] = text;
        onChange(updated);
    };

    // Update an OR group's label
    const updateOrLabel = (index: number, label: string) => {
        const updated = [...value];
        const group = updated[index] as OrGroup;
        group.label = label;
        onChange(updated);
    };
    // Update an option in an OR group
    const updateOrOption = (reqIndex: number, optIndex: number, text: string) => {
        const updated = [...value];
        const group = updated[reqIndex] as OrGroup;
        const newOptions = [...group.options];
        newOptions[optIndex] = text;
        updated[reqIndex] = {
            ...group,
            options: newOptions,
        };
        onChange(updated);
    }
    // Add an option to an OR group
    const addOrOption = (reqIndex: number) => {
        const updated = [...value];
        const group = updated[reqIndex] as OrGroup;
        updated[reqIndex] = {
            ...group,
            options: [...group.options, ""],
        };
        onChange(updated);
    };

    // Remove option from OR group
    const removeOrOption = (reqIndex: number, optIndex: number) => {
        const updated = [...value];
        const group = updated[reqIndex] as OrGroup;
        if (group.options.length <= 2) return; // Ensure at least two options remain
        group.options = group.options.filter((_, i) => i !== optIndex);
        onChange(updated);
    };

    // Rendering the requirement builder UI
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Requirements</h3>
                <div className = "space-x-2">
                    <button
                        type = "button"
                        onClick={addSimpleRequirement}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                        Add Requirement
                    </button>
                    <button
                        type="button"
                        onClick={addOrGroup}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                        Add "Or" Group

                    </button>
                </div>
            </div>

            {value.length === 0 && (
                <p className="text-gray-500">No requirements added yet.</p>
            )}

            {value.map((req, reqIndex) => (
                <div key={reqIndex} className="border p-4 rounded-md">
                    {typeof req === "string" ? (
                        // if reqquirement is a simple string
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={req}
                                onChange={(e) => updateSimple(reqIndex, e.target.value)}
                                className="flex-grow border p-2 rounded-md"
                                placeholder="Enter requirement"
                            />
                            <button
                                type="button"
                                onClick={() => removeRequirement(reqIndex)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                                Remove
                            </button>
                        </div>
                    ) : (
                        // if requirement is an "or" group
                        <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                                <span className="font-medium text-sm">OR Group</span>
                                <input
                                    type = "text"
                                    value={req.label}
                                    onChange={(e) => updateOrLabel(reqIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-md"
                                    placeholder="Group Label"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeRequirement(reqIndex)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                                    Remove Group
                                </button>
                            </div>

                            <div className="space-y-2 pl-4">
                                {req.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex gap-2 items-center">
                                        <span className="text-gray-400 py-2">-</span>
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOrOption(reqIndex, optIndex, e.target.value)}
                                            className="flex-1 px-3 py-2 border rounded-md"
                                            placeholder="Option"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOrOption(reqIndex, optIndex)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addOrOption(reqIndex)}
                                    className="text-sm text-blue-500 hover:underline">
                                    + Add Option
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )



}

