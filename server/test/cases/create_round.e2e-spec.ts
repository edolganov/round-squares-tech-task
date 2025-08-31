import { Test, TestingModule } from '@nestjs/testing';
import {
  AdminLogin,
  clearAllTables,
  expectCode,
  restoreTestCtxFromGlobal,
  SomeLogin,
  TestCtx,
} from '../common';
import { replaceConfig } from '../../src/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app/app.module';
import request from 'supertest';
import { asType } from '../../src/common/utils/ts/asType';
import { LoginReq } from '../../src/auth/dto/LoginReq';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  DB,
  DrizzleSchema,
} from '../../src/infrastructure/drizzle/drizzle.service';
import { LoginResp } from '../../src/auth/dto/LoginResp';
import { Round } from '../../src/round/dto/Round';

describe('story: create round (e2e)', () => {
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

  it('should create round with admin only', async () => {
    const { token: badToken } = (
      await request(app)
        .post('/v1/auth/login')
        .send(
          asType<LoginReq>({
            login: SomeLogin,
            psw: 'test',
          }),
        )
        .expect((resp) => expectCode(resp, 200))
    ).body as LoginResp;

    const { token: goodToken } = (
      await request(app)
        .post('/v1/auth/login')
        .send(
          asType<LoginReq>({
            login: AdminLogin,
            psw: 'test',
          }),
        )
        .expect((resp) => expectCode(resp, 200))
    ).body as LoginResp;

    // no token
    await request(app)
      .post('/v1/round')
      .send()
      .expect((resp) => expectCode(resp, 401));

    // bad token
    await request(app)
      .post('/v1/round')
      .auth(badToken, { type: 'bearer' })
      .send()
      .expect((resp) => expectCode(resp, 403));

    const resp = await request(app)
      .post('/v1/round')
      .auth(goodToken, { type: 'bearer' })
      .send()
      .expect((resp) => expectCode(resp, 200));

    const round = resp.body as Round;
    expect(round).toBeDefined();

    // get
    {
      const list = (
        await request(app)
          .get('/v1/round/top')
          .send()
          .expect((resp) => expectCode(resp, 200))
      ).body as Round[];
      expect(list).toBeDefined();
      expect(list.length).toBe(1);
      expect(list[0]).toEqual(round);
    }
  });
});
