import { z } from "zod";

export const DepartmentSchema = z.object({
    id: z.cuid(),
    directionId: z.string(),
    name: z.string(),
});
