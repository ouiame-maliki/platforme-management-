import { z } from "zod";

export const KpiDefinitionSchema = z.object({
    id: z.cuid(),
    companyId: z.string(),
    name: z.string(),
    unit: z.string(),
    target: z.number(),
});