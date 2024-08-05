import { Controller, Post, Body, Param, Req, UseGuards, Get, Query, ParseUUIDPipe, Put, UsePipes, Res, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserFilter } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { ADMIN_ROLES, ForgotPasswordDto, LoginDto } from 'src/base.entity';
import { PasswordMatch } from 'src/auth/password-match.pipe';
import { Response } from 'express';
import { SkipAuth } from 'src/auth/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  async createUser(@Body() body: CreateUserDto, @Req() req: any) {
    try {
      return this.usersService.createUser(body, req?.user);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  getAllUsers(@Query() query: UserFilter) {
    try {
      return this.usersService.getAllUsers(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.getUserById(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  updateUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ) {
    try {
      return this.usersService.updateUserById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @Post('forgot-password')
  @SkipAuth()
  @UsePipes(PasswordMatch)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      return this.usersService.forgotPassword(body);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @SkipAuth()
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      return this.usersService.loginUser(body, res);
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  @SkipAuth()
  async logout(@Res() res: Response) {
    try {
      return this.usersService.logoutUser(res);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  deleteUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.deleteUserById(id);
    } catch (error) {
      throw error;
    }
  }
}
