import { Body, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { z } from "zod";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from '@prisma/client';
import { KpiDefinitionSchema } from "@virtual-ai-manager/shared-types";
import { KpiValueSchema } from "@virtual-ai-manager/shared-types";

const CreateKpiDefinitionSchema = KpiDefinitionSchema.omit({ id: true});

const CreateKpiValueSchema = KpiValueSchema.omit({
  id: true,
  kpiDefinitionId: true,
}).extend({
  value: z.number(),
  recordedAt: z.coerce.date().optional(),
  context: z.json().optional(),
});

@Injectable()
export class KpiService {
   constructor(private readonly prisma: PrismaService) {}

   async createKpiDefinition(body: unknown) {
    const data = CreateKpiDefinitionSchema.parse(body);
    return this.prisma.kpiDefinition.create({
        data,
    })

   }

   async getKpi(companyId: string) {
    return this.prisma.kpiDefinition.findMany({
        where: {
            companyId: companyId,
        }
    })
    }

   async createKpiValue(kpiDefinitionId: string, body: unknown) {
      const data = CreateKpiValueSchema.parse(body);

      const kpi = await this.prisma.kpiDefinition.findUnique({
       where: {
         id: kpiDefinitionId,
       },
      });

      if (!kpi) {
        throw new NotFoundException("KPI definition not found");
      }

      return this.prisma.kpiValue.create({
       data: {
         kpiDefinitionId,
         value: data.value,
         recordedAt: data.recordedAt,
          ...(data.context !== undefined && {
            context: data.context as Prisma.InputJsonValue,
         }),
       },
      });
   }
    
   async getKpiHistory(
  id: string,
  startDate?: string,
  endDate?: string,
  granularity: string = "jour",
  limit = 50,
  offset = 0,
) {
  const kpi = await this.prisma.kpiDefinition.findUnique({
    where: {
      id,
    },
  });

  if (!kpi) {
    throw new NotFoundException("KPI definition not found");
  }

  if (!["jour", "semaine", "mois"].includes(granularity)) {
    throw new BadRequestException(
      "Granularity must be jour, semaine or mois",
    );
  }

  const where: Prisma.KpiValueWhereInput = {
    kpiDefinitionId: id,

    ...(startDate || endDate
      ? {
          recordedAt: {
            ...(startDate && {
              gte: new Date(startDate),
            }),

            ...(endDate && {
              lte: new Date(endDate),
            }),
          },
        }
      : {}),
  };

  const values = await this.prisma.kpiValue.findMany({
    where,

    orderBy: {
      recordedAt: "asc",
    },
  });

  const groups = new Map<string, number[]>();

  for (const item of values) {
    const date = item.recordedAt;

    let key: string;

    if (granularity === "jour") {
      key = date.toISOString().slice(0, 10);
    } else if (granularity === "semaine") {
      const monday = new Date(date);

      const day = monday.getDay();

      const difference = day === 0 ? -6 : 1 - day;

      monday.setDate(
        monday.getDate() + difference,
      );

      key = monday.toISOString().slice(0, 10);
    } else {
      key = date.toISOString().slice(0, 7);
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key)!.push(item.value);
  }

  const aggregatedData = Array.from(
    groups.entries(),
  ).map(([period, numbers]) => {
    const average =
      numbers.reduce(
        (sum, value) => sum + value,
        0,
      ) / numbers.length;

    const min = Math.min(...numbers);

    const max = Math.max(...numbers);

    return {
      period,
      average,
      min,
      max,
      nombreMesures: numbers.length,
    };
  });

  const total = aggregatedData.length;

  const paginatedData = aggregatedData.slice(
    offset,
    offset + limit,
  );

  return {
    kpi: {
      id: kpi.id,
      name: kpi.name,
      unit: kpi.unit,
      target: kpi.target,
      description: kpi.description,
    },

    granularity,

    data: paginatedData,

    pagination: {
      total,
      limit,
      offset,
    },
  };
}
   async getKpiStats(id: string) {
  const kpi = await this.prisma.kpiDefinition.findUnique({
    where: {
      id,
    },
  });

  if (!kpi) {
    throw new NotFoundException("KPI definition not found");
  }

  const values = await this.prisma.kpiValue.findMany({
    where: {
      kpiDefinitionId: id,
    },
    orderBy: {
      recordedAt: "desc",
    },
    take: 2,
  });

  const nombreMesures = await this.prisma.kpiValue.count({
    where: {
      kpiDefinitionId: id,
    },
  });

  if (values.length === 0) {
    return {
      current: null,
      target: kpi.target,
      trend: "stable",
      écart_pourcent: null,
      nombre_mesures: 0,
      dernière_mise_à_jour: null,
    };
  }

  const current = values[0].value;

  let trend: "hausse" | "baisse" | "stable" = "stable";

  if (values.length >= 2) {
    const previous = values[1].value;

    if (current > previous) {
      trend = "hausse";
    } else if (current < previous) {
      trend = "baisse";
    }
  }

  const écart_pourcent =
    kpi.target !== 0
      ? ((current - kpi.target) / kpi.target) * 100
      : null;

  return {
    current,
    target: kpi.target,
    trend,
    écart_pourcent,
    nombre_mesures: nombreMesures,
    dernière_mise_à_jour: values[0].recordedAt,
  };
}
};



