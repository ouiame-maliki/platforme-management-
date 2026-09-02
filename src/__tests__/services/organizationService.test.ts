import {
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

import { OrganizationService } from "../../organization/organization.service";

describe("OrganizationService", () => {
  let service: OrganizationService;

  const prismaMock = {
    company: {
      findUnique: jest.fn(),
    },

    direction: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },

    department: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },

    team: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },

    employee: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new OrganizationService(prismaMock as any);
  });

  describe("createDirection", () => {
    it("should create a direction when company exists", async () => {
      const data = {
        companyId: "company-1",
        name: "Direction IT",
      };

      const createdDirection = {
        id: "direction-1",
        ...data,
      };

      prismaMock.company.findUnique.mockResolvedValue({
        id: "company-1",
      });

      prismaMock.direction.create.mockResolvedValue(
        createdDirection,
      );

      const result = await service.createDirection(data);

      expect(prismaMock.company.findUnique).toHaveBeenCalledWith({
        where: {
          id: "company-1",
        },
      });

      expect(prismaMock.direction.create).toHaveBeenCalledWith({
        data,
      });

      expect(result).toEqual(createdDirection);
    });

    it("should throw NotFoundException when company does not exist", async () => {
      prismaMock.company.findUnique.mockResolvedValue(null);

      const data = {
        companyId: "company-999",
        name: "Direction IT",
      };

      await expect(
        service.createDirection(data),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.direction.create).not.toHaveBeenCalled();
    });
  });

  describe("createDepartment", () => {
    it("should create a department when direction exists", async () => {
      const data = {
        directionId: "direction-1",
        name: "Development",
      };

      const createdDepartment = {
        id: "department-1",
        ...data,
      };

      prismaMock.direction.findUnique.mockResolvedValue({
        id: "direction-1",
      });

      prismaMock.department.create.mockResolvedValue(
        createdDepartment,
      );

      const result = await service.createDepartment(data);

      expect(
        prismaMock.direction.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          id: "direction-1",
        },
      });

      expect(
        prismaMock.department.create,
      ).toHaveBeenCalledWith({
        data,
      });

      expect(result).toEqual(createdDepartment);
    });

    it("should throw NotFoundException when direction does not exist", async () => {
      prismaMock.direction.findUnique.mockResolvedValue(null);

      const data = {
        directionId: "direction-999",
        name: "Development",
      };

      await expect(
        service.createDepartment(data),
      ).rejects.toThrow(NotFoundException);

      expect(
        prismaMock.department.create,
      ).not.toHaveBeenCalled();
    });
  });

  describe("createTeam", () => {
    it("should create a team when department exists", async () => {
      const data = {
        departmentId: "department-1",
        name: "Backend",
      };

      const createdTeam = {
        id: "team-1",
        ...data,
      };

      prismaMock.department.findUnique.mockResolvedValue({
        id: "department-1",
      });

      prismaMock.team.create.mockResolvedValue(
        createdTeam,
      );

      const result = await service.createTeam(data);

      expect(
        prismaMock.department.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          id: "department-1",
        },
      });

      expect(
        prismaMock.team.create,
      ).toHaveBeenCalledWith({
        data,
      });

      expect(result).toEqual(createdTeam);
    });

    it("should throw NotFoundException when department does not exist", async () => {
      prismaMock.department.findUnique.mockResolvedValue(null);

      const data = {
        departmentId: "department-999",
        name: "Backend",
      };

      await expect(
        service.createTeam(data),
      ).rejects.toThrow(NotFoundException);

      expect(
        prismaMock.team.create,
      ).not.toHaveBeenCalled();
    });
  });

  describe("createEmployee", () => {
    it("should create an employee when team exists", async () => {
      const data = {
        teamId: "team-1",
        name: "Ahmed",
        role: "Developer",
        managerId: undefined,
      };

      const createdEmployee = {
        id: "employee-1",
        ...data,
      };

      prismaMock.team.findUnique.mockResolvedValue({
        id: "team-1",
      });

      prismaMock.employee.create.mockResolvedValue(
        createdEmployee,
      );

      const result = await service.createEmployee(data);

      expect(
        prismaMock.team.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          id: "team-1",
        },
      });

      expect(
        prismaMock.employee.create,
      ).toHaveBeenCalledWith({
        data,
      });

      expect(result).toEqual(createdEmployee);
    });

    it("should throw NotFoundException when team does not exist", async () => {
      prismaMock.team.findUnique.mockResolvedValue(null);

      const data = {
        teamId: "team-999",
        name: "Ahmed",
        role: "Developer",
        managerId: undefined,
      };

      await expect(
        service.createEmployee(data),
      ).rejects.toThrow(NotFoundException);

      expect(
        prismaMock.employee.create,
      ).not.toHaveBeenCalled();
    });
  });

  describe("findDirections", () => {
    it("should return directions with pagination", async () => {
      const directions = [
        {
          id: "direction-1",
          companyId: "company-1",
          name: "IT",
        },
      ];

      prismaMock.company.findUnique.mockResolvedValue({
        id: "company-1",
      });

      prismaMock.direction.findMany.mockResolvedValue(
        directions,
      );

      const result = await service.findDirections({
        companyId: "company-1",
        limit: "5",
        offset: "10",
      });

      expect(
        prismaMock.direction.findMany,
      ).toHaveBeenCalledWith({
        where: {
          companyId: "company-1",
        },
        take: 5,
        skip: 10,
      });

      expect(result).toEqual(directions);
    });

    it("should throw NotFoundException when company does not exist", async () => {
      prismaMock.company.findUnique.mockResolvedValue(null);

      await expect(
        service.findDirections({
          companyId: "company-999",
        }),
      ).rejects.toThrow(NotFoundException);

      expect(
        prismaMock.direction.findMany,
      ).not.toHaveBeenCalled();
    });
  });

  describe("findDepartments", () => {
    it("should return departments with pagination", async () => {
      const departments = [
        {
          id: "department-1",
          directionId: "direction-1",
          name: "Development",
        },
      ];

      prismaMock.direction.findUnique.mockResolvedValue({
        id: "direction-1",
      });

      prismaMock.department.findMany.mockResolvedValue(
        departments,
      );

      const result = await service.findDepartments({
        directionId: "direction-1",
        limit: "5",
        offset: "0",
      });

      expect(
        prismaMock.department.findMany,
      ).toHaveBeenCalledWith({
        where: {
          directionId: "direction-1",
        },
        take: 5,
        skip: 0,
      });

      expect(result).toEqual(departments);
    });
  });

  describe("findTeams", () => {
    it("should return teams with pagination", async () => {
      const teams = [
        {
          id: "team-1",
          departmentId: "department-1",
          name: "Backend",
        },
      ];

      prismaMock.department.findUnique.mockResolvedValue({
        id: "department-1",
      });

      prismaMock.team.findMany.mockResolvedValue(teams);

      const result = await service.findTeams({
        departmentId: "department-1",
        limit: "10",
        offset: "0",
      });

      expect(
        prismaMock.team.findMany,
      ).toHaveBeenCalledWith({
        where: {
          departmentId: "department-1",
        },
        take: 10,
        skip: 0,
      });

      expect(result).toEqual(teams);
    });
  });

  describe("findEmployees", () => {
    it("should return employees with pagination", async () => {
      const employees = [
        {
          id: "employee-1",
          teamId: "team-1",
          name: "Ahmed",
          role: "Developer",
        },
      ];

      prismaMock.team.findUnique.mockResolvedValue({
        id: "team-1",
      });

      prismaMock.employee.findMany.mockResolvedValue(
        employees,
      );

      const result = await service.findEmployees({
        teamId: "team-1",
        limit: "20",
        offset: "0",
      });

      expect(
        prismaMock.employee.findMany,
      ).toHaveBeenCalledWith({
        where: {
          teamId: "team-1",
        },
        take: 20,
        skip: 0,
      });

      expect(result).toEqual(employees);
    });
  });

  describe("pagination validation", () => {
    it("should reject a negative limit", async () => {
      await expect(
        service.findDirections({
          companyId: "company-1",
          limit: "-5",
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should reject a negative offset", async () => {
      await expect(
        service.findDirections({
          companyId: "company-1",
          offset: "-1",
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should reject a non-integer limit", async () => {
      await expect(
        service.findDirections({
          companyId: "company-1",
          limit: "abc",
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});