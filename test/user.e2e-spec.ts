import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, DataSource } from 'typeorm';
import { UserIdMatchGuard } from '../src/user/guard/ownership.guard';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;

  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      
    })
   .overrideGuard(UserIdMatchGuard)
.useValue({
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 'test-user-id' }; 
    return true;
  },
})
    .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();


    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await await dataSource.dropDatabase();
    await app.close();
  });

  it('POST /user - should create a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/user')
      .send({
        username: 'niyat8',
        firstName: 'Niyat',
        lastName: 'Debesay',
        email: 'niyat8@test.com',
        password: 'secure123',
      })
      .expect(201);

    createdUserId = res.body.id;
    console.log('Response from /user:', res.body);

    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('niyat8');
  });

  it('GET /user - should return all users', async () => {
    const res = await request(app.getHttpServer())
      .get('/user')
      .expect(200);
    console.log('Response from /user:', res.body);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /user/:id - should return the created user', async () => {
    const res = await request(app.getHttpServer())
      .get(`/user/${createdUserId}`)
      .set('Authorization', 'Bearer dummy-token') 
      .expect(200);

    expect(res.body.id).toBe(createdUserId);
    expect(res.body.username).toBe('niyat8');
  });

  it('PATCH /user/:id - should update the user', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/user/${createdUserId}`)
      .set('Authorization', 'Bearer dummy-token') 
      .send({
        firstName: 'UpdatedName',
      })
      .expect(200);

    expect(res.body.firstName).toBe('UpdatedName');
  });
});
