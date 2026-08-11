import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { z } from "zod";
import { DirectionSchema, DepartmentSchema, TeamSchema, EmployeeSchema } from "@virtual-ai-manager/shared-types";

type CreateDirectionDto = Omit<z.infer<typeof DirectionSchema>, "id">;
type CreateDepartmentDto = Omit<z.infer<typeof DepartmentSchema>, "id">;
type CreateTeamDto = Omit<z.infer<typeof TeamSchema>, "id">;
type CreateEmployeeDto = Omit<z.infer<typeof EmployeeSchema>, "id">;

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  private getPagination(query: any) {
  const take = query.limit ? Number(query.limit) : 10;
  const skip = query.offset ? Number(query.offset) : 0;

  if (!Number.isInteger(take) || take <= 0) {
    throw new BadRequestException("limit must be a positive integer");
  }

  if (!Number.isInteger(skip) || skip < 0) {
    throw new BadRequestException("offset must be a non-negative integer");
  }

  return { take, skip };
}
  
  async createDirection(data: CreateDirectionDto) {
    const company = await this.prisma.company.findUnique({
        where: {
            id: data.companyId,
        }
    })
    if (!company) {
        throw new NotFoundException("Company not found");
    }
    return this.prisma.direction.create({
        data,
    });
  }
  async createDepartment(data: CreateDepartmentDto) {
    const direction = await this.prisma.direction.findUnique({
        where: {
            id: data.directionId,
        }
    })
    if (!direction) {
        throw new NotFoundException("Direction not found");
    }
    return await this.prisma.department.create({
        data,
    });
  }
  async createTeam(data: CreateTeamDto) {
    const department = await this.prisma.department.findUnique({
        where: {
            id: data.departmentId,
        }
    })
    if (!department) {
        throw new NotFoundException("Department not found");
    }
    return await this.prisma.team.create({
        data,
    });
  }
  async createEmployee(data: CreateEmployeeDto) {
    const team = await this.prisma.team.findUnique({
        where: {
            id: data.teamId,
        }
    })
    if (!team) {
        throw new NotFoundException("Team not found");
    }
    return await this.prisma.employee.create({
        data,
    });
  }
  async findDirections(query: any) {
    const { take, skip } = this.getPagination(query);
    const company = await this.prisma.company.findUnique({
        where: {
            id: query.companyId,
        }
    })
    if (!company) {
        throw new NotFoundException("Company not found");
    }

    return this.prisma.direction.findMany({
        where: {
            companyId: query.companyId,
        },
        take,
        skip,
    })
  }
  async findDepartments(query: any) {
    const { take, skip } = this.getPagination(query);
    const direction = await this.prisma.direction.findUnique({
        where: { 
            id: query.directionId,
        }
    })
    if (!direction) {
        throw new NotFoundException("Direction not found");
    }
    return this.prisma.department.findMany({
        where: {
            directionId: query.directionId,
        },
        take,
        skip,
    })
 }
 async findTeams(query: any) {
        const { take, skip } = this.getPagination(query);
        const department = await this.prisma.department.findUnique({
            where: {
                id: query.departmentId,
            }
        })
        if (!department) {
            throw new NotFoundException("Department not found");
        }
        return this.prisma.team.findMany({
            where: {
                departmentId: query.departmentId,
            },
            take,
            skip,
        })
 }
 async findEmployees(query: any) {
        const { take, skip } = this.getPagination(query);
        const team = await this.prisma.team.findUnique({
            where: {
                id: query.teamId,
            }
        })
        if (!team) {
            throw new NotFoundException("Team not found");
        }
        return this.prisma.employee.findMany({
            where: {
                teamId: query.teamId,

            },
            take,
            skip,
        })
    }
}







