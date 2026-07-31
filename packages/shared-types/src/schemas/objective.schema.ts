import { z } from "zod";
import { ObjectiveLevel } from "./enums";

export const ObjectiveSchema = z.object({
    id: z.cuid(),
    companyId: z.string(),
    parentId: z.string().optional(),
    level: ObjectiveLevel,
    title: z.string(),
    target: z.json(),
    status: z.string(),
});