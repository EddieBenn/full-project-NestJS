import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  AgentFilter,
  CreateAgentDto,
  IAgent,
} from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agents } from './entities/agent.entity';
import { Repository } from 'typeorm';
import { LocationCounterService } from 'src/location-counter/location-counter.service';
import { UserTypeEnum } from 'src/location-counter/dto/create-location-counter.dto';
import { UtilService } from 'src/utils/utility-service';
import { GenderEnum } from 'src/users/dto/create-user.dto';
import { ADMIN_ROLES, ForgotPasswordDto, IReqUser, LoginDto, RolesEnum } from 'src/base.entity';
import { buildAgentFilter } from 'src/filters/query-filter';
import { Transactional } from 'typeorm-transactional';
import { AuthService } from 'src/auth/auth.service';
import moment from 'moment';
import { Users } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agents)
    private readonly agentsRepository: Repository<Agents>,
    private readonly authService: AuthService,
    private readonly locationCounterService: LocationCounterService,
    private configService: ConfigService,
  ) {}

  @Transactional()
  async createAgent(data: CreateAgentDto, user: IReqUser): Promise<IAgent> {
    const generatedAppleId = await this.locationCounterService.generateAppleID(
      data.city.toLowerCase(),
      UserTypeEnum.AGENT,
    );
    const hashedPassword = await UtilService.hashPassword(data.password);
    const email = `${generatedAppleId.toLowerCase()}@apple.com`;

    const agent: IAgent = {
      ...data,
      email,
      gender: GenderEnum[data.gender.toUpperCase()],
      role: RolesEnum.AGENT,
      apple_id: generatedAppleId,
      password: hashedPassword,
      admin_id: user.role === ADMIN_ROLES.ADMIN ? user.id : null
    };
    return this.agentsRepository.save(agent);
  }

  @Transactional()
  async getAllAgents(queryParams: AgentFilter) {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const skip = queryParams?.page ? (Number(queryParams.page) - 1) * size : 0;
    const query = await buildAgentFilter(queryParams);
    const [agents, count] = await this.agentsRepository.findAndCount({
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
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getAgentById(id: string): Promise<IAgent> {
    const agent = await this.agentsRepository.findOne({ where: { id } });
    if (!agent?.id) {
      throw new HttpException(`agent with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return agent;
  }

  @Transactional()
  async updateAgentById(id: string, data: UpdateAgentDto) {
    return this.agentsRepository.update(id, data);
  }

  @Transactional()
  async forgotPassword(data: ForgotPasswordDto, res: Response) {
    const agent = await this.agentsRepository.findOne({
      where: { email: data.email },
    });
    if (!agent?.id) {
      throw new HttpException(`agent with email: ${data.email} not found`, HttpStatus.NOT_FOUND);
    }
    const hashedPassword = await UtilService.hashPassword(data.new_password);
    await this.agentsRepository.update(
      { email: data.email },
      { password: hashedPassword },
    );
    return res.status(HttpStatus.OK).json({
      message: 'Agent Password reset successful',
    });
  }

  @Transactional()
  async loginAgent(data: LoginDto, res: Response) {
    const { email, password } = data;

    const agent: Agents = await this.agentsRepository.findOne({ where: { email }})
    if (!agent?.id) {
      throw new NotFoundException(`agent with email: ${data.email} not found`)
    }

    const isPasswordValid = await UtilService.validatePassword(password, agent?.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokenData = {
      id: agent.id,
      first_name: agent.first_name,
      last_name: agent.last_name,
      email: agent.email,
      phone: agent.phone,
      city: agent.city,
      role: agent.role,
      apple_id: agent.apple_id,
    };

    const access_token = await this.authService.generateToken(tokenData)

     // Set the token in a cookie
     res.cookie('access_token', access_token, {
      httpOnly: true,  // Cookie is not accessible via JavaScript
      secure: this.configService.get<string>('NODE_ENV') === 'production', // Set to true in production for HTTPS
      expires: moment().add(1, 'hour').toDate(),
      sameSite: 'strict'
    });

    return res.status(HttpStatus.OK).json({
      agent,
      access_token,
      expires_at: moment().add(1, 'hour').format()
    });
  }

  async logoutAgent(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    return res.status(HttpStatus.OK).json({
      message: 'Logout successful',
    });
  }

  async deleteAgentById(id: string) {
    return this.agentsRepository.delete(id);
  }

  async getAgentWithLeastProspect(city: string) {
    const leastAssignedAgent = await this.agentsRepository
    .createQueryBuilder('ag')
    .select([
      `ag.id AS agent_id`,
      'COALESCE(CAST(COUNT(DISTINCT u.id) AS INTEGER), 0) AS prospect_count',
    ])
    .leftJoin(Users, 'u', 'u.agent_id = ag.id')
    .where('ag.city ILIKE :agentCity', { agentCity: `%${city}%` })
    .andWhere('u.city ILIKE :userCity',  { userCity: `%${city}%` })
    .groupBy('agent_id')
    .orderBy('prospect_count', 'ASC')
    .limit(1)
    .getOne();

    return leastAssignedAgent[0];
  }
}
