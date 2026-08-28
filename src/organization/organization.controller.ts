import { Body, Controller, Post, Get, Query, Param, Patch } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { DirectionSchema, DepartmentSchema, TeamSchema, EmployeeSchema } from "@virtual-ai-manager/shared-types";
import { OrgchartService } from './orgchart.service';
import { JobDescriptionService } from './jobDescription.service';
import { ObjectiveService } from './objective.service';
import { MissionService } from './mission.service';

@Controller()
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly orgchartService: OrgchartService,
    private readonly jobDescriptionService: JobDescriptionService,
    private readonly objectiveService: ObjectiveService,
    private readonly missionService: MissionService,
  ) {}

  @Post("directions")
  createDirection(
    @Body() body: unknown,
  ) {
    const data = DirectionSchema
      .omit({ id: true })
      .parse(body);

    return this.organizationService.createDirection(data);
  }
  @Post("departments")
    createDepartment(
      @Body() body: unknown,
    ) {
        const data = DepartmentSchema
            .omit({ id: true })
            .parse(body);

        return this.organizationService.createDepartment(data);
    }
    @Post("teams")
    createTeam(
      @Body() body: unknown,
    ) {
        const data = TeamSchema
            .omit({ id: true })
            .parse(body);

        return this.organizationService.createTeam(data);
    }
    @Post("employees")
    createEmployee(
      @Body() body: unknown,
    ) {
        const data = EmployeeSchema
            .omit({ id: true })
            .parse(body);

        return this.organizationService.createEmployee(data);
    }
    @Get("directions")
    findDirections(
        @Query() query: {
            companyId: string;
            limit?: string;
            offset?: string;
        },
    ) {
        return this.organizationService.findDirections(query); 
    }
    @Get("departments")
    findDepartments(
        @Query() query: {
            directionId: string;
            limit?: string;
            offset?: string;
        },
    ) {
        return this.organizationService.findDepartments(query);
    }
    @Get("teams")
    findTeams(
        @Query() query: {
            departmentId: string;
            limit?: string;
            offset?: string;
        },
    ) {
        return this.organizationService.findTeams(query);
    }
    @Get("employees")
    findEmployees(
        @Query() query: {
            teamId: string;
            limit?: string;
            offset?: string;
        },
    ) {
        return this.organizationService.findEmployees(query);
    }

    @Get('companies/:id/orgchart')
    getOrgchart(
        @Param('id') id: string) {
             return this.orgchartService.getOrgchart(id);
    }

    @Post('job-descriptions')
    createJobDescription(
        @Body() body: unknown,
    ) {
        return this.jobDescriptionService.createJobDescription(body);
    }

    @Get("job-descriptions/:employeeId")
    getJobDescription(
       @Param("employeeId") employeeId: string,
       @Query("companyId") companyId: string,
    ) {
        return this.jobDescriptionService.getJobDescription(
            employeeId,
            companyId
        );
    }

    @Patch("job-descriptions/:id")
    updateJobDescription(
      @Param("id") id: string,
      @Body() body: unknown,
    ) {
       return this.jobDescriptionService.updateJobDescription(id, body);
    }

    @Post("objectives")
    createObjective(
      @Body() body: unknown,
    ) {
        return this.objectiveService.createObjective(body);
    }

    @Get("objectives/tree/:strategicId")
    getObjectiveTree(
       @Param("strategicId") strategicId: string,
   ) {
      return this.objectiveService.getObjectiveTree(strategicId);
   }

    @Patch("objectives/:id/status")
    updateObjectiveStatus(
     @Param("id") id: string,
     @Body() body: unknown,
    ) {
    return this.objectiveService.updateObjectiveStatus(id, body);
    }

    @Get("objectives")
    getObjectives(
      @Query("companyId") companyId?: string,
      @Query("level") level?: string,
    ) {
        return this.objectiveService.getObjectives(companyId, level);
    }

    @Post("missions")
    createMission(
        @Body() body: unknown,
    ){
        return this.missionService.createMission(body);
    }

    @Get("missions")
    getMissions(
      @Query("teamId") teamId?: string,
      @Query("status") status?: string,
      @Query("priorite") priorite?: string,
      @Query("limit") limit?: string,
      @Query("offset") offset?: string,
    ) {
      return this.missionService.getMissions(
         teamId,
         status,
         priorite,
         limit ? Number(limit) : 50,
         offset ? Number(offset) : 0,
       );
    }

    @Patch("missions/:id/status")
    updateMissionStatus(
     @Param("id") id: string,
     @Body() body: unknown,
    ) {
       return this.missionService.updateMissionStatus(id, body);
    }

    @Get("missions/:id/details")
    getMissionDetails(
        @Param("id") id: string) {
            return this.missionService.getMissionDetails(id);
        }
}
    