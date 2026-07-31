import { z } from "zod";

export const DirectionSchema = z.object({
    id: z.cuid(),
    companyId: z.string(),
    name: z.string(),
});