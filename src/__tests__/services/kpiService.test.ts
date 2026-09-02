import { BadRequestException, NotFoundException } from "@nestjs/common";
import { z } from "zod";
import { KpiService } from "../../organization/kpi.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("KpiService", () => {
  let service: KpiService;

  const prismaMock = {
  kpiDefinition: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },

  kpiValue: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

beforeEach(() => {
  jest.clearAllMocks();

  service = new KpiService(
    prismaMock as unknown as PrismaService,
  );
});
describe("createKpiDefinition", () => {
    it("should create a KPI definition", async () => {
      const body = {
        companyId: "company-1",
        name: "Chiffre affaires",
        unit: "montant",
        target: 100000,
        description: "Chiffre affaires annuel",
};

      prismaMock.kpiDefinition.create.mockResolvedValue({
        id: "kpi-1",
        ...body,
      });

      const result = await service.createKpiDefinition(body);

      expect(prismaMock.kpiDefinition.create).toHaveBeenCalledWith({
        data: body,
      });

      expect(result).toEqual({
        id: "kpi-1",
        ...body,
      });
    });

    it("should reject an invalid unit", async () => {
      const body = {
        companyId: "company-1",
        name: "Test KPI",
        unit: "invalid",
        target: 100,
      };

      await expect(
        service.createKpiDefinition(body),
      ).rejects.toBeInstanceOf(z.ZodError);
    });
  });
describe("getKpi", () => {
    it("should return KPIs for a company", async () => {
      const kpis = [
        {
          id: "kpi-1",
          companyId: "company-1",
          name: "Chiffre affaires",
          unit: "montant",
          target: 100000,
          description: "CA",
        },
      ];

      prismaMock.kpiDefinition.findMany.mockResolvedValue(kpis);

      const result = await service.getKpi("company-1");

      expect(
        prismaMock.kpiDefinition.findMany,
      ).toHaveBeenCalledWith({
        where: {
          companyId: "company-1",
        },
      });

      expect(result).toEqual(kpis);
    });
});
describe("createKpiValue", () => {
    it("should create a KPI value", async () => {
      prismaMock.kpiDefinition.findUnique.mockResolvedValue({
        id: "kpi-1",
        companyId: "company-1",
        name: "Chiffre affaires",
        unit: "montant",
        target: 100000,
        description: "CA",
      });

      prismaMock.kpiValue.create.mockResolvedValue({
        id: "value-1",
        kpiDefinitionId: "kpi-1",
        value: 50000,
        recordedAt: new Date("2026-08-29"),
        context: null,
      });

      const result = await service.createKpiValue(
        "kpi-1",
        {
          value: 50000,
        },
      );

      expect(
        prismaMock.kpiDefinition.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          id: "kpi-1",
        },
});

      expect(
        prismaMock.kpiValue.create,
      ).toHaveBeenCalled();

      expect(result).toEqual({
        id: "value-1",
        kpiDefinitionId: "kpi-1",
        value: 50000,
        recordedAt: new Date("2026-08-29"),
        context: null,
      });
    });
        it("should throw NotFoundException if KPI does not exist", async () => {
      prismaMock.kpiDefinition.findUnique.mockResolvedValue(null);

      await expect(
        service.createKpiValue("kpi-not-found", {
          value: 50000,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(
        prismaMock.kpiValue.create,
      ).not.toHaveBeenCalled();
    });
  });
describe("getKpiHistory", () => {
beforeEach(() => {
      prismaMock.kpiDefinition.findUnique.mockResolvedValue({
        id: "kpi-1",
        companyId: "company-1",
        name: "Chiffre affaires",
        unit: "montant",
        target: 100000,
        description: "CA",
      });
    });

    it("should aggregate KPI values by day", async () => {
      prismaMock.kpiValue.findMany.mockResolvedValue([
        {
          id: "value-1",
          kpiDefinitionId: "kpi-1",
          value: 10,
          recordedAt: new Date("2026-08-01T10:00:00.000Z"),
          context: null,
        },
        {
          id: "value-2",
          kpiDefinitionId: "kpi-1",
          value: 20,
          recordedAt: new Date("2026-08-01T15:00:00.000Z"),
          context: null,
        },
        {
          id: "value-3",
          kpiDefinitionId: "kpi-1",
          value: 30,
          recordedAt: new Date("2026-08-02T10:00:00.000Z"),
          context: null,
        },
      ]);

      const result = await service.getKpiHistory(
        "kpi-1",
        undefined,
        undefined,
        "jour",
      );

      expect(result.data).toEqual([
        {
          period: "2026-08-01",
          average: 15,
          min: 10,
          max: 20,
          nombreMesures: 2,
        },
        {
          period: "2026-08-02",
          average: 30,
          min: 30,
          max: 30,
          nombreMesures: 1,
        },
      ]);

      expect(result.pagination).toEqual({
        total: 2,
        limit: 50,
        offset: 0,
      });
    });
        it("should reject invalid granularity", async () => {
      await expect(
        service.getKpiHistory(
          "kpi-1",
          undefined,
          undefined,
          "annee",
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(
        prismaMock.kpiValue.findMany,
      ).not.toHaveBeenCalled();
    });
        it("should throw NotFoundException if KPI does not exist", async () => {
      prismaMock.kpiDefinition.findUnique.mockResolvedValue(null);

      await expect(
        service.getKpiHistory(
          "unknown",
          undefined,
          undefined,
          "jour",
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
        it("should paginate aggregated results", async () => {
      prismaMock.kpiValue.findMany.mockResolvedValue([
        {
          id: "value-1",
          kpiDefinitionId: "kpi-1",
          value: 10,
          recordedAt: new Date("2026-08-01T10:00:00.000Z"),
          context: null,
        },
        { 
          id: "value-2",
          kpiDefinitionId: "kpi-1",
          value: 20,
          recordedAt: new Date("2026-08-02T10:00:00.000Z"),
          context: null,
        },
      ]);

      const result = await service.getKpiHistory(
        "kpi-1",
        undefined,
        undefined,
        "jour",
        1,
        1,
      );

      expect(result.data).toHaveLength(1);

      expect(result.data[0]).toEqual({
        period: "2026-08-02",
        average: 20,
        min: 20,
        max: 20,
        nombreMesures: 1,
      });

      expect(result.pagination).toEqual({
        total: 2,
        limit: 1,
        offset: 1,
      });
    });
  });
    describe("getKpiStats", () => {
    beforeEach(() => {
      prismaMock.kpiDefinition.findUnique.mockResolvedValue({
        id: "kpi-1",
        companyId: "company-1",
        name: "Chiffre affaires",
        unit: "montant",
        target: 100000,
        description: "CA",
      });
    });

    it("should return hausse when current value is higher", async () => {
      const latestDate = new Date("2026-08-02T10:00:00.000Z");
      const previousDate = new Date("2026-08-01T10:00:00.000Z");

      prismaMock.kpiValue.findMany.mockResolvedValue([
        {
          id: "value-2",
          kpiDefinitionId: "kpi-1",
          value: 120000,
          recordedAt: latestDate,
          context: null,
        },
        {
          id: "value-1",
          kpiDefinitionId: "kpi-1",
          value: 100000,
          recordedAt: previousDate,
          context: null,
        },
      ]);

      prismaMock.kpiValue.count.mockResolvedValue(2);

      const result = await service.getKpiStats("kpi-1");

      expect(result.current).toBe(120000);
      expect(result.target).toBe(100000);
      expect(result.trend).toBe("hausse");
      expect(result.écart_pourcent).toBe(20);
      expect(result.nombre_mesures).toBe(2);
      expect(result.dernière_mise_à_jour).toEqual(latestDate);
    });
        it("should return baisse when current value is lower", async () => {
      prismaMock.kpiValue.findMany.mockResolvedValue([
        {
          id: "value-2",
          kpiDefinitionId: "kpi-1",
          value: 80000,
          recordedAt: new Date("2026-08-02T10:00:00.000Z"),
          context: null,
        },
        {
          id: "value-1",
          kpiDefinitionId: "kpi-1",
          value: 100000,
          recordedAt: new Date("2026-08-01T10:00:00.000Z"),
          context: null,
        },
      ]);

      prismaMock.kpiValue.count.mockResolvedValue(2);

      const result = await service.getKpiStats("kpi-1");

      expect(result.trend).toBe("baisse");
      expect(result.écart_pourcent).toBe(-20);
    });
        it("should return stable when current value equals previous value", async () => {
      prismaMock.kpiValue.findMany.mockResolvedValue([
        {
          id: "value-2",
          kpiDefinitionId: "kpi-1",
          value: 100000,
          recordedAt: new Date("2026-08-02T10:00:00.000Z"),
          context: null,
        },
        {
          id: "value-1",
          kpiDefinitionId: "kpi-1",
          value: 100000,
          recordedAt: new Date("2026-08-01T10:00:00.000Z"),
          context: null,
        },
      ]);

      prismaMock.kpiValue.count.mockResolvedValue(2);

      const result = await service.getKpiStats("kpi-1");

      expect(result.trend).toBe("stable");
      expect(result.écart_pourcent).toBe(0);
    });
        it("should return null current when there are no measurements", async () => {
      prismaMock.kpiValue.findMany.mockResolvedValue([]);
      prismaMock.kpiValue.count.mockResolvedValue(0);

      const result = await service.getKpiStats("kpi-1");

      expect(result).toEqual({
        current: null,
        target: 100000,
        trend: "stable",
        écart_pourcent: null,
        nombre_mesures: 0,
        dernière_mise_à_jour: null,
      });
    });
        it("should throw NotFoundException if KPI does not exist", async () => {
      prismaMock.kpiDefinition.findUnique.mockResolvedValue(null);

      await expect(
        service.getKpiStats("unknown"),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
