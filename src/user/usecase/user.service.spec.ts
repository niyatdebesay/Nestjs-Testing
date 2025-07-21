import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../persistence/user.repository';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockUserRespository = {
    createUser: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRespository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a user and hashes the password', async () => {

    //arange
    const dto = {
      email: 'niyat@gmail.com',
      username: 'testUser',
      firstName: 'Niyat',
      lastName: 'Debesay',
      password: '123456',
    };

    const hashed = await bcrypt.hash(dto.password, 10);
    const savedUser = {
      id: '1',
      ...dto,
      password: hashed,
    };

    mockUserRespository.createUser.mockResolvedValue(savedUser);

    //act
    const result = await service.createUser(dto);


    //assert
    expect(mockUserRespository.createUser).toHaveBeenCalledWith({
      ...dto,
      password: expect.any(String),
    });

    expect(result).toEqual(savedUser);
    expect(result.password).not.toEqual(dto.password);
  });

  it('finds all users', async () => {
    const users = [{ id: '1', username: 'testUser' }];
    mockUserRespository.findAll.mockResolvedValue(users);

    const result = await service.findAllUsers();

    expect(mockUserRespository.findAll).toHaveBeenCalled();
    expect(result).toEqual(users);
    
  });

  it('finds a user by ID', async () => {
    const user = { id: '1', username: 'testUser' };
    mockUserRespository.findById.mockResolvedValue(user);

    const result = await service.findUserById('1');

    expect(mockUserRespository.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(user);
    
  });

  it('throws if user is not found by ID', async () => {
    mockUserRespository.findById.mockResolvedValue(null);

    await expect(service.findUserById('99')).rejects.toThrow(NotFoundException);
    expect(mockUserRespository.findById).toHaveBeenCalledWith('99');
  });

  it('updates a user and hashes password if present', async () => {
    const dto = { password: 'newpassword', firstName: 'Updated' };
    const updatedUser = {
      id: '1',
      username: 'testUser',
      firstName: dto.firstName,
      password: await bcrypt.hash(dto.password, 10),
    };

    mockUserRespository.updateUser.mockResolvedValue(updatedUser);

    const result = await service.updateUser('1', dto);

    expect(mockUserRespository.updateUser).toHaveBeenCalledWith('1', {
      ...dto,
      password: expect.any(String),
    });

    expect(result).toEqual(updatedUser);
  });


});
