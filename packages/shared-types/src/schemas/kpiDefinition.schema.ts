import { z } from "zod";

export const KpiDefinitionSchema = z.object({
    id: z.cuid(),
    companyId: z.string(),
    name: z.string(),
    unit: z.enum([
      "pourcent",
      "montant",
      "nombre",
      "temps",
    ]),
    target: z.number(),
    description: z.string().optional(),
});