import { z } from "zod";

export const TeamSchema = z.object({
    id: z.cuid(),
    departmentId: z.string(),
    name: z.string(),
});