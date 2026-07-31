"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentSchema = void 0;
const zod_1 = require("zod");
exports.DepartmentSchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    directionId: zod_1.z.string(),
    name: zod_1.z.string(),
});
