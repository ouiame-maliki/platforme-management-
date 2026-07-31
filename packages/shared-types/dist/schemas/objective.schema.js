"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectiveSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
exports.ObjectiveSchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    companyId: zod_1.z.string(),
    parentId: zod_1.z.string().optional(),
    level: enums_1.ObjectiveLevel,
    title: zod_1.z.string(),
    target: zod_1.z.json(),
    status: zod_1.z.string(),
});
