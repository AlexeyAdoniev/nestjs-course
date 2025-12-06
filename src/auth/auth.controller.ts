import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Get,
  Res,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { LocalAuthGuardGuard } from './guards/local-auth-guard/local-auth-guard.guard';
import { User } from './decorators/user.decorator';
import type { RequestUser } from './interfaces/request-user.interface';
import type { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { IdDto } from '../common/dto/id.dto';
import { RoleDto } from './roles/dto/role.dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from './roles/enums/role.enum';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description: 'JWT cookie',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuardGuard)
  @Public()
  @Post('login')
  login(
    @User() user: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = this.authService.login(user);
    response.cookie('token', token, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }

  // @UseGuards(JwtAuthGuardGuard)
  @Get('profile')
  getProfile(@User() { id }: RequestUser) {
    return this.authService.getProfile(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/assign-role')
  assignRole(@Param() { id }: IdDto, @Body() { role }: RoleDto) {
    return this.authService.assignRole(id, role);
  }
}
