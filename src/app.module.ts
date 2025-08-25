import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TransformInterceptorProvider } from './common/interceptors/transform.interceptor';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [],
  providers: [TransformInterceptorProvider],
})
export class AppModule {}
