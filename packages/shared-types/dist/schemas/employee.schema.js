"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSchema = void 0;
const zod_1 = require("zod");
exports.EmployeeSchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    teamId: zod_1.z.string(),
    name: zod_1.z.string(),
    role: zod_1.z.string(),
    managerId: zod_1.z.string().optional(),
});
