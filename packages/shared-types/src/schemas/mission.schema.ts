import { z } from "zod";
import { MissionStatus, MissionCreatedBy     } from "./enums";

export const MissionSchema = z.object({
    id: z.cuid(),
    objectiveId: z.string(),
    responsableId: z.string(),
    teamId: z.string().optional(),
    priorite: z.string(),
    dependances: z.array(z.string()),
    livrables: z.json(),
    checklist: z.json(),
    dateLimite: z.date(),
    kpi: z.json(),
    status: MissionStatus,
    createdBy: MissionCreatedBy,
});