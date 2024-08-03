import { Controller, Get, Post, Body, Param, Delete, Query, ParseUUIDPipe, Put, UseGuards, UsePipes, Res } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentFilter, CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { ADMIN_ROLES, ForgotPasswordDto, LoginDto } from 'src/base.entity';
import { PasswordMatch } from 'src/auth/password-match.pipe';
import { Response } from 'express';
import { SkipAuth } from 'src/auth/auth.decorator';


@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @SkipAuth()
  async createAgent(@Body() body: CreateAgentDto) {
    try {
      return this.agentsService.createAgent(body);
    } catch (error) {
      throw error;
    }
  }

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

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  getAgentById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.agentsService.getAgentById(id);
    } catch (error) {
      throw error;
    }
  }

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

  @Post('forgot-password')
  @SkipAuth()
  @UsePipes(PasswordMatch)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      return this.agentsService.forgotPassword(body);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @SkipAuth()
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      return this.agentsService.loginAgent(body, res);
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  @SkipAuth()
  async logout(@Res() res: Response) {
    try {
      return this.agentsService.logoutAgent(res);
    } catch (error) {
      throw error;
    }
  }


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
