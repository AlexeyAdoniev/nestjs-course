import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuardGuard } from './guards/local-auth-guard/local-auth-guard.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuardGuard)
  @Post('login')
  login(@Request() req) {
    return req.user;
  }
  // login(@Body() loginDto: LoginDto) {
  //   return this.authService.validateLocal(loginDto.email, loginDto.password);
  // }
}
