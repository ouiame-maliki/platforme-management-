import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrgchartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrgchart(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        directions: {
          include: {
            departments: {
              include: {
                teams: {
                  include: {
                    employees: {
                      include: {
                        manager: true,
                        subordinates: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      id: company.id,
      name: company.name,
      type: 'company',
      children: company.directions.map((direction) => ({
        id: direction.id,
        name: direction.name,
        type: 'direction',

        children: direction.departments.map((department) => ({
          id: department.id,
          name: department.name,
          type: 'department',

          children: department.teams.map((team) => ({
            id: team.id,
            name: team.name,
            type: 'team',

            children: team.employees
             .filter((employee) => employee.managerId === null)
             .map((employee) => ({
              id: employee.id,
              name: employee.name,
              type: 'employee',

              children: employee.subordinates.map((subordinate) => ({
                id: subordinate.id,
                name: subordinate.name,
                type: 'employee',
                children: [],
              })),
            })),
          })),
        })),
      })),
    };
  }
}