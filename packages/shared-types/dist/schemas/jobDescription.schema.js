"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDescriptionSchema = void 0;
const zod_1 = require("zod");
exports.JobDescriptionSchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    employeeRole: zod_1.z.string(),
    mission: zod_1.z.string(),
    objectifs: zod_1.z.json(),
    responsabilites: zod_1.z.json(),
    taches: zod_1.z.json(),
    competences: zod_1.z.json(),
    kpi: zod_1.z.json(),
    livrables: zod_1.z.json(),
    frequence: zod_1.z.string(),
    risques: zod_1.z.json(),
    procedures: zod_1.z.json(),
    documents: zod_1.z.array(zod_1.z.string()),
});
