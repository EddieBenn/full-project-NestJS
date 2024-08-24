import { Controller, Get, Post, Body, Param, Delete, Query, ParseUUIDPipe, Put, UseGuards, UsePipes, Res, Req, UseInterceptors } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentFilter, CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto, UpdateAgentResponseDto } from './dto/update-agent.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { ADMIN_ROLES, ForgotPasswordDto, LoginDto } from 'src/base.entity';
import { PasswordMatch } from 'src/auth/password-match.pipe';
import { Response } from 'express';
import { SkipAuth } from 'src/auth/auth.decorator';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PaginationResponseDto } from './dto/paginate.dto';
import { PasswordOmitResponse } from 'src/auth/password-omit.interceptor';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}


  @ApiOperation({ summary: 'Create Agent' })
  @ApiBody({ type: CreateAgentDto })
  @ApiCreatedResponse({ type: CreateAgentDto })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Post()
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  @UseInterceptors(PasswordOmitResponse)
  async createAgent(@Body() body: CreateAgentDto, @Req() req: any) {
    try {
      return this.agentsService.createAgent(body, req?.user);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get All Agents' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'city', required: false, type: Number, description: 'City of agents' })
  @ApiQuery({ name: 'email', required: false, type: Number, description: 'Email of a agent' })
  @ApiQuery({ name: 'phone', required: false, type: Number, description: 'Phone number of a agent' })
  @ApiOkResponse({ type: PaginationResponseDto, description: 'Paginated list of users' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get()
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  getAllAgents(@Query() query: AgentFilter) {
    try {
      return this.agentsService.getAllAgents(query);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get One Agent' })
  @ApiOkResponse({ type: CreateAgentDto, description: 'Agent successfully fetched' })
  @ApiNotFoundResponse({ description: 'Agent not found' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  @UseInterceptors(PasswordOmitResponse)
  getAgentById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.agentsService.getAgentById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update Agent' })
  @ApiBody({ type: UpdateAgentResponseDto })
  @ApiOkResponse({ description: 'Agent successfully updated'})
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  updateAgentById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAgentDto,
  ) {
    try {
      return this.agentsService.updateAgentById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Reset Agent Password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ description: 'Agent password reset successful'})
  @ApiNotFoundResponse({ description: 'Agent not found' })
  @ApiBadRequestResponse()
  @Post('forgot-password')
  @SkipAuth()
  @UsePipes(PasswordMatch)
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    try {
      return this.agentsService.forgotPassword(body, res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Agent Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, type: CreateAgentDto })
  @ApiNotFoundResponse({ description: 'Agent not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid password' })
  @Post('login')
  @SkipAuth()
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      return this.agentsService.loginAgent(body, res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Logout Agent', description: 'Agent successfully logged out' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @Post('logout')
  @SkipAuth()
  async logout(@Res() res: Response) {
    try {
      return this.agentsService.logoutAgent(res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Agent',  description: 'Agent successfully deleted' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  deleteAgentById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.agentsService.deleteAgentById(id);
    } catch (error) {
      throw error;
    }
  }
}
