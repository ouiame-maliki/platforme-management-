import { ObjectiveService } from "../../organization/objective.service";
import {
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

describe("ObjectiveService", () => {
  let service: ObjectiveService;

  const prismaMock = {
    objective: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ObjectiveService(
      prismaMock as any,
    );
  });

  describe("createObjective", () => {
    it("should create a strategic objective without parent", async () => {
      const objective = {
        companyId: "company-1",
        title: "Strategic objective",
        level: "strategique",
        target: {
          value: 100,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      const createdObjective = {
        id: "obj-1",
        ...objective,
      };

      prismaMock.objective.create.mockResolvedValue(
        createdObjective,
      );

      const result =
        await service.createObjective(objective);

      expect(
        prismaMock.objective.create,
      ).toHaveBeenCalledWith({
        data: objective,
      });

      expect(result).toEqual(
        createdObjective,
      );
    });

    it("should reject a strategic objective with a parent", async () => {
      const objective = {
        companyId: "company-1",
        title: "Strategic objective",
        level: "strategique",
        parentId: "parent-1",
        target: {
          value: 100,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      await expect(
        service.createObjective(objective),
      ).rejects.toThrow(BadRequestException);

      expect(
        prismaMock.objective.create,
      ).not.toHaveBeenCalled();
    });

    it("should reject a non-strategic objective without parent", async () => {
      const objective = {
        companyId: "company-1",
        title: "Annual objective",
        level: "annuel",
        target: {
          value: 80,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      await expect(
        service.createObjective(objective),
      ).rejects.toThrow(BadRequestException);

      expect(
        prismaMock.objective.create,
      ).not.toHaveBeenCalled();
    });

    it("should reject when parent objective does not exist", async () => {
      prismaMock.objective.findUnique.mockResolvedValue(
        null,
      );

      const objective = {
        companyId: "company-1",
        title: "Annual objective",
        level: "annuel",
        parentId: "obj-999",
        target: {
          value: 80,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      await expect(
        service.createObjective(objective),
      ).rejects.toThrow(NotFoundException);

      expect(
        prismaMock.objective.create,
      ).not.toHaveBeenCalled();
    });

    it("should create an annual objective under a strategic objective", async () => {
      const parent = {
        id: "obj-1",
        title: "Strategic objective",
        level: "strategique",
        target: {
          value: 100,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      const objective = {
        companyId: "company-1",
        title: "Annual objective",
        level: "annuel",
        parentId: "obj-1",
        target: {
          value: 80,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      const createdObjective = {
        id: "obj-2",
        ...objective,
      };

      prismaMock.objective.findUnique.mockResolvedValue(
        parent,
      );

      prismaMock.objective.create.mockResolvedValue(
        createdObjective,
      );

      const result =
        await service.createObjective(objective);

      expect(
        prismaMock.objective.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          id: "obj-1",
        },
      });

      expect(
        prismaMock.objective.create,
      ).toHaveBeenCalledWith({
        data: objective,
      });

      expect(result).toEqual(
        createdObjective,
      );
    });

    it("should reject an invalid child level", async () => {
      prismaMock.objective.findUnique.mockResolvedValue({
        id: "obj-1",
        level: "strategique",
      });

      const objective = {
        companyId: "company-1",
        title: "Monthly objective",
        level: "mensuel",
        parentId: "obj-1",
        target: {
          value: 80,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      await expect(
        service.createObjective(objective),
      ).rejects.toThrow(BadRequestException);

      expect(
        prismaMock.objective.create,
      ).not.toHaveBeenCalled();
    });

    it("should reject a child objective under a daily objective", async () => {
      prismaMock.objective.findUnique.mockResolvedValue({
        id: "obj-1",
        level: "journalier",
      });

      const objective = {
        companyId: "company-1",
        title: "Child objective",
        level: "journalier",
        parentId: "obj-1",
        target: {
          value: 80,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      await expect(
        service.createObjective(objective),
      ).rejects.toThrow(BadRequestException);

      expect(
        prismaMock.objective.create,
      ).not.toHaveBeenCalled();
    });

    it("should create a trimestriel objective under an annuel objective", async () => {
      prismaMock.objective.findUnique.mockResolvedValue({
        id: "obj-annual",
        level: "annuel",
      });

      const objective = {
        companyId: "company-1",
        title: "Quarter objective",
        level: "trimestriel",
        parentId: "obj-annual",
        target: {
          value: 80,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      prismaMock.objective.create.mockResolvedValue({
        id: "obj-quarter",
        ...objective,
      });

      const result =
        await service.createObjective(objective);

      expect(result.id).toBe(
        "obj-quarter",
      );

      expect(
        prismaMock.objective.create,
      ).toHaveBeenCalled();
    });

    it("should create a mensuel objective under a trimestriel objective", async () => {
      prismaMock.objective.findUnique.mockResolvedValue({
        id: "obj-quarter",
        level: "trimestriel",
      });

      const objective = {
        companyId: "company-1",
        title: "Monthly objective",
        level: "mensuel",
        parentId: "obj-quarter",
        target: {
          value: 80,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      prismaMock.objective.create.mockResolvedValue({
        id: "obj-month",
        ...objective,
      });

      const result =
        await service.createObjective(objective);

      expect(result.id).toBe(
        "obj-month",
      );
    });

    it("should create a hebdomadaire objective under a mensuel objective", async () => {
      prismaMock.objective.findUnique.mockResolvedValue({
        id: "obj-month",
        level: "mensuel",
      });

      const objective = {
        companyId: "company-1",
        title: "Weekly objective",
        level: "hebdomadaire",
        parentId: "obj-month",
        target: {
          value: 80,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      prismaMock.objective.create.mockResolvedValue({
        id: "obj-week",
        ...objective,
      });

      const result =
        await service.createObjective(objective);

      expect(result.id).toBe(
        "obj-week",
      );
    });

    it("should create a journalier objective under a hebdomadaire objective", async () => {
      prismaMock.objective.findUnique.mockResolvedValue({
        id: "obj-week",
        level: "hebdomadaire",
      });

      const objective = {
        companyId: "company-1",
        title: "Daily objective",
        level: "journalier",
        parentId: "obj-week",
        target: {
          value: 80,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      };

      prismaMock.objective.create.mockResolvedValue({
        id: "obj-day",
        ...objective,
      });

      const result =
        await service.createObjective(objective);

      expect(result.id).toBe(
        "obj-day",
      );
    });
  });

  describe("getObjectiveTree", () => {
    it("should return the objective tree with children", async () => {
      prismaMock.objective.findUnique.mockResolvedValue({
        id: "obj-1",
        title: "Strategic objective",
        level: "strategique",
        target: {
          value: 100,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      });

      prismaMock.objective.findMany.mockResolvedValue(
        [],
      );

      const result =
        await service.getObjectiveTree(
          "obj-1",
        );

      expect(result).toEqual({
        id: "obj-1",
        title: "Strategic objective",
        level: "strategique",
        target: {
          value: 100,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
        children: [],
      });
    });

    it("should throw NotFoundException if strategic objective does not exist", async () => {
      prismaMock.objective.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.getObjectiveTree(
          "obj-999",
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it("should build multiple levels of objective hierarchy", async () => {
      prismaMock.objective.findUnique.mockResolvedValue({
        id: "obj-1",
        title: "Strategic",
        level: "strategique",
        target: {
          value: 100,
          unit: "pourcent",
          metric: "revenue",
        },
        status: "en_cours",
      });

      prismaMock.objective.findMany.mockImplementation(
        async ({ where }: any) => {
          if (where.parentId === "obj-1") {
            return [
              {
                id: "obj-2",
                title: "Annual",
                level: "annuel",
                target: {
                  value: 80,
                  unit: "pourcent",
                  metric: "revenue",
                },
                status: "en_cours",
              },
            ];
          }

          if (where.parentId === "obj-2") {
            return [
              {
                id: "obj-3",
                title: "Quarter",
                level: "trimestriel",
                target: {
                  value: 70,
                  unit: "pourcent",
                  metric: "revenue",
                },
                status: "en_cours",
              },
            ];
          }

          return [];
        },
      );

      const result =
        await service.getObjectiveTree(
          "obj-1",
        );

      expect(result.children).toHaveLength(
        1,
      );

      expect(
        result.children[0].id,
      ).toBe("obj-2");

      expect(
        result.children[0].children,
      ).toHaveLength(1);

      expect(
        result.children[0].children[0].id,
      ).toBe("obj-3");
    });
  });

  describe("updateObjectiveStatus", () => {
    it("should update objective status", async () => {
      const objective = {
        id: "obj-1",
        status: "en_cours",
      };

      const updatedObjective = {
        id: "obj-1",
        status: "termine",
      };

      prismaMock.objective.findUnique.mockResolvedValue(
        objective,
      );

      prismaMock.objective.update.mockResolvedValue(
        updatedObjective,
      );

      const result =
        await service.updateObjectiveStatus(
          "obj-1",
          {
            status: "termine",
          },
        );

      expect(
        prismaMock.objective.update,
      ).toHaveBeenCalledWith({
        where: {
          id: "obj-1",
        },
        data: {
          status: "termine",
        },
      });

      expect(result).toEqual(
        updatedObjective,
      );
    });

    it("should throw NotFoundException if objective does not exist", async () => {
      prismaMock.objective.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.updateObjectiveStatus(
          "obj-999",
          {
            status: "termine",
          },
        ),
      ).rejects.toThrow(NotFoundException);

      expect(
        prismaMock.objective.update,
      ).not.toHaveBeenCalled();
    });
  });

  describe("getObjectives", () => {
    it("should return all objectives", async () => {
      const objectives = [
        {
          id: "obj-1",
          title: "Strategic objective",
          level: "strategique",
        },
      ];

      prismaMock.objective.findMany.mockResolvedValue(
        objectives,
      );

      const result =
        await service.getObjectives();

      expect(
        prismaMock.objective.findMany,
      ).toHaveBeenCalledWith({
        where: {},
      });

      expect(result).toEqual(
        objectives,
      );
    });

    it("should filter objectives by companyId and level", async () => {
      prismaMock.objective.findMany.mockResolvedValue(
        [],
      );

      await service.getObjectives(
        "company-1",
        "annuel",
      );

      expect(
        prismaMock.objective.findMany,
      ).toHaveBeenCalledWith({
        where: {
          companyId: "company-1",
          level: "annuel",
        },
      });
    });
  });
});