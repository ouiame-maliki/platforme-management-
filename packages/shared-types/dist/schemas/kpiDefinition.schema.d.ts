import { z } from "zod";
export declare const KpiDefinitionSchema: z.ZodObject<{
    id: z.ZodCUID;
    companyId: z.ZodString;
    name: z.ZodString;
    unit: z.ZodString;
    target: z.ZodNumber;
}, z.core.$strip>;
