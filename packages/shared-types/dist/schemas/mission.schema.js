"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
exports.MissionSchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    objectiveId: zod_1.z.string(),
    responsableId: zod_1.z.string(),
    teamId: zod_1.z.string().optional(),
    priorite: zod_1.z.string(),
    dependances: zod_1.z.array(zod_1.z.string()),
    livrables: zod_1.z.json(),
    checklist: zod_1.z.json(),
    dateLimite: zod_1.z.date(),
    kpi: zod_1.z.json(),
    status: enums_1.MissionStatus,
    createdBy: enums_1.MissionCreatedBy,
});
