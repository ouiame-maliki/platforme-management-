import { z } from "zod";
export declare const ObjectiveLevel: z.ZodEnum<{
    annuel: "annuel";
    hebdomadaire: "hebdomadaire";
    journalier: "journalier";
    mensuel: "mensuel";
    strategique: "strategique";
    trimestriel: "trimestriel";
}>;
export declare const MissionStatus: z.ZodEnum<{
    a_faire: "a_faire";
    en_cours: "en_cours";
    en_retard: "en_retard";
    terminee: "terminee";
}>;
export declare const MissionCreatedBy: z.ZodString;
