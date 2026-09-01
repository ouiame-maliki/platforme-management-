"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpiDefinitionSchema = void 0;
const zod_1 = require("zod");
exports.KpiDefinitionSchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    companyId: zod_1.z.string(),
    name: zod_1.z.string(),
    unit: zod_1.z.enum([
        "pourcent",
        "montant",
        "nombre",
        "temps",
    ]),
    target: zod_1.z.number(),
    description: zod_1.z.string().optional(),
});
