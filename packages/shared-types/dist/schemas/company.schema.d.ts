import { z } from "zod";
export declare const CompanySchema: z.ZodObject<{
    id: z.ZodCUID;
    name: z.ZodString;
    sector: z.ZodString;
    plan: z.ZodString;
}, z.core.$strip>;
