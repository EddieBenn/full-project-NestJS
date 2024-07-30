import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentFilter, CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agents')
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

  @Delete(':id')
  deleteAgentById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.agentsService.deleteAgentById(id);
    } catch (error) {
      throw error;
    }
  }
}
