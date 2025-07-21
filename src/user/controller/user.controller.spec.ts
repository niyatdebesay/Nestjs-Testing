import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../usecase/user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    updateUser: jest.fn(),
    updateProfilePicture: jest.fn(),
  };
  const mockUser = {
  id: '1',
  firstName: 'Niyat',
  lastName: 'Debesay',
  email: 'niyat@gmail.com',
  username: 'testUser1',
  createdAt: new Date(),
  updatedAt: new Date(),
  isVerified: false,
  isActive: true,
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates users successfully', async () => {
    const createUserDto = {
      username: 'testUser1',
      firstName: 'Niyat',
      lastName: 'Debesay',
      password: '1234567890',
      email: 'niyat@gmail.com',
    };

    const now = new Date('2025-07-21T00:21:07.307Z');
    const user = {
      id: '1',
      ...createUserDto,
      isActive: true,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    mockUserService.createUser.mockResolvedValue(user);

    const result = await controller.createUser(createUserDto);

    expect(result).toEqual(user);
    expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('finds all users', async () => {
    const users = [
      mockUser 
    ];

    mockUserService.findAllUsers.mockResolvedValue(users);

    const result = await controller.findAllUsers();

    expect(result).toEqual(users);
    expect(mockUserService.findAllUsers).toHaveBeenCalled();
  });

  it('finds one user by ID', async () => {
    const id = '1';
    const user =mockUser;

    mockUserService.findUserById.mockResolvedValue(user);

    const result = await controller.findUserById(id);

    expect(result).toEqual(user);
    expect(mockUserService.findUserById).toHaveBeenCalledWith(id);
  });

  it('updates a user by ID', async () => {
    const id = '1';
    const updateDto = {
      firstName: 'UpdatedName',
    };

    const updatedUser =mockUser 

    mockUserService.updateUser.mockResolvedValue(updatedUser);

    const result = await controller.updateUser(id, updateDto);

    expect(result).toEqual(updatedUser);
    expect(mockUserService.updateUser).toHaveBeenCalledWith(id, updateDto);
  });

  
});
