import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { PrismaService } from "../../prisma/prisma.service";

describe("Mission API", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let teamId: string;
  let employeeId: string;
  let objectiveId: string;
  let missionId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const company = await prisma.company.create({
      data: {
        name: `Mission Test Company ${Date.now()}-${Math.random()}`,
        sector: "IT",
        plan: "premium",
      },
    });

    const direction = await prisma.direction.create({
      data: {
        companyId: company.id,
        name: "Direction IT",
      },
    });

    const department = await prisma.department.create({
      data: {
        directionId: direction.id,
        name: "Development",
      },
    });

    const team = await prisma.team.create({
      data: {
        departmentId: department.id,
        name: "Backend Team",
      },
    });

    teamId = team.id;

    const employee = await prisma.employee.create({
      data: {
        teamId: team.id,
        name: "Test Employee",
        role: "Developer",
      },
    });

    employeeId = employee.id;

    const objective = await prisma.objective.create({
      data: {
        companyId: company.id,
        title: "Test Objective",
        level: "strategique",
        target: {
          value: 100,
          unit: "pourcent",
          metric: "performance",
        },
        status: "en_cours",
      },
    });

    objectiveId = objective.id;
  });

  describe("POST /missions", () => {
    it("should create a mission", async () => {
      const response = await request(app.getHttpServer())
        .post("/missions")
        .send({
          objectiveId,
          responsableId: employeeId,
          teamId,
          priorite: "haute",
          dependances: [],
          livrables: [],
          checklist: [],
          dateLimite: "2026-12-31",
          kpi: [],
          status: "a_faire",
          createdBy: employeeId,
        })
        .expect(201);

      missionId = response.body.id;

      expect(response.body).toMatchObject({
        objectiveId,
        responsableId: employeeId,
        teamId,
        priorite: "haute",
        status: "a_faire",
      });
    });
  });

  describe("GET /missions", () => {
    it("should filter missions by teamId", async () => {
      await prisma.mission.createMany({
        data: [
          {
            objectiveId,
            responsableId: employeeId,
            teamId,
            priorite: "haute",
            dependances: [],
            livrables: [],
            checklist: [],
            dateLimite: new Date("2026-10-01"),
            kpi: [],
            status: "a_faire",
            createdBy: employeeId,
          },
          {
            objectiveId,
            responsableId: employeeId,
            teamId,
            priorite: "basse",
            dependances: [],
            livrables: [],
            checklist: [],
            dateLimite: new Date("2026-11-01"),
            kpi: [],
            status: "termine",
            createdBy: employeeId,
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get(`/missions?teamId=${teamId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      expect(response.body.length).toBeGreaterThanOrEqual(2);

      response.body.forEach((mission: any) => {
        expect(mission.teamId).toBe(teamId);
      });
    });

    it("should filter missions by status", async () => {
      await prisma.mission.create({
        data: {
          objectiveId,
          responsableId: employeeId,
          teamId,
          priorite: "haute",
          dependances: [],
          livrables: [],
          checklist: [],
          dateLimite: new Date("2026-10-01"),
          kpi: [],
          status: "termine",
          createdBy: employeeId,
        },
      });

      const response = await request(app.getHttpServer())
        .get("/missions?status=termine")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((mission: any) => {
        expect(mission.status).toBe("termine");
      });
    });
  });

  describe("PATCH /missions/:id/status", () => {
    it("should update mission status", async () => {
      const mission = await prisma.mission.create({
        data: {
          objectiveId,
          responsableId: employeeId,
          teamId,
          priorite: "haute",
          dependances: [],
          livrables: [],
          checklist: [],
          dateLimite: new Date("2026-10-01"),
          kpi: [],
          status: "a_faire",
          createdBy: employeeId,
        },
      });

      const response = await request(app.getHttpServer())
        .patch(`/missions/${mission.id}/status`)
        .send({
          status: "en_cours",
        })
        .expect(200);

      expect(response.body.status).toBe("en_cours");
    });

    it("should return 404 when mission does not exist", async () => {
      await request(app.getHttpServer())
        .patch("/missions/non-existing-mission/status")
        .send({
          status: "en_cours",
        })
        .expect(404);
    });
  });
});