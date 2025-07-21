import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../usecase/user.service';
import { CreateUserDto } from '../usecase/dto/create-user.dto';
import { UpdateUserDto } from '../usecase/dto/update-user.dto';
import { User } from '../persistence/user.entity';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { AddUserAgentInterceptor } from '../interceptor/user.interceptor';
import { UserIdMatchGuard } from '../guard/ownership.guard';

@Controller('user')

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(dto);
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  @UseInterceptors(AddUserAgentInterceptor)
  @UseGuards(UserIdMatchGuard)
  async findUserById(@Param('id') id: string): Promise<User> {
    return await  this.userService.findUserById(id);
  }

  @Patch(':id')
  @UseInterceptors(AddUserAgentInterceptor)
  @UseGuards(UserIdMatchGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User|null> {
    return await this.userService.updateUser(id, dto);
  }

  // @Patch(':id/profile-picture')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const unique = `${uuid()}${extname(file.originalname)}`;
  //         cb(null, unique);
  //       },
  //     }),
  //   }),
  // )
  // async uploadProfilePicture(
  //   @Param('id') id: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<User> {
  //   return this.userService.updateProfilePicture(id, `/uploads/${file.filename}`);
  // }
}
