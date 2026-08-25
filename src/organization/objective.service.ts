import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { z } from "zod";
import { ObjectiveSchema } from "@virtual-ai-manager/shared-types";

const CreateObjectiveSchema = ObjectiveSchema
  .omit({ id: true })
  .extend({
    target: z.object({
      value: z.number(),
      unit: z.string(),
      metric: z.string(),
    }),
  });

const UpdateObjectiveStatusSchema = z.object({
  status: z.string(),
});

@Injectable()
export class ObjectiveService {
  private readonly objectiveCache = new Map<string, any[]>();
  constructor(private readonly prisma: PrismaService) {}

  async createObjective(body: unknown) {
    const data = CreateObjectiveSchema.parse(body);

    if (data.level === "strategique") {
      if (data.parentId !== undefined) {
        throw new BadRequestException("Strategic objectives cannot have a parent objective.");
      }

      return this.prisma.objective.create({
        data,
      });
    }

    if (data.parentId === undefined) {
      throw new BadRequestException("Non-strategic objectives must have a parent objective.");
    }

    const parent = await this.prisma.objective.findUnique({
      where: {
        id: data.parentId,
      },
    });

    if (!parent) {
      throw new NotFoundException("Parent objective not found.");
    }

    const allowedChildLevel: Record<string, string> = {
      strategique: "annuel",
      annuel: "trimestriel",
      trimestriel: "mensuel",
      mensuel: "hebdomadaire",
      hebdomadaire: "journalier",
    };

    if (parent.level === "journalier") {
      throw new BadRequestException(
        "A daily objective cannot have child objectives.",
      );
    }

    const childLevel = allowedChildLevel[parent.level];

    if (data.level !== childLevel) {
      throw new BadRequestException(
        `Invalid level for child objective. Expected: ${childLevel}, got: ${data.level}`,
      );
    }

    return this.prisma.objective.create({
      data,
    });
  }

  async getObjectiveTree(strategicId: string) {
  const strategic = await this.prisma.objective.findUnique({
    where: {
      id: strategicId,
    },
  });

  if (!strategic) {
    throw new NotFoundException("Strategic objective not found");
  }

  const getChildren = async (parentId: string): Promise<any[]> => {
    if (this.objectiveCache.has(parentId)) {
      return this.objectiveCache.get(parentId)!;
    }

    const children = await this.prisma.objective.findMany({
      where: {
        parentId,
      },
    });

    const result = await Promise.all(
      children.map(async (child) => ({
        id: child.id,
        title: child.title,
        level: child.level,
        target: child.target,
        status: child.status,
        children: await getChildren(child.id),
      })),
    );

    this.objectiveCache.set(parentId, result);

    return result;
  };

  return {
    id: strategic.id,
    title: strategic.title,
    level: strategic.level,
    target: strategic.target,
    status: strategic.status,
    children: await getChildren(strategic.id),
  };
  }
  async updateObjectiveStatus(id: string, body: unknown) {
    const data = UpdateObjectiveStatusSchema.parse(body);

    const current = await this.prisma.objective.findUnique({
      where: {
        id,
      },
    });
    if (!current) {
      throw new NotFoundException("Objective not found");
    }

    const updated = await this.prisma.objective.update({
      where: {
        id,
      },
      data: {
        status: data.status,
      },
    });
    this.objectiveCache.clear();
    return updated;
  }

  async getObjectives(companyId?: string, level?: string) {
    return this.prisma.objective.findMany({
      where: {
        ...(companyId && { companyId }),
        ...(level && { level }),
      },
   });
  }
}