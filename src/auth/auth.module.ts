import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { AuthRepositoryProvider } from './auth.repository';
import { AuthService } from './auth.service';
export const jwtConstants = {
  secret: 'something',
};
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...AuthRepositoryProvider],
})
export class AuthModule {}
