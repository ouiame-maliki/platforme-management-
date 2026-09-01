import { z } from "zod";
export declare const KpiDefinitionSchema: z.ZodObject<{
    id: z.ZodCUID;
    companyId: z.ZodString;
    name: z.ZodString;
    unit: z.ZodEnum<{
        montant: "montant";
        nombre: "nombre";
        pourcent: "pourcent";
        temps: "temps";
    }>;
    target: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
