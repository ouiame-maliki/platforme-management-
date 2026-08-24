import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { PrismaModule } from "../prisma/prisma.module";
import { OrgchartService } from './orgchart.service';
import { JobDescriptionService } from './jobDescription.service';

@Module({
    imports: [PrismaModule],
    controllers: [OrganizationController],
    providers: [OrganizationService, OrgchartService, JobDescriptionService],
})
export class OrganizationModule {}
