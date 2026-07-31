import { z } from "zod";
export declare const JobDescriptionSchema: z.ZodObject<{
    id: z.ZodCUID;
    employeeRole: z.ZodString;
    mission: z.ZodString;
    objectifs: z.ZodJSONSchema;
    responsabilities: z.ZodJSONSchema;
    taches: z.ZodJSONSchema;
    competences: z.ZodJSONSchema;
    kpi: z.ZodJSONSchema;
    livrables: z.ZodJSONSchema;
    frequence: z.ZodString;
    risques: z.ZodJSONSchema;
    procedures: z.ZodJSONSchema;
    documents: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
