import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function createTestFixtures() {
  const company = await prisma.company.create({
    data: {
      name: "Test Company",
      sector: "Technology",
      plan: "premium",
    },
  });

  const direction1 = await prisma.direction.create({
    data: {
      companyId: company.id,
      name: "Direction Générale",
    },
  });

  const direction2 = await prisma.direction.create({
    data: {
      companyId: company.id,
      name: "Direction Technique",
    },
  });

  const department1 = await prisma.department.create({
    data: {
      directionId: direction1.id,
      name: "Ressources Humaines",
    },
  });

  const department2 = await prisma.department.create({
    data: {
      directionId: direction1.id,
      name: "Finance",
    },
  });

  const department3 = await prisma.department.create({
    data: {
      directionId: direction1.id,
      name: "Marketing",
    },
  });

  const department4 = await prisma.department.create({
    data: {
      directionId: direction2.id,
      name: "Développement",
    },
  });

  const department5 = await prisma.department.create({
    data: {
      directionId: direction2.id,
      name: "Infrastructure",
    },
  });

  const team1 = await prisma.team.create({
    data: {
      departmentId: department1.id,
      name: "HR Team",
    },
  });

  const team2 = await prisma.team.create({
    data: {
      departmentId: department2.id,
      name: "Finance Team",
    },
  });

  const team3 = await prisma.team.create({
    data: {
      departmentId: department3.id,
      name: "Marketing Team",
    },
  });

  const team4 = await prisma.team.create({
    data: {
      departmentId: department4.id,
      name: "Backend Team",
    },
  });

  const team5 = await prisma.team.create({
    data: {
      departmentId: department5.id,
      name: "Infrastructure Team",
    },
  });

  const teams = [team1, team2, team3, team4, team5];

  const employees = [];

  for (let i = 1; i <= 20; i++) {
    const team = teams[Math.floor((i - 1) / 4)];

    const employee = await prisma.employee.create({
      data: {
        teamId: team.id,
        name: `Employee ${i}`,
        role: i % 4 === 1 ? "Manager" : "Developer",
      },
    });

    employees.push(employee);
  }

  const objective1 = await prisma.objective.create({
    data: {
      companyId: company.id,
      level: "strategique",
      title: "Improve company performance",
      target: {
        value: 100,
        unit: "pourcent",
        metric: "performance",
      },
      status: "en_cours",
    },
  });

  const objective2 = await prisma.objective.create({
    data: {
      companyId: company.id,
      parentId: objective1.id,
      level: "annuel",
      title: "Increase annual revenue",
      target: {
        value: 80,
        unit: "pourcent",
        metric: "revenue",
      },
      status: "en_cours",
    },
  });

  const objective3 = await prisma.objective.create({
    data: {
      companyId: company.id,
      parentId: objective2.id,
      level: "trimestriel",
      title: "Increase Q1 revenue",
      target: {
        value: 20,
        unit: "pourcent",
        metric: "revenue",
      },
      status: "en_cours",
    },
  });

  const objective4 = await prisma.objective.create({
    data: {
      companyId: company.id,
      parentId: objective3.id,
      level: "mensuel",
      title: "Improve monthly sales",
      target: {
        value: 10,
        unit: "pourcent",
        metric: "sales",
      },
      status: "en_cours",
    },
  });

  const objective5 = await prisma.objective.create({
    data: {
      companyId: company.id,
      parentId: objective4.id,
      level: "hebdomadaire",
      title: "Increase weekly leads",
      target: {
        value: 50,
        unit: "leads",
        metric: "leads",
      },
      status: "en_cours",
    },
  });

  const objective6 = await prisma.objective.create({
    data: {
      companyId: company.id,
      parentId: objective5.id,
      level: "journalier",
      title: "Contact daily prospects",
      target: {
        value: 10,
        unit: "prospects",
        metric: "contacts",
      },
      status: "en_cours",
    },
  });

  const objective7 = await prisma.objective.create({
    data: {
      companyId: company.id,
      parentId: objective1.id,
      level: "annuel",
      title: "Improve employee productivity",
      target: {
        value: 90,
        unit: "pourcent",
        metric: "productivity",
      },
      status: "en_cours",
    },
  });

  const objective8 = await prisma.objective.create({
    data: {
      companyId: company.id,
      parentId: objective7.id,
      level: "trimestriel",
      title: "Improve Q1 productivity",
      target: {
        value: 25,
        unit: "pourcent",
        metric: "productivity",
      },
      status: "en_cours",
    },
  });

  const objective9 = await prisma.objective.create({
    data: {
      companyId: company.id,
      parentId: objective8.id,
      level: "mensuel",
      title: "Improve development velocity",
      target: {
        value: 15,
        unit: "pourcent",
        metric: "velocity",
      },
      status: "en_cours",
    },
  });

  const objective10 = await prisma.objective.create({
    data: {
      companyId: company.id,
      parentId: objective9.id,
      level: "hebdomadaire",
      title: "Complete weekly sprint goals",
      target: {
        value: 100,
        unit: "pourcent",
        metric: "sprint",
      },
      status: "en_cours",
    },
  });

  const objectives = [
    objective1,
    objective2,
    objective3,
    objective4,
    objective5,
    objective6,
    objective7,
    objective8,
    objective9,
    objective10,
  ];

  const missions = [];

  for (let i = 1; i <= 15; i++) {
    const employee = employees[(i - 1) % employees.length];
    const objective = objectives[(i - 1) % objectives.length];

    const mission = await prisma.mission.create({
      data: {
        objectiveId: objective.id,
        responsableId: employee.id,
        teamId: employee.teamId,
        priorite:
          i % 3 === 0
            ? "haute"
            : i % 3 === 1
              ? "moyenne"
              : "basse",
        dependances: [],
        livrables: [
          {
            name: `Livrable ${i}`,
            status: "pending",
          },
        ],
        checklist: [
          {
            task: `Task ${i}`,
            completed: false,
          },
        ],
        dateLimite: new Date(
          Date.now() + i * 24 * 60 * 60 * 1000,
        ),
        kpi: [
          {
            name: "progress",
            target: 100,
            value: 0,
          },
        ],
        status:
          i % 3 === 0
            ? "termine"
            : i % 3 === 1
              ? "en_cours"
              : "a_faire",
        createdBy: employee.id,
      },
    });

    missions.push(mission);

    if (i > 1) {
      await prisma.mission.update({
        where: {
          id: mission.id,
        },
        data: {
          dependances: [missions[i - 2].id],
        },
      });
    }
  }

  return {
    company,
    directions: [direction1, direction2],
    departments: [
      department1,
      department2,
      department3,
      department4,
      department5,
    ],
    teams,
    employees,
    objectives,
    missions,
  };
}

