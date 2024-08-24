import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, ParseUUIDPipe, Put, UsePipes, Res, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminFilter, CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SkipAuth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { ADMIN_ROLES, ForgotPasswordDto, LoginDto } from 'src/base.entity';
import { PasswordMatch } from 'src/auth/password-match.pipe';
import { Response } from 'express';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PaginationResponseDto } from './dto/paginate.dto';
import { PasswordOmitResponse } from 'src/auth/password-omit.interceptor';
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Create Admin' })
  @ApiBody({ type: CreateAdminDto })
  @ApiCreatedResponse({ type: CreateAdminDto })
  @Post()
  @SkipAuth()
  @UseInterceptors(PasswordOmitResponse)
  async createAdmin(@Body() body: CreateAdminDto) {
    try {
      return this.adminService.createAdmin(body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get All Admin' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'city', required: false, type: Number, description: 'City of admin' })
  @ApiQuery({ name: 'email', required: false, type: Number, description: 'Email of a admin' })
  @ApiQuery({ name: 'phone', required: false, type: Number, description: 'Phone number of a admin' })
  @ApiOkResponse({ type: PaginationResponseDto, description: 'Paginated list of admins' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
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

  @ApiOperation({ summary: 'Get One Admin' })
  @ApiOkResponse({ type: CreateAdminDto, description: 'Admin successfully fetched' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  @UseInterceptors(PasswordOmitResponse)
  getAdminById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.adminService.getAdminById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update Admin' })
  @ApiBody({ type: CreateAdminDto })
  @ApiOkResponse({ description: 'Admin successfully updated'})
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
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

  @ApiOperation({ summary: 'Reset Admin Password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ description: 'Admin password reset successful'})
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse()
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
  
  @ApiOperation({ summary: 'Admin Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, type: CreateAdminDto })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid password' })
  @Post('login')
  @SkipAuth()
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      return this.adminService.loginAdmin(body, res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Logout Admin', description: 'Admin successfully logged out' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @Post('logout')
  @SkipAuth()
  async logout(@Res() res: Response) {
    try {
      return this.adminService.logoutAdmin(res);
    } catch (error) {
      throw error;
    }
  }
  
  @ApiOperation({ summary: 'Delete Admin',  description: 'Admin successfully deleted' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
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
