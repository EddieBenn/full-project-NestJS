import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AgentFilter, CreateAgentDto, IAgent } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agents } from './entities/agent.entity';
import { Repository } from 'typeorm';
import { LocationCounterService } from 'src/location-counter/location-counter.service';
import { UserTypeEnum } from 'src/location-counter/dto/create-location-counter.dto';
import { UtilService } from 'src/utils/utility-service';
import { GenderEnum } from 'src/users/dto/create-user.dto';
import { RolesEnum } from 'src/base.entity';
import { buildAgentFilter } from 'src/filters/query-filter';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agents)
    private readonly agentsRepository: Repository<Agents>,
    private readonly locationCounterService: LocationCounterService,
  ) {}
  
  async createAgent(data: CreateAgentDto): Promise<IAgent> {
    const generatedAppleId = await this.locationCounterService.generateAppleID(data.city, UserTypeEnum.AGENT)
    const hashedPassword = await UtilService.hashPassword(data.password);

    const agent: IAgent = {
      ...data,
      gender: GenderEnum[data.gender.toUpperCase()],
      role: RolesEnum.AGENT,
      apple_id: generatedAppleId,
      password: hashedPassword,

    }
    return this.agentsRepository.save(agent);
  }

  async getAllAgents(queryParams: AgentFilter) {
    const page = queryParams?.page ? Number(queryParams?.page) : 1 
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const skip = queryParams?.page ? (Number(queryParams.page) - 1) * size : 0;
    const query = await buildAgentFilter(queryParams);
    const [agents, count] =
      await this.agentsRepository.findAndCount({
        where: query,
        skip,
        take: size,
        order: { created_at: 'DESC' },
      });

    const totalPages = Math.ceil(count / size);
    return {
      agents,
      pagination: {
        totalRows: count,
        perPage: size,
        currentPage: page,
        totalPages: Math.ceil(count / size),
        hasNextPage: page < totalPages,
      },
    };
  }

  async getAgentById(id: string): Promise<IAgent>  {
    const agent = await this.agentsRepository.findOne({
      where: { id },
    });
    if (!agent?.id) {
      throw new HttpException(
        `agent with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return agent;
  }

  async updateAgentById(id: string, data: UpdateAgentDto) {
    return this.agentsRepository.update(id, data);
  }

  async deleteAgentById(id: string) {
    return this.agentsRepository.delete(id);
  }
}
