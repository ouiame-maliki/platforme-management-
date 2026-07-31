"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanySchema = void 0;
const zod_1 = require("zod");
exports.CompanySchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    name: zod_1.z.string(),
    sector: zod_1.z.string(),
    plan: zod_1.z.string(),
});
