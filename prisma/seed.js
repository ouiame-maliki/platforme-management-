"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({
    adapter,
});
async function main() {
    const company = await prisma.company.create({
        data: {
            name: "3LM Solutions",
            sector: "Software",
            plan: "Premium",
        },
    });
    const directionTechnique = await prisma.direction.create({
        data: {
            name: "Direction Technique",
            companyId: company.id,
        },
    });
    const directionRH = await prisma.direction.create({
        data: {
            name: "Direction RH",
            companyId: company.id,
        },
    });
    const directionFinance = await prisma.direction.create({
        data: {
            name: "Direction Finance",
            companyId: company.id,
        },
    });
    const departmentDeveloppement = await prisma.department.create({
        data: {
            name: "Département Développement",
            directionId: directionTechnique.id,
        },
    });
    const departmentRecrutement = await prisma.department.create({
        data: {
            name: "Département Recrutement",
            directionId: directionRH.id,
        },
    });
    const departmentComptabilite = await prisma.department.create({
        data: {
            name: "Département Comptabilité",
            directionId: directionFinance.id,
        },
    });
    const backendTeam = await prisma.team.create({
        data: {
            name: "Équipe Backend",
            departmentId: departmentDeveloppement.id,
        },
    });
    const teamRH = await prisma.team.create({
        data: {
            name: "Équipe RH",
            departmentId: departmentRecrutement.id,
        },
    });
    const teamFinance = await prisma.team.create({
        data: {
            name: "Équipe Finance",
            departmentId: departmentComptabilite.id,
        },
    });
    await prisma.employee.createMany({
        data: [
            { name: "Ahmed", role: "Backend Developer", teamId: backendTeam.id },
            { name: "Sara", role: "Backend Developer", teamId: backendTeam.id },
            { name: "Youssef", role: "Backend Tech Lead", teamId: backendTeam.id },
            { name: "Fatima", role: "QA Engineer", teamId: backendTeam.id },
            { name: "Salma", role: "HR Manager", teamId: teamRH.id },
            { name: "Omar", role: "HR Officer", teamId: teamRH.id },
            { name: "Nadia", role: "Recruiter", teamId: teamRH.id },
            { name: "Karim", role: "Finance Manager", teamId: teamFinance.id },
            { name: "Amina", role: "Accountant", teamId: teamFinance.id },
            { name: "Reda", role: "Financial Analyst", teamId: teamFinance.id },
        ]
    });
}
main()
    .then(() => {
    console.log(" Seed terminé avec succès !");
})
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
