import { z } from "zod";
export declare const MissionSchema: z.ZodObject<{
    id: z.ZodCUID;
    objectiveId: z.ZodString;
    responsableId: z.ZodString;
    teamId: z.ZodOptional<z.ZodString>;
    priorite: z.ZodString;
    dependances: z.ZodArray<z.ZodString>;
    livrables: z.ZodJSONSchema;
    checklist: z.ZodJSONSchema;
    dateLimite: z.ZodDate;
    kpi: z.ZodJSONSchema;
    status: z.ZodEnum<{
        a_faire: "a_faire";
        en_cours: "en_cours";
        en_retard: "en_retard";
        terminee: "terminee";
    }>;
    createdBy: z.ZodString;
}, z.core.$strip>;
