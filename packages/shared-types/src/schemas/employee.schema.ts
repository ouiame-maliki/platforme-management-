import { z } from "zod";

export const EmployeeSchema = z.object({
  id: z.cuid(),
  teamId: z.string(),
  name: z.string(),
  role: z.string(),
  managerId: z.string().optional(),
});