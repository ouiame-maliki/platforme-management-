import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { JobDescriptionSchema } from "@virtual-ai-manager/shared-types";
import { Prisma } from '@prisma/client';

const CreateJobDescriptionSchema = JobDescriptionSchema
  .omit({
    id: true,
  })
  .extend({
    objectifs: z.array(z.json()),
    responsabilites: z.array(z.json()),
    taches: z.array(z.json()),
    competences: z.array(z.json()),
    kpi: z.array(z.json()),
    livrables: z.array(z.json()),
    frequence: z.enum([
      "daily",
      "weekly",
      "monthly",
      "quarterly",
      "annually",
    ]),
    risques: z.array(z.json()),
    procedures: z.array(z.json()),
  });

const UpdateJobDescriptionSchema = CreateJobDescriptionSchema.partial().extend({
    version: z.number().int().positive(),
  });

type CreateJobDescriptionDto = z.infer<typeof CreateJobDescriptionSchema>;
type UpdateJobDescriptionDto = z.infer<typeof UpdateJobDescriptionSchema>;

@Injectable()
export class JobDescriptionService {
    constructor(private readonly prisma: PrismaService) {}

    async createJobDescription(body: unknown) {
        const data = CreateJobDescriptionSchema.parse(body);

        
        return this.prisma.jobDescription.create({
         data,
        });
    }

    async getJobDescription(employeeId: string, companyId: string) {
      const employee = await this.prisma.employee.findUnique({
        where: {
            id: employeeId,
        },
        include: {
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

    if (!employee) {
        throw new NotFoundException('Employee not found');
    }

    if (employee.team.department.direction.companyId !== companyId) {
        throw new NotFoundException('Employee not found in this company');
    }

    const jobDescription = await this.prisma.jobDescription.findFirst({
        where: {
            employeeRole: employee.role,
        },
    });

    if (!jobDescription) {
        throw new NotFoundException('Job description not found');
    }

    return jobDescription;
    }

    async updateJobDescription(id: string, body: unknown) {
     const data: UpdateJobDescriptionDto = UpdateJobDescriptionSchema.parse(body);
     const current = await this.prisma.jobDescription.findUnique({
        where: {
          id,
        },
    });

    if (!current) {
      throw new NotFoundException('Job description not found');
    }

    if (current.version !== data.version) {
      throw new ConflictException('Version conflict');
    }

    const { version, ...updates } = data;

    return this.prisma.jobDescription.update({
      where: {
        id,
      },
      data: {
        ...updates,
        version: {
          increment: 1,
        },
      },
    });
  }}
