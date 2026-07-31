import { z } from "zod";
export declare const SiteSchema: z.ZodObject<{
    id: z.ZodCUID;
    companyId: z.ZodString;
    name: z.ZodString;
    country: z.ZodString;
}, z.core.$strip>;
