import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { PrismaService } from "../../prisma/prisma.service";

describe("Objective API", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let strategicId: string;

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

  describe("POST /objectives + GET /objectives/tree/:strategicId", () => {
    it("should create a strategic objective and an annual child, then return the tree", async () => {
      const company = await prisma.company.create({
        data: {
          name: `Test Company ${Date.now()}`,
          sector: "IT",
          plan: "premium",
        },
      });

      const strategicResponse = await request(app.getHttpServer())
        .post("/objectives")
        .send({
          companyId: company.id,
          title: "Increase revenue",
          level: "strategique",
          parentId: undefined,
          target: {
            value: 100,
            unit: "pourcent",
            metric: "revenue",
          },
          status: "en_cours",
        })
        .expect(201);

      strategicId = strategicResponse.body.id;

      await request(app.getHttpServer())
        .post("/objectives")
        .send({
          companyId: company.id,
          title: "Annual revenue target",
          level: "annuel",
          parentId: strategicId,
          target: {
            value: 80,
            unit: "pourcent",
            metric: "revenue",
          },
          status: "en_cours",
        })
        .expect(201);

      const treeResponse = await request(app.getHttpServer())
        .get(`/objectives/tree/${strategicId}`)
        .expect(200);

      expect(treeResponse.body.id).toBe(strategicId);

      expect(treeResponse.body.level).toBe("strategique");

      expect(treeResponse.body.children).toHaveLength(1);

      expect(treeResponse.body.children[0]).toMatchObject({
        title: "Annual revenue target",
        level: "annuel",
      });
    });

    it("should reject a strategic objective with a parent", async () => {
      const company = await prisma.company.create({
        data: {
          name: `Test Company ${Date.now()}`,
          sector: "IT",
          plan: "premium",
        },
      });

      const parent = await prisma.objective.create({
        data: {
          companyId: company.id,
          title: "Parent objective",
          level: "strategique",
          target: {
            value: 100,
            unit: "pourcent",
            metric: "revenue",
          },
          status: "en_cours",
        },
      });

      await request(app.getHttpServer())
        .post("/objectives")
        .send({
          companyId: company.id,
          title: "Invalid strategic objective",
          level: "strategique",
          parentId: parent.id,
          target: {
            value: 100,
            unit: "pourcent",
            metric: "revenue",
          },
          status: "en_cours",
        })
        .expect(400);
    });

    it("should reject a non-strategic objective without parent", async () => {
      const company = await prisma.company.create({
        data: {
          name: `Test Company ${Date.now()}`,
          sector: "IT",
          plan: "premium",
        },
      });

      await request(app.getHttpServer())
        .post("/objectives")
        .send({
          companyId: company.id,
          title: "Invalid annual objective",
          level: "annuel",
          target: {
            value: 80,
            unit: "pourcent",
            metric: "revenue",
          },
          status: "en_cours",
        })
        .expect(400);
    });

    it("should return 404 when strategic objective does not exist", async () => {
      await request(app.getHttpServer())
        .get("/objectives/tree/non-existing-objective")
        .expect(404);
    });
  });
});