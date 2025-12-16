import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChannelEnum,
  CreateUserDto,
  DeviceTypeEnum,
  GenderEnum,
  IUser,
  UserFilter,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  ADMIN_ROLES,
  ForgotPasswordDto,
  IReqUser,
  LoginDto,
  RolesEnum,
} from 'src/base.entity';
import { LocationCounterService } from 'src/location-counter/location-counter.service';
import { UserTypeEnum } from 'src/location-counter/dto/create-location-counter.dto';
import { UtilService } from 'src/utils/utility-service';
import { Transactional } from 'typeorm-transactional';
import { AgentsService } from 'src/agents/agents.service';
import { buildUserFilter } from 'src/filters/query-filter';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import moment from 'moment';
import { TwilioService } from 'src/twilio/twilio.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly agentsService: AgentsService,
    private readonly locationCounterService: LocationCounterService,
    private configService: ConfigService,
    private readonly authService: AuthService,
    private readonly twilioService: TwilioService,
  ) {}

  @Transactional()
  async createUser(data: CreateUserDto, user: IReqUser): Promise<IUser> {
    const { email, city } = data;
    let assignedAgent: string;
    const emailExist = await this.usersRepository.exists({ where: { email } });
    if (emailExist) {
      throw new HttpException(
        `user with email: ${email} already exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (city.toLowerCase() !== user.city && user.role === ADMIN_ROLES.AGENT) {
      throw new ForbiddenException(
        `You do not have permission to create user outside your city. Your city is: ${user.city}`,
      );
    }

    if (user.role === ADMIN_ROLES.ADMIN) {
      const fetchAgent =
        await this.agentsService.getAgentWithLeastProspect(city);
      if (!fetchAgent.agent_id)
        throw new NotFoundException('no agent found in this city');
      assignedAgent = fetchAgent.agent_id;
    } else {
      assignedAgent = user.id;
    }

    const generatedAppleId = await this.locationCounterService.generateAppleID(
      data.city.toLowerCase(),
      UserTypeEnum.PROSPECT,
    );
    const newPassword = UtilService.generatePassword(
      data.last_name.toLowerCase(),
    );
    const hashedPassword = await UtilService.hashPassword(newPassword);

    const newUser: IUser = {
      ...data,
      gender: GenderEnum[data.gender.toUpperCase()],
      device_type: DeviceTypeEnum[data.device_type.toUpperCase()],
      role: RolesEnum.USER,
      stage: 1,
      channel: ChannelEnum[data.channel.toUpperCase()],
      apple_id: generatedAppleId,
      password: hashedPassword,
      agent_id: assignedAgent,
    };
    const createdUser = await this.usersRepository.save(newUser);
    try {
      await Promise.all([
        UtilService.sendPasswordMail(email, newPassword),
        this.twilioService.sendWhatsAppMedia(
          // tenant.phone_number,
          '+2348103367246',
          // uploadResult.secure_url,
          'https://res.cloudinary.com/dv1r9zj2i/image/upload/v1697731868/notice_2',
          `Dear ${createdUser.first_name}, please find your agreement notice attached.`,
        ),
      ]);
      console.log(
        `password sent successfully to ${createdUser.email} and WhatsApp`,
      );
    } catch (error) {
      console.error('Failed to send notice agreement:', error);
    }
    return createdUser;
  }

  @Transactional()
  async getAllUsers(queryParams: UserFilter) {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const skip = queryParams?.page ? (Number(queryParams.page) - 1) * size : 0;
    const query = await buildUserFilter(queryParams);
    const [users, count] = await this.usersRepository.findAndCount({
      where: query,
      skip,
      take: size,
      order: { created_at: 'DESC' },
    });

    const totalPages = Math.ceil(count / size);
    return {
      users,
      pagination: {
        totalRows: count,
        perPage: size,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user?.id) {
      throw new HttpException(
        `user with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  @Transactional()
  async updateUserById(id: string, data: UpdateUserDto) {
    return this.usersRepository.update(id, data);
  }

  @Transactional()
  async loginUser(data: LoginDto, res: Response) {
    const { email, password } = data;

    const user: Users = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user?.id) {
      throw new NotFoundException(`user with email: ${data.email} not found`);
    }

    const isPasswordValid = await UtilService.validatePassword(
      password,
      user?.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokenData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      role: user.role,
      apple_id: user.apple_id,
    };

    const access_token = await this.authService.generateToken(tokenData);

    // Set the token in a cookie
    res.cookie('access_token', access_token, {
      httpOnly: true, // Cookie is not accessible via JavaScript
      secure: this.configService.get<string>('NODE_ENV') === 'production', // Set to true in production for HTTPS
      expires: moment().add(1, 'hour').toDate(),
      sameSite: 'strict',
    });

    return res.status(HttpStatus.OK).json({
      user,
      access_token,
      expires_at: moment().add(1, 'hour').format(),
    });
  }

  @Transactional()
  async forgotPassword(data: ForgotPasswordDto, res: Response) {
    const user = await this.usersRepository.findOne({
      where: { email: data.email },
    });
    if (!user?.id) {
      throw new HttpException(
        `user with email: ${data.email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const hashedPassword = await UtilService.hashPassword(data.new_password);
    await this.usersRepository.update(
      { email: data.email },
      { password: hashedPassword },
    );
    return res.status(HttpStatus.OK).json({
      message: 'User password reset successful',
    });
  }

  async logoutUser(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    return res.status(HttpStatus.OK).json({
      message: 'Logout successful',
    });
  }

  async deleteUserById(id: string) {
    return this.usersRepository.delete(id);
  }

  @Transactional()
  async reassignOneUser(new_agent_id: string, user_id: string, res: Response) {
    const getNewAgent = await this.agentsService.getAgentById(new_agent_id);
    if (!getNewAgent.id) {
      throw new NotFoundException(`agent with id: ${new_agent_id} not found`);
    }

    const getUser = await this.usersRepository.findOne({
      where: { id: user_id },
    });
    if (!getUser.id) {
      throw new NotFoundException(`user with id: ${user_id} not found`);
    }

    if (getNewAgent.city.toLowerCase() !== getUser.city.toLowerCase()) {
      throw new BadRequestException(
        `Agent not in the same city as user. User city is: ${getUser.city}, while agent is in ${getNewAgent.city}`,
      );
    }

    await this.usersRepository.update(
      { id: user_id },
      { agent_id: new_agent_id },
    );
    return res.status(HttpStatus.OK).json({
      message: 'User Successful Reassigned',
    });
  }

  @Transactional()
  async reassignAllUsersOfAnAgent(
    new_agent_id: string,
    current_agent_id: string,
    res: Response,
  ) {
    const getNewAgent = await this.agentsService.getAgentById(new_agent_id);
    if (!getNewAgent.id) {
      throw new NotFoundException(
        `new agent assignee with id: ${new_agent_id} not found`,
      );
    }

    const getCurrentAgent =
      await this.agentsService.getAgentById(current_agent_id);
    if (!getCurrentAgent.id) {
      throw new NotFoundException(
        `current agent with id: ${current_agent_id} not found`,
      );
    }

    if (getNewAgent.city.toLowerCase() !== getCurrentAgent.city.toLowerCase()) {
      throw new BadRequestException(
        `Both agents are not in the same city. Current agent city is: ${getCurrentAgent.city}, while new agent assignee is in ${getNewAgent.city}`,
      );
    }

    await this.usersRepository.update(
      { agent_id: current_agent_id },
      { agent_id: new_agent_id },
    );
    return res.status(HttpStatus.OK).json({
      message: 'All Users Successful Reassigned',
    });
  }
}
