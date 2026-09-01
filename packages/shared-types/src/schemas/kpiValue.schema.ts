import { z } from "zod";

export const KpiValueSchema = z.object({
    id: z.cuid(),
    kpiDefinitionId: z.string(),
    value: z.number(),
    recordedAt: z.coerce.date().optional(),
    context: z.json().optional(),
});