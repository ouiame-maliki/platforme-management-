import { z } from "zod";

export const JobDescriptionSchema = z.object({
    id: z.cuid(),
    employeeRole: z.string(),
    mission: z.string(),
    objectifs: z.json(),
    responsabilities: z.json(),
    taches: z.json(), 
    competences: z.json(),
    kpi: z.json(),
    livrables: z.json(),
    frequence: z.string(),
    risques: z.json(),
    procedures: z.json(),
    documents: z.array(z.string()),
});
