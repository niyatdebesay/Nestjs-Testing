// infrastructure/user.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../usecase/dto/create-user.dto';
import { UpdateUserDto } from '../usecase/dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
  return user;
  }

  async updateUser(id: string, update: UpdateUserDto): Promise<User|null> {
    await this.repo.update(id, update);
    return await this.findById(id);
  }

//   async updateProfilePicture(id: string, profilePictureUrl: string): Promise<User|null> {
//     await this.repo.update(id, { profilePictureUrl });
//     return await this.findById(id);
//   }
}
