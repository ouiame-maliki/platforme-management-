"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectionSchema = void 0;
const zod_1 = require("zod");
exports.DirectionSchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    companyId: zod_1.z.string(),
    name: zod_1.z.string(),
});
