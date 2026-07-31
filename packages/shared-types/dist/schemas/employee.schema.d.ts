import { z } from "zod";
export declare const EmployeeSchema: z.ZodObject<{
    id: z.ZodCUID;
    teamId: z.ZodString;
    name: z.ZodString;
    role: z.ZodString;
    managerId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
