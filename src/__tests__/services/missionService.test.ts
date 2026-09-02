import {
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

import { MissionService } from "../../organization/mission.service";
import { MissionStatus } from "@virtual-ai-manager/shared-types";

describe("MissionService", () => {
  const prismaMock = {
    mission: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    objective: {
      findUnique: jest.fn(),
    },
  };

  let service: MissionService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new MissionService(prismaMock as any);
  });

  describe("createMission", () => {
    it("should create a mission", async () => {
      const body = {
        objectiveId: "obj-1",
        responsableId: "emp-1",
        teamId: "team-1",
        priorite: "haute",
        dependances: ["mission-1"],
        livrables: [{ name: "rapport" }],
        checklist: [{ task: "validation" }],
        dateLimite: "2026-09-15",
        kpi: [{ name: "KPI 1" }],
        status: "en_cours",
        createdBy: "emp-1",
      };

      const createdMission = {
        id: "mission-1",
        ...body,
        dateLimite: new Date("2026-09-15"),
      };

      prismaMock.mission.create.mockResolvedValue(createdMission);

      const result = await service.createMission(body);

      expect(prismaMock.mission.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          objectiveId: "obj-1",
          responsableId: "emp-1",
          teamId: "team-1",
          priorite: "haute",
          dependances: ["mission-1"],
        }),
      });

      expect(result).toEqual(createdMission);
    });

    it("should reject an invalid priority", async () => {
      const body = {
        objectiveId: "obj-1",
        responsableId: "emp-1",
        teamId: "team-1",
        priorite: "urgente",
        dependances: [],
        livrables: [],
        checklist: [],
        dateLimite: "2026-09-15",
        kpi: [],
        status: "en_cours",
        createdBy: "emp-1",
      };

      await expect(
        service.createMission(body),
      ).rejects.toThrow();

      expect(prismaMock.mission.create).not.toHaveBeenCalled();
    });
  });

  describe("getMissions", () => {
    it("should return missions", async () => {
      const missions = [
        {
          id: "mission-1",
          objectiveId: "obj-1",
          priorite: "haute",
          status: "en_cours",
        },
        {
          id: "mission-2",
          objectiveId: "obj-2",
          priorite: "basse",
          status: "terminee",
        },
      ];

      prismaMock.mission.findMany.mockResolvedValue(missions);

      const result = await service.getMissions();

      expect(prismaMock.mission.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: {
          dateLimite: "asc",
        },
        take: 50,
        skip: 0,
      });

      expect(result).toEqual(missions);
    });

    it("should filter missions by teamId, status and priorite", async () => {
      prismaMock.mission.findMany.mockResolvedValue([]);

      await service.getMissions(
        "team-1",
        "en_cours",
        "haute",
      );

      expect(prismaMock.mission.findMany).toHaveBeenCalledWith({
        where: {
          teamId: "team-1",
          status: "en_cours",
          priorite: "haute",
        },
        orderBy: {
          dateLimite: "asc",
        },
        take: 50,
        skip: 0,
      });
    });

    it("should use limit and offset for pagination", async () => {
      prismaMock.mission.findMany.mockResolvedValue([]);

      await service.getMissions(
        undefined,
        undefined,
        undefined,
        10,
        20,
      );

      expect(prismaMock.mission.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: {
          dateLimite: "asc",
        },
        take: 10,
        skip: 20,
      });
    });
  });

  describe("updateMissionStatus", () => {
    it("should update the mission status", async () => {
      const validStatus = MissionStatus.options[0];

      const currentMission = {
        id: "mission-1",
        status: validStatus,
      };

      const updatedMission = {
        ...currentMission,
        status: validStatus,
      };

      prismaMock.mission.findUnique.mockResolvedValue(
        currentMission,
      );

      prismaMock.mission.update.mockResolvedValue(
        updatedMission,
      );

      const result = await service.updateMissionStatus(
        "mission-1",
        {
          status: validStatus,
        },
      );

      expect(
        prismaMock.mission.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          id: "mission-1",
        },
      });

      expect(
        prismaMock.mission.update,
      ).toHaveBeenCalledWith({
        where: {
          id: "mission-1",
        },
        data: {
          status: validStatus,
        },
      });

      expect(result).toEqual(updatedMission);
    });

    it("should throw NotFoundException if mission does not exist", async () => {
      prismaMock.mission.findUnique.mockResolvedValue(null);

      const validStatus = MissionStatus.options[0];

      await expect(
        service.updateMissionStatus(
          "mission-999",
          {
            status: validStatus,
          },
        ),
      ).rejects.toThrow(NotFoundException);

      expect(
        prismaMock.mission.update,
      ).not.toHaveBeenCalled();
    });

    it("should reject an invalid status", async () => {
      await expect(
        service.updateMissionStatus(
          "mission-1",
          {
            status: "invalid-status",
          },
        ),
      ).rejects.toThrow();

      expect(
        prismaMock.mission.findUnique,
      ).not.toHaveBeenCalled();

      expect(
        prismaMock.mission.update,
      ).not.toHaveBeenCalled();
    });
  });

  describe("getMissionDetails", () => {
    it("should return mission details with objective hierarchy", async () => {
      const mission = {
        id: "mission-1",
        objectiveId: "obj-child",
        responsableId: "emp-1",
        teamId: "team-1",
        priorite: "haute",
        dependances: [],
        livrables: [],
        checklist: [],
        dateLimite: new Date("2026-09-15"),
        kpi: [],
        status: "en_cours",
        createdBy: "emp-1",

        objective: {
          id: "obj-child",
        },

        responsable: {
          id: "emp-1",
          name: "Employee 1",
        },

        team: {
          id: "team-1",
          name: "Team 1",
        },
      };

      const childObjective = {
        id: "obj-child",
        title: "Child objective",
        level: 2,
        target: 100,
        status: "en_cours",
        parentId: "obj-parent",
      };

      const parentObjective = {
        id: "obj-parent",
        title: "Parent objective",
        level: 1,
        target: 200,
        status: "en_cours",
        parentId: null,
      };

      prismaMock.mission.findUnique.mockResolvedValue(
        mission,
      );

      prismaMock.objective.findUnique
        .mockResolvedValueOnce(childObjective)
        .mockResolvedValueOnce(parentObjective);

      const result =
        await service.getMissionDetails("mission-1");

      expect(
        prismaMock.mission.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          id: "mission-1",
        },
        include: {
          objective: true,
          responsable: true,
          team: {
            include: {
              department: {
                include: {
                  direction: true,
                },
              },
            },
          },
        },
      });

      expect(result).toEqual({
        id: "mission-1",

        objective: {
          id: "obj-child",
          title: "Child objective",
          level: 2,
          target: 100,
          status: "en_cours",

          parent: {
            id: "obj-parent",
            title: "Parent objective",
            level: 1,
            target: 200,
            status: "en_cours",
            parent: null,
          },
        },

        responsable: mission.responsable,
        team: mission.team,
        priorite: "haute",
        dependances: [],
        livrables: [],
        checklist: [],
        dateLimite: mission.dateLimite,
        kpi: [],
        status: "en_cours",
        createdBy: "emp-1",
      });
    });

    it("should return a mission without parent objective", async () => {
      const mission = {
        id: "mission-1",
        objectiveId: "obj-1",
        responsable: {
          id: "emp-1",
        },
        team: {
          id: "team-1",
        },
        priorite: "moyenne",
        dependances: [],
        livrables: [],
        checklist: [],
        dateLimite: new Date("2026-09-15"),
        kpi: [],
        status: "en_cours",
        createdBy: "emp-1",
      };

      const objective = {
        id: "obj-1",
        title: "Main objective",
        level: 1,
        target: 100,
        status: "en_cours",
        parentId: null,
      };

      prismaMock.mission.findUnique.mockResolvedValue(
        mission,
      );

      prismaMock.objective.findUnique.mockResolvedValue(
        objective,
      );

      const result =
        await service.getMissionDetails("mission-1");

      expect(result.objective).toEqual({
        id: "obj-1",
        title: "Main objective",
        level: 1,
        target: 100,
        status: "en_cours",
        parent: null,
      });
    });

    it("should throw NotFoundException if mission does not exist", async () => {
      prismaMock.mission.findUnique.mockResolvedValue(null);

      await expect(
        service.getMissionDetails("mission-999"),
      ).rejects.toThrow(NotFoundException);

      expect(
        prismaMock.objective.findUnique,
      ).not.toHaveBeenCalled();
    });
  });
});