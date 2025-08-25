import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/authCredential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  createUser(@Body() credentials: AuthCredentialDto): any {
    return this.authService.createUser(credentials);
  }
}
