import { CurrentUserDTO, UserDTO } from '@gaia-project/api';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { Config } from '../common';
import { User } from '../users';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './google.strategy';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async getCurrentUser(): Promise<CurrentUserDTO> {
    return { anonymous: true };
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async auth(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async callback(@Req() req: Request, @Res() res: Response): Promise<UserDTO> {
    const user: User = req.user as User;
    const token = await this.authService.signJWT(user.id);

    res.cookie(Config.cookieName, token);

    return user.toDTO();
  }
}
