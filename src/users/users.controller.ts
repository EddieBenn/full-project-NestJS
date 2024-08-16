import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Get,
  Query,
  ParseUUIDPipe,
  Put,
  UsePipes,
  Res,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  ReassignAllUsersDto,
  ReassignOneUserDto,
  UserFilter,
} from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { ADMIN_ROLES, ForgotPasswordDto, LoginDto } from 'src/base.entity';
import { PasswordMatch } from 'src/auth/password-match.pipe';
import { Response } from 'express';
import { SkipAuth } from 'src/auth/auth.decorator';
import { ApiBadRequestResponse, ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PaginationResponseDto } from './dto/paginate.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: CreateUserDto })
  @ApiResponse({  status: 422, description: 'User with email already exist' })
  @ApiForbiddenResponse({ description: 'Permission denied' })
  @ApiNotFoundResponse({ description: 'No agent found in this city' })
  @ApiSecurity('access_token')
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

  @ApiOperation({ summary: 'Get All Users' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'city', required: false, type: Number, description: 'City of users' })
  @ApiQuery({ name: 'email', required: false, type: Number, description: 'Email of a user' })
  @ApiQuery({ name: 'phone', required: false, type: Number, description: 'Phone number of a user' })
  @ApiOkResponse({ type: PaginationResponseDto, description: 'Paginated list of users' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get()
  getAllUsers(@Query() query: UserFilter) {
    try {
      return this.usersService.getAllUsers(query);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get One User' })
  @ApiOkResponse({ type: CreateUserDto, description: 'User successfully fetched' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get(':id')
  getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.getUserById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Reassign All Users Of An Agent' })
  @ApiBody({ type: ReassignAllUsersDto })
  @ApiNotFoundResponse({ description: 'Agent not found' })
  @ApiBadRequestResponse({  description: 'Both agents are not in the same city' })
  @ApiOkResponse({ description: 'All Users Successful Reassigned' })
  @ApiSecurity('access_token')
  @Put('reassign')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  async reassignAllUsersOfAnAgent(
    @Body() body: ReassignAllUsersDto,
    @Res() res: Response,
  ) {
    try {
      const { new_agent_id, current_agent_id } = body;
      return this.usersService.reassignAllUsersOfAnAgent(
        new_agent_id,
        current_agent_id,
        res,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Reassign One User' })
  @ApiBody({ type: ReassignOneUserDto })
  @ApiNotFoundResponse({ description: 'Agent not found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({  description: 'Agent not in the same city as user' })
  @ApiOkResponse({ description: 'User Successful Reassigned' })
  @ApiSecurity('access_token')
  @Put('reassign-user/:id')
  @UseGuards(RoleGuard)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.AGENT)
  reassignOneUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: ReassignOneUserDto,
    @Res() res: Response,
  ) {
    try {
      const { new_agent_id } = body;
      return this.usersService.reassignOneUser(new_agent_id, id, res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update User' })
  @ApiBody({ type: UpdateUserResponseDto })
  @ApiOkResponse({ description: 'User successfully updated'})
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
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

  @ApiOperation({ summary: 'Reset User Password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ description: 'User password reset successful'})
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse()
  @Post('forgot-password')
  @SkipAuth()
  @UsePipes(PasswordMatch)
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    try {
      return this.usersService.forgotPassword(body, res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid password' })
  @ApiCookieAuth('access_token')
  @SkipAuth()
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      return this.usersService.loginUser(body, res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Logout User', description: 'User successfully logged out' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @Post('logout')
  @SkipAuth()
  async logout(@Res() res: Response) {
    try {
      return this.usersService.logoutUser(res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete User',  description: 'User successfully deleted' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
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
