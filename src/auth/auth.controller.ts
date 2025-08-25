import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/authCredential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  @ResponseMessage('User created successfully')
  async createUser(@Body() credentials: AuthCredentialDto) {
    return await this.authService.signUp(credentials);
  }

  @Get('/signIn')
  @ResponseMessage('User Retrieve Successfully')
  async getUser(
    @Query() credentials: AuthCredentialDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, userId } =
      await this.authService.signIn(credentials);
    // set access token
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });
    // set refreshToken
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return userId;
  }

  @Patch('/refresh')
  @ResponseMessage('Access token refreshed')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    // Decode refresh token to get userId

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return true;
  }

  @Patch('/logout')
  @ResponseMessage('User logout successfully')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return true;
  }
}
