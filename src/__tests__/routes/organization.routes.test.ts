import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";

describe("Organization API", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /companies + GET /companies/:id/orgchart", () => {
    it("should create a company and return its complete organization chart", async () => {
      /*
       * 1. Create company
       */
      const companyResponse = await request(
        app.getHttpServer(),
      )
        .post("/companies")
        .send({
          name: `Test Company ${Date.now()}`,
          sector: "Technology",
          plan: "premium",
        })
        .expect(201);

      const company = companyResponse.body;

      expect(company.id).toBeDefined();
      expect(company.name).toContain("Test Company");

      /*
       * 2. Create direction
       */
      const directionResponse = await request(
        app.getHttpServer(),
      )
        .post("/directions")
        .send({
          companyId: company.id,
          name: "Engineering",
        })
        .expect(201);

      const direction = directionResponse.body;

      /*
       * 3. Create department
       */
      const departmentResponse = await request(
        app.getHttpServer(),
      )
        .post("/departments")
        .send({
          directionId: direction.id,
          name: "Backend",
        })
        .expect(201);

      const department = departmentResponse.body;

      /*
       * 4. Create team
       */
      const teamResponse = await request(
        app.getHttpServer(),
      )
        .post("/teams")
        .send({
          departmentId: department.id,
          name: "API Team",
        })
        .expect(201);

      const team = teamResponse.body;

      /*
       * 5. Create manager employee
       */
      const managerResponse = await request(
        app.getHttpServer(),
      )
        .post("/employees")
        .send({
          teamId: team.id,
          name: "Manager Test",
          role: "Manager",
        })
        .expect(201);

      const manager = managerResponse.body;

      /*
       * 6. Create subordinate employee
       */
      const employeeResponse = await request(
        app.getHttpServer(),
      )
        .post("/employees")
        .send({
          teamId: team.id,
          name: "Developer Test",
          role: "Developer",
          managerId: manager.id,
        })
        .expect(201);

      const employee = employeeResponse.body;

      /*
       * 7. Get organization chart
       */
      const orgchartResponse = await request(
        app.getHttpServer(),
      )
        .get(`/companies/${company.id}/orgchart`)
        .expect(200);

      const orgchart = orgchartResponse.body;

      /*
       * Company
       */
      expect(orgchart).toMatchObject({
        id: company.id,
        name: company.name,
        type: "company",
      });

      /*
       * Direction
       */
      expect(orgchart.children).toHaveLength(1);

      expect(orgchart.children[0]).toMatchObject({
        id: direction.id,
        name: "Engineering",
        type: "direction",
      });

      /*
       * Department
       */
      expect(
        orgchart.children[0].children,
      ).toHaveLength(1);

      expect(
        orgchart.children[0].children[0],
      ).toMatchObject({
        id: department.id,
        name: "Backend",
        type: "department",
      });

      /*
       * Team
       */
      expect(
        orgchart.children[0].children[0].children,
      ).toHaveLength(1);

      expect(
        orgchart.children[0].children[0].children[0],
      ).toMatchObject({
        id: team.id,
        name: "API Team",
        type: "team",
      });

      /*
       * Manager employee
       */
      const teamNode =
        orgchart.children[0]
          .children[0]
          .children[0];

      expect(teamNode.children).toHaveLength(1);

      expect(teamNode.children[0]).toMatchObject({
        id: manager.id,
        name: "Manager Test",
        type: "employee",
      });

      /*
       * Subordinate
       */
      expect(teamNode.children[0].children).toHaveLength(1);

      expect(
        teamNode.children[0].children[0],
      ).toMatchObject({
        id: employee.id,
        name: "Developer Test",
        type: "employee",
        children: [],
      });
    });

    it("should return 404 when company does not exist", async () => {
      await request(app.getHttpServer())
        .get("/companies/c9999999999999999999999999/orgchart")
        .expect(404);
    });
  });
});