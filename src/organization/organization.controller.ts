import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { DirectionSchema, DepartmentSchema, TeamSchema, EmployeeSchema } from "@virtual-ai-manager/shared-types";

@Controller()
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
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
}
