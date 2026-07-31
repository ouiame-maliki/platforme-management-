import { z } from "zod";

export const SiteSchema = z.object({
    id: z.cuid(),
    companyId: z.string(),
    name: z.string(),
    country: z.string(),
});