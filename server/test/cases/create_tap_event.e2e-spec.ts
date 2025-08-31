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
import { TapReq } from '../../src/round/dto/TapReq';
import { eq } from 'drizzle-orm';
import { appRound, appUserTapEvent } from '../../src/generated/drizzle/schema';
import { jwtDecode } from '../../src/infrastructure/jsonwebtoken/JsonWebTokenUtil';
import { JwtAuthPayload } from '../../src/auth/types';
import { DateUtil } from '../../src/common/utils/DateUtil';
import { isAnyUpdate } from '../../src/infrastructure/db/isAnyUpdate';
import { OneMin } from '../../src/common/utils/date/const';
import { Util } from '../../src/common/utils/Util';
import { timestamp } from 'drizzle-orm/pg-core';
import { ColsRound } from '../../src/round/orm/ColsRound';

describe('story: create tap event (e2e)', () => {
  let nestApp: INestApplication<App>;
  let app: App;
  let db: DB;
  let round: Round;
  let simpleUserToken: string;
  let simpleUserId: string;

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

    // create round
    {
      const { token } = (
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

      round = (
        await request(app)
          .post('/v1/round')
          .auth(token, { type: 'bearer' })
          .send()
          .expect((resp) => expectCode(resp, 200))
      ).body as Round;
    }

    // login by simple client
    {
      const { token } = (
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
      simpleUserToken = token;
      expect(simpleUserToken).toBeDefined();

      const { userId } = jwtDecode(simpleUserToken) as JwtAuthPayload;
      simpleUserId = userId;
      expect(simpleUserId).toBeDefined();
    }
  });

  afterEach(async () => {
    await nestApp.close();
    await clearAllTables();
  });

  it('should create tap event', async () => {
    // no token
    await request(app)
      .post('/v1/round/tap')
      .send()
      .expect((resp) => expectCode(resp, 401));

    // round is not active yet
    {
      expect(DateUtil.dateFrom(round.startAt)!.getTime()).toBeGreaterThan(
        Date.now(),
      );
      await request(app)
        .post('/v1/round/tap')
        .auth(simpleUserToken, { type: 'bearer' })
        .send(asType<TapReq>({ roundId: round.id }))
        .expect((resp) => expectCode(resp, 200));

      // wait for db real insert
      await Util.timeout(200);

      const taps = await db.query.appUserTapEvent.findMany({
        where: eq(appUserTapEvent.userId, simpleUserId),
      });
      expect(taps.length).toBe(0);
    }

    // set round to be active
    {
      const updateTime = new Date(Date.now() - OneMin).toISOString();
      const updated = await db
        .update(appRound)
        .set({ startAt: updateTime, visibleAt: updateTime })
        .where(eq(appRound.id, round.id))
        .then(isAnyUpdate);
      expect(updated).toBe(true);

      const updatedRound = await db.query.appRound.findFirst({
        where: eq(appRound.id, round.id),
      });
      expect(
        DateUtil.dateFrom(updatedRound!.startAt)!.getTime(),
      ).toBeLessThanOrEqual(Date.now());

      await request(app)
        .post('/v1/round/tap')
        .auth(simpleUserToken, { type: 'bearer' })
        .send(asType<TapReq>({ roundId: round.id }))
        .expect((resp) => expectCode(resp, 200));

      // wait for db real insert
      await Util.timeout(200);

      const taps = await db.query.appUserTapEvent.findMany({
        where: eq(appUserTapEvent.userId, simpleUserId),
      });
      expect(taps.length).toBe(1);
    }

    // set round inactive
    {
      const updateTime = new Date().toISOString();
      const updated = await db
        .update(appRound)
        .set({ endAt: updateTime })
        .where(eq(appRound.id, round.id))
        .then(isAnyUpdate);
      expect(updated).toBe(true);

      const updatedRound = await db.query.appRound.findFirst({
        where: eq(appRound.id, round.id),
      });
      expect(
        DateUtil.dateFrom(updatedRound!.endAt)!.getTime(),
      ).toBeLessThanOrEqual(Date.now());

      await request(app)
        .post('/v1/round/tap')
        .auth(simpleUserToken, { type: 'bearer' })
        .send(asType<TapReq>({ roundId: round.id }))
        .expect((resp) => expectCode(resp, 200));

      // wait for db real insert
      await Util.timeout(200);

      const taps = await db.query.appUserTapEvent.findMany({
        where: eq(appUserTapEvent.userId, simpleUserId),
      });
      expect(taps.length).toBe(1);
    }
  });
});
