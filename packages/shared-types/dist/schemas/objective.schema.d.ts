import { z } from "zod";
export declare const ObjectiveSchema: z.ZodObject<{
    id: z.ZodCUID;
    companyId: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
    level: z.ZodEnum<{
        annuel: "annuel";
        hebdomadaire: "hebdomadaire";
        journalier: "journalier";
        mensuel: "mensuel";
        strategique: "strategique";
        trimestriel: "trimestriel";
    }>;
    title: z.ZodString;
    target: z.ZodJSONSchema;
    status: z.ZodString;
}, z.core.$strip>;
