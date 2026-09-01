/*
  Warnings:

  - A unique constraint covering the columns `[companyId,name]` on the table `KpiDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "KpiDefinition_companyId_name_key" ON "KpiDefinition"("companyId", "name");
