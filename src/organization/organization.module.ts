import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { PrismaModule } from "../prisma/prisma.module";
import { OrgchartService } from './orgchart.service';
import { JobDescriptionService } from './jobDescription.service';
import { ObjectiveService } from './objective.service';
import { MissionService } from './mission.service';
import { KpiService } from './kpi.service';

@Module({
    imports: [PrismaModule],
    controllers: [OrganizationController],
    providers: [OrganizationService, OrgchartService, JobDescriptionService, ObjectiveService, MissionService, KpiService]
})
export class OrganizationModule {}
