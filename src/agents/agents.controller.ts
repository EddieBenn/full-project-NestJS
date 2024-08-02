import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Put, UseGuards, UsePipes } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentFilter, CreateAgentDto, ForgotPasswordDto, LoginDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { ADMIN_ROLES } from 'src/base.entity';
import { PasswordMatch } from 'src/auth/password-match.pipe';


@Controller('agents')
@UseGuards(AuthGuard, RoleGuard)
@Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  async createAgent(@Body() body: CreateAgentDto) {
    try {
      return this.agentsService.createAgent(body);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  getAllAgents(@Query() query: AgentFilter) {
    try {
      return this.agentsService.getAllAgents(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  getAgentById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.agentsService.getAgentById(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
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
  @UsePipes(PasswordMatch)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      return this.agentsService.forgotPassword(body);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      return this.agentsService.loginAgent(body);
    } catch (error) {
      throw error;
    }
  }


  @Delete(':id')
  deleteAgentById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.agentsService.deleteAgentById(id);
    } catch (error) {
      throw error;
    }
  }
}
