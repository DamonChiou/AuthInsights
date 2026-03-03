import { z } from "zod";

const formLinkSchema = z.object({
  name: z.string().min(1, "Link name is required"),
  url: z.url("Invalid URL format"),
});

const orGroupSchema = z.object({
    type: z.literal("or"),
    label: z.string().min(1, "Label is required"),
    options: z.array(z.string()).min(2, "At least two conditions are required in an OR group"),
})

const requirementSchema = z.union([
    z.string().min(1),
    orGroupSchema
]);

const conditionalRuleSchema = z.object({
    question: z.string().min(1, "Question is required"),
    options: z.array(z.string()).min(2, "At least two options are required"),
    ifAnswer: z.string().min(1, "If answer is required"),
    addRequirements: z.array(requirementSchema).min(1, "At least one requirement is needed"),
})

export const guidelinesSchema = z.object({
    medicationId: z.string().min(1, "Medication ID is required"),
    insuranceId: z.string().min(1, "Insurance ID is required"),
    requestType: z.enum(["New", "Renewal"], "Request type must be either 'New' or 'Renewal'"),
    baseRequirements: z.array(requirementSchema).min(1, "At least one base requirement is needed"),
    conditionalRules: z.array(conditionalRuleSchema).optional(),
    additionalInfo: z.string().optional(),
    portalUrl: z.url("Invalid portal URL").optional(),
    formLinks: z.array(formLinkSchema).optional(),
});

export type Guidelines = z.infer<typeof guidelinesSchema>;
