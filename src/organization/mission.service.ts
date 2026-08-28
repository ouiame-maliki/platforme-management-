import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { z } from "zod";
import { MissionSchema } from "@virtual-ai-manager/shared-types";
import { MissionStatus } from "@virtual-ai-manager/shared-types"
import { Prisma } from "@prisma/client";

const CreateMissionSchema = MissionSchema
  .omit({
    id: true,
  })
  .extend({
    priorite: z.enum([
      "haute",
      "moyenne",
      "basse",
    ]),
    dependances: z.array(z.string()),
    livrables: z.array(z.json()),
    checklist: z.array(z.json()),
    kpi: z.array(z.json()),
    dateLimite: z.coerce.date(),
  });

const UpdateMissionStatusSchema = z.object({
  status: MissionStatus,
});


@Injectable()
export class MissionService {
  constructor(private readonly prisma: PrismaService) {}

  async createMission(body: unknown) {
    const data = CreateMissionSchema.parse(body);

    return this.prisma.mission.create({
      data,
    });
  }

  async getMissions( 
         teamId?: string,
         status?: string,
         priorite?: string,
         limit = 50,
         offset =0,
  ) {
    return this.prisma.mission.findMany({
     where: {
      ...(teamId && { teamId }),
      ...(status && { status }),
      ...(priorite && { priorite }),
    },
     orderBy: {
      dateLimite: "asc",
    },
     take: limit,
     skip: offset,
  });
  }

  async updateMissionStatus(id: string, body: unknown) {
  const data = UpdateMissionStatusSchema.parse(body);

  const current = await this.prisma.mission.findUnique({
    where: {
      id,
    },
  });

  if (!current) {
    throw new NotFoundException("Mission not found");
  }

  return this.prisma.mission.update({
    where: {
      id,
    },
    data: {
      status: data.status,
    },
  });
  }
  
  async getMissionDetails(id: string) {

    const mission =
      await this.prisma.mission.findUnique({
        where: {
          id,
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


    if (!mission) {
      throw new NotFoundException("Mission not found");
    }

    const getObjectiveHierarchy = async (
        objectiveId: string, ): Promise<any> => {
        const objective =
          await this.prisma.objective.findUnique({
            where: {
              id: objectiveId,
            },
          });


        if (!objective) {
          return null;
        }


        return {
          id: objective.id,
          title: objective.title,
          level: objective.level,
          target: objective.target,
          status: objective.status,

          parent: objective.parentId
            ? await getObjectiveHierarchy(
                objective.parentId,
              )
            : null,
        };
      };


    const objectiveHierarchy =
      await getObjectiveHierarchy(
        mission.objectiveId,
      );


    return {
      id: mission.id,

      objective: objectiveHierarchy,

      responsable: mission.responsable,

      team: mission.team,

      priorite: mission.priorite,

      dependances: mission.dependances,

      livrables: mission.livrables,

      checklist: mission.checklist,

      dateLimite: mission.dateLimite,

      kpi: mission.kpi,

      status: mission.status,

      createdBy: mission.createdBy,
    };
  }
}

  


