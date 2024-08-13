import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, ParseUUIDPipe, Put, UsePipes, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminFilter, CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SkipAuth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { ADMIN_ROLES, ForgotPasswordDto, LoginDto } from 'src/base.entity';
import { PasswordMatch } from 'src/auth/password-match.pipe';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @SkipAuth()
  async createAdmin(@Body() body: CreateAdminDto) {
    try {
      return this.adminService.createAdmin(body);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  getAllAdmins(@Query() query: AdminFilter) {
    try {
      return this.adminService.getAllAdmins(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  getAdminById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.adminService.getAdminById(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  updateAdminById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAdminDto,
  ) {
    try {
      return this.adminService.updateAdminById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @Post('forgot-password')
  @SkipAuth()
  @UsePipes(PasswordMatch)
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    try {
      return this.adminService.forgotPassword(body, res);
    } catch (error) {
      throw error;
    }
  }
  
  @Post('login')
  @SkipAuth()
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      return this.adminService.loginAdmin(body, res);
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  @SkipAuth()
  async logout(@Res() res: Response) {
    try {
      return this.adminService.logoutAdmin(res);
    } catch (error) {
      throw error;
    }
  }
  
  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  deleteAdminById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.adminService.deleteAdminById(id);
    } catch (error) {
      throw error;
    }
  }
}
