// usecase/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../persistence/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../persistence/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashed = await bcrypt.hash(dto.password, 10);
    return await this.userRepository.createUser({ ...dto, password: hashed });
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User|null> {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    return this.userRepository.updateUser(id, dto);
  }

//   async updateProfilePicture(id: string, filePath: string): Promise<User|null> {
//     return await this.userRepository.updateProfilePicture(id, filePath);
//   }
}
