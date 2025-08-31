import { Test, TestingModule } from '@nestjs/testing';
import {
  AdminLogin,
  BlockedLogin,
  clearAllTables,
  errorBadRequest,
  expectCode,
  restoreTestCtxFromGlobal,
  TestCtx,
} from '../common';
import { replaceConfig } from '../../src/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app/app.module';
import request from 'supertest';
import { asType } from '../../src/common/utils/ts/asType';
import { LoginReq } from '../../src/auth/dto/LoginReq';
import { LoginResp } from '../../src/auth/dto/LoginResp';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  DB,
  DrizzleSchema,
} from '../../src/infrastructure/drizzle/drizzle.service';
import { eq } from 'drizzle-orm';
import { appUser } from '../../src/generated/drizzle/schema';
import { Role } from '../../src/common/model/role';

describe('story: create user (e2e)', () => {
  let nestApp: INestApplication<App>;
  let app: App;
  let db: DB;

  beforeAll(async () => {
    restoreTestCtxFromGlobal();
    replaceConfig(TestCtx.config);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    nestApp = moduleFixture.createNestApplication();
    nestApp.useGlobalPipes(new ValidationPipe({ transform: true }));

    await nestApp.init();
    app = nestApp.getHttpServer();

    db = drizzle({
      client: TestCtx.pgClient,
      schema: DrizzleSchema,
    });
  });

  afterEach(async () => {
    await nestApp.close();
    await clearAllTables();
  });

  it('should check exists user psw', async () => {
    const createReq = asType<LoginReq>({
      login: 'some',
      psw: 'test',
    });

    await request(app)
      .post('/v1/auth/login')
      .send(createReq)
      .expect((resp) => expectCode(resp, 200));

    await request(app)
      .post('/v1/auth/login')
      .send({ ...createReq, psw: 'bad_password' })
      .expect((resp) =>
        expectCode(
          resp,
          400,
          errorBadRequest('Invalid user login or password'),
        ),
      );
  });

  it('should create blocked user', async () => {
    const createReq = asType<LoginReq>({
      login: BlockedLogin,
      psw: 'test',
    });

    await request(app)
      .post('/v1/auth/login')
      .send(createReq)
      .expect((resp) => expectCode(resp, 200));

    const user = await db.query.appUser.findFirst({
      where: eq(appUser.login, createReq.login),
      with: {
        appUserRoles: true,
      },
    });
    expect(user).toBeDefined();
    expect(user?.appUserRoles.map((data) => data.roleValue)).toEqual(
      asType<Role[]>(['survivor', 'nikita']),
    );
  });

  it('should create admin', async () => {
    const createReq = asType<LoginReq>({
      login: AdminLogin,
      psw: 'test',
    });

    await request(app)
      .post('/v1/auth/login')
      .send(createReq)
      .expect((resp) => expectCode(resp, 200));

    const user = await db.query.appUser.findFirst({
      where: eq(appUser.login, createReq.login),
      with: {
        appUserRoles: true,
      },
    });
    expect(user).toBeDefined();
    expect(user?.appUserRoles.map((data) => data.roleValue)).toEqual(
      asType<Role[]>(['survivor', 'admin']),
    );
  });

  it('should create a new user with single role and return it by second call', async () => {
    const createReq = asType<LoginReq>({
      login: 'test',
      psw: 'test',
    });

    const resp = await request(app)
      .post('/v1/auth/login')
      .send(createReq)
      .expect((resp) => expectCode(resp, 200));
    const loginData = resp.body as LoginResp;
    expect(loginData).toBeDefined();
    expect(loginData.token).toBeDefined();

    // check user exists
    const user = await db.query.appUser.findFirst({
      where: eq(appUser.login, createReq.login),
      with: {
        appUserRoles: true,
      },
    });
    expect(user).toBeDefined();
    expect(user?.appUserRoles.map((data) => data.roleValue)).toEqual(
      asType<Role[]>(['survivor']),
    );

    // second call
    {
      const resp = await request(app)
        .post('/v1/auth/login')
        .send(createReq)
        .expect((resp) => expectCode(resp, 200));
      const loginData = resp.body as LoginResp;
      expect(loginData).toBeDefined();
      expect(loginData.token).toBeDefined();

      const users = await db.query.appUser.findMany();
      expect(users.length).toBe(1);
    }
  });
});
