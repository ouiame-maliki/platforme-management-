"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpiValueSchema = void 0;
const zod_1 = require("zod");
exports.KpiValueSchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    kpiDefinitionId: zod_1.z.string(),
    value: zod_1.z.number(),
    recordedAt: zod_1.z.date(),
});
