import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Param,
  NotFoundException,
  Query,
  Put,
} from '@nestjs/common';
import { FlowApp } from './flow-app.entity';
import { FlowAppService } from './flow-app.service';
import {
  ApiBearerAuth,
  ApiImplicitParam,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { FlowAppDto } from './flow-app.dto';
import { AppTechno } from '../app-techno/app-techno.entity';
import { Roles } from '../../decorators/roles.decorator';
import { ROLES } from '../user/role.constants';

@ApiUseTags('Apps')
@Controller()
@ApiBearerAuth()
export class FlowAppController {
  constructor(private readonly flowAppService: FlowAppService) {}

  @Get()
  @Roles(ROLES.ROLE_USER)
  @ApiResponse({
    status: 200,
    description: 'The list of all the apps.',
    type: FlowApp,
    isArray: true,
  })
  getAll(): Promise<FlowApp[]> {
    return this.flowAppService.getAll();
  }

  // Query
  @Get('search')
  @Roles(ROLES.ROLE_USER)
  @ApiResponse({
    status: 200,
    description: 'The app technology  with the matching id',
    type: AppTechno,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async search(@Query('query') query: string): Promise<FlowApp[]> {
    return this.flowAppService.find(query);
  }

  @Get(':id')
  @Roles(ROLES.ROLE_USER)
  @ApiResponse({
    status: 200,
    description: 'The app concerned.',
    type: FlowApp,
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<FlowApp> {
    return (await this.flowAppService.getOneById(id)).orElseThrow(
      () => new NotFoundException(),
    );
  }

  @Post()
  @Roles(ROLES.ROLE_EDIT_APPS)
  @ApiResponse({
    status: 201,
    description: 'The app created',
    type: FlowApp,
  })
  saveNewFlowApp(@Body() app: FlowAppDto): Promise<FlowApp> {
    return this.flowAppService.saveNewApp(app);
  }

  @Put(':id')
  @Roles(ROLES.ROLE_EDIT_APPS)
  @ApiResponse({
    status: 204,
    description: 'The app updated',
    type: FlowApp,
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  updateApp(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() app: FlowAppDto,
  ): Promise<FlowApp> {
    return this.flowAppService.update(id, app);
  }
}
