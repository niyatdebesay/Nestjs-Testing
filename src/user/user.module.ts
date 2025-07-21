import { Module } from '@nestjs/common';
import { UserService } from './usecase/user.service';
import { UserController } from './controller/user.controller';
import { User } from './persistence/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './persistence/user.repository';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
