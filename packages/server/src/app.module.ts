import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from './common';
import { UsersModule } from './users';

@Module({
  imports: [MongooseModule.forRoot(Config.mongoUri), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
