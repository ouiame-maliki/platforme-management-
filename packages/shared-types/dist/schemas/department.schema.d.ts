import { z } from "zod";
export declare const DepartmentSchema: z.ZodObject<{
    id: z.ZodCUID;
    directionId: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
