import { z } from 'zod';

export const paOutcomeSubmitSchema = z.object({
    medicationId: z.string().min(1, 'Medication is required'),
    insuranceId:  z.string().min(1, 'Insurance is required'),
    indication:   z.string().min(1, 'Indication is required'),
    requestType:  z.enum(['initial', 'appeal']),
    outcome:      z.enum(['approved', 'denied']),
    notes:        z.string().optional(),
});

export type PaOutcomeSubmitInput = z.infer<typeof paOutcomeSubmitSchema>;
