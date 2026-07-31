"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionCreatedBy = exports.MissionStatus = exports.ObjectiveLevel = void 0;
const zod_1 = require("zod");
exports.ObjectiveLevel = zod_1.z.enum(["strategique", "annuel", "trimestriel", "mensuel", "hebdomadaire", "journalier"]);
exports.MissionStatus = zod_1.z.enum(["a_faire", "en_cours", "terminee", "en_retard"]);
exports.MissionCreatedBy = zod_1.z.string();
