import { z } from "zod";
export declare const DirectionSchema: z.ZodObject<{
    id: z.ZodCUID;
    companyId: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
