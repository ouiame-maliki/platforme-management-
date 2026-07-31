import { z } from "zod";
export declare const TeamSchema: z.ZodObject<{
    id: z.ZodCUID;
    departmentId: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
