import { z } from "zod";
export declare const KpiValueSchema: z.ZodObject<{
    id: z.ZodCUID;
    kpiDefinitionId: z.ZodString;
    value: z.ZodNumber;
    recordedAt: z.ZodDate;
}, z.core.$strip>;
