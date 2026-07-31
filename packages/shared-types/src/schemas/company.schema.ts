import { z } from "zod";

export const CompanySchema = z.object({
    id: z.cuid(),
    name: z.string(),
    sector: z.string(),
    plan: z.string(),
});