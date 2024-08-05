import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilService } from 'src/utils/utility-service';
import { GenderEnum } from 'src/users/dto/create-user.dto';
import { ForgotPasswordDto, LoginDto, RolesEnum } from 'src/base.entity';
import { buildAdminFilter } from 'src/filters/query-filter';
import { Transactional } from 'typeorm-transactional';
import { AuthService } from 'src/auth/auth.service';
import moment from 'moment';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Admin } from './entities/admin.entity';
import { AdminFilter, CreateAdminDto, IAdmin } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Transactional()
  async createAdmin(data: CreateAdminDto): Promise<IAdmin> {
    const hashedPassword = await UtilService.hashPassword(data.password);

    const admin: IAdmin = {
      ...data,
      gender: GenderEnum[data.gender.toUpperCase()],
      role: RolesEnum.ADMIN,
      password: hashedPassword,
    };
    return this.adminRepository.save(admin);
  }

  @Transactional()
  async getAllAdmins(queryParams: AdminFilter) {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const skip = queryParams?.page ? (Number(queryParams.page) - 1) * size : 0;
    const query = await buildAdminFilter(queryParams);
    const [admins, count] = await this.adminRepository.findAndCount({
      where: query,
      skip,
      take: size,
      order: { created_at: 'DESC' },
    });

    const totalPages = Math.ceil(count / size);
    return {
      admins,
      pagination: {
        totalRows: count,
        perPage: size,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getAdminById(id: string): Promise<IAdmin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin?.id) {
      throw new HttpException(`admin with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return admin;
  }

  @Transactional()
  async updateAdminById(id: string, data: UpdateAdminDto) {
    return this.adminRepository.update(id, data);
  }

  @Transactional()
  async forgotPassword(data: ForgotPasswordDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: data.email },
    });
    if (!admin?.id) {
      throw new HttpException(`admin with email: ${data.email} not found`, HttpStatus.NOT_FOUND);
    }
    const hashedPassword = await UtilService.hashPassword(data.new_password);
    await this.adminRepository.update(
      { email: data.email },
      { password: hashedPassword },
    );
    return `Password reset successful`;
  }

  @Transactional()
  async loginAdmin(data: LoginDto, res: Response) {
    const { email, password } = data;

    const admin: Admin = await this.adminRepository.findOne({ where: { email }})
    if (!admin?.id) {
      throw new NotFoundException(`admin with email: ${data.email} not found`)
    }

    const isPasswordValid = await UtilService.validatePassword(password, admin?.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokenData = {
      id: admin.id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      phone: admin.phone,
      city: admin.city,
      role: admin.role,
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
      admin,
      access_token,
      expires_at: moment().add(1, 'hour').format()
    });
  }

  async logoutAdmin(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    return res.status(HttpStatus.OK).json({
      message: 'Logout successful',
    });
  }

  async deleteAdminById(id: string) {
    return this.adminRepository.delete(id);
  }
}





