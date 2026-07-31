import { z } from "zod";

export const ObjectiveLevel = z.enum(["strategique", "annuel", "trimestriel", "mensuel", "hebdomadaire", "journalier"]);
export const MissionStatus = z.enum(["a_faire", "en_cours", "terminee", "en_retard"]);
export const MissionCreatedBy = z.string();