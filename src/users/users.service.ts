import { Injectable } from '@nestjs/common';
import { ChannelEnum, CreateUserDto, DeviceTypeEnum, GenderEnum, IUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RolesEnum } from 'src/base.entity';
import { LocationCounterService } from 'src/location-counter/location-counter.service';
import { UserTypeEnum } from 'src/location-counter/dto/create-location-counter.dto';
import { UtilService } from 'src/utils/utility-service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly locationCounterService: LocationCounterService,
  ) {}
  
  async createUser(data: CreateUserDto): Promise<IUser> {
    const generatedAppleId = await this.locationCounterService.generateAppleID(data.city, UserTypeEnum.PROSPECT)
    const newPassword = UtilService.generatePassword(data.last_name.toLowerCase());
    const hashedPassword = await UtilService.hashPassword(newPassword);

    const user: IUser = {
      ...data,
      gender: GenderEnum[data.gender.toUpperCase()],
      device_type: DeviceTypeEnum[data.device_type.toUpperCase()],
      role: RolesEnum.USER,
      stage: 1,
      channel: ChannelEnum[data.channel.toUpperCase()],
      apple_id: generatedAppleId,
      password: hashedPassword,
      agent_id: ""

    }
    return this.usersRepository.save(user);
  }



  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
