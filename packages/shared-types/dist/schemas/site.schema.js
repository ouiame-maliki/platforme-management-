"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSchema = void 0;
const zod_1 = require("zod");
exports.SiteSchema = zod_1.z.object({
    id: zod_1.z.cuid(),
    companyId: zod_1.z.string(),
    name: zod_1.z.string(),
    country: zod_1.z.string(),
});
