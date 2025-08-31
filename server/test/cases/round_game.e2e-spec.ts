import { Test, TestingModule } from '@nestjs/testing';
import {
  AdminLogin,
  BlockedLogin,
  clearAllTables,
  expectCode,
  restoreTestCtxFromGlobal,
  SomeLogin,
  SomeLogin2,
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
import { appRound } from '../../src/generated/drizzle/schema';
import { jwtDecode } from '../../src/infrastructure/jsonwebtoken/JsonWebTokenUtil';
import { JwtAuthPayload } from '../../src/auth/types';
import { OneSec } from '../../src/common/utils/date/const';
import { Util } from '../../src/common/utils/Util';
import { GetRoundInfoResp } from '../../src/round/dto/GetRoundInfoResp';

describe('story: round game (e2e)', () => {
  let nestApp: INestApplication<App>;
  let app: App;
  let db: DB;
  let round: Round;
  let userToken1: string;
  let userId1: string;
  let userToken2: string;
  let userId2: string;
  let blockedUserToken: string;
  let blockedUserId: string;

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

    // user 1
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
      userToken1 = token;
      userId1 = (jwtDecode(token) as JwtAuthPayload).userId;
    }

    // user 2
    {
      const { token } = (
        await request(app)
          .post('/v1/auth/login')
          .send(
            asType<LoginReq>({
              login: SomeLogin2,
              psw: 'test',
            }),
          )
          .expect((resp) => expectCode(resp, 200))
      ).body as LoginResp;
      userToken2 = token;
      userId2 = (jwtDecode(token) as JwtAuthPayload).userId;
    }

    // blocked user
    {
      const { token } = (
        await request(app)
          .post('/v1/auth/login')
          .send(
            asType<LoginReq>({
              login: BlockedLogin,
              psw: 'test',
            }),
          )
          .expect((resp) => expectCode(resp, 200))
      ).body as LoginResp;
      blockedUserToken = token;
      blockedUserId = (jwtDecode(token) as JwtAuthPayload).userId;
    }
  });

  afterEach(async () => {
    await nestApp.close();
    await clearAllTables();
  });

  it('should collect tap on active round', async () => {
    // active round
    const activeTime = new Date(Date.now() - OneSec).toISOString();
    await db
      .update(appRound)
      .set({ startAt: activeTime, visibleAt: activeTime })
      .where(eq(appRound.id, round.id));

    // before action
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(userToken1, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(0);
    }

    const calls: Promise<any>[] = [];
    let score1 = 0;
    let score2 = 0;
    let scoreBlocked = 0;
    for (let i = 0; i < 20; i++) {
      let token: string;
      if (i % 2) {
        token = userToken1;
        score1++;
      } else if (i % 3) {
        token = userToken2;
        score2++;
      } else {
        token = blockedUserToken;
        scoreBlocked++;
      }
      calls.push(
        request(app)
          .post('/v1/round/tap')
          .auth(token, { type: 'bearer' })
          .send(asType<TapReq>({ roundId: round.id }))
          .expect((resp) => expectCode(resp, 200)),
      );
    }

    await Promise.all(calls);

    // wait for db real insert
    await Util.timeout(200);

    // in-game state 1
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(userToken1, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(score1);
    }
    // in-game state 2
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(userToken2, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(score2);
    }
    // in-game state for blocked
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(blockedUserToken, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(0);
    }

    // game over
    await db
      .update(appRound)
      .set({ endAt: new Date().toISOString() })
      .where(eq(appRound.id, round.id));

    // one more taps for every one
    {
      await request(app)
        .post('/v1/round/tap')
        .auth(userToken1, { type: 'bearer' })
        .send(asType<TapReq>({ roundId: round.id }))
        .expect((resp) => expectCode(resp, 200));
      await request(app)
        .post('/v1/round/tap')
        .auth(userToken2, { type: 'bearer' })
        .send(asType<TapReq>({ roundId: round.id }))
        .expect((resp) => expectCode(resp, 200));
      await request(app)
        .post('/v1/round/tap')
        .auth(blockedUserToken, { type: 'bearer' })
        .send(asType<TapReq>({ roundId: round.id }))
        .expect((resp) => expectCode(resp, 200));
    }

    // state after game over without winner
    // in-game state 1
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(userToken1, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(score1);
      expect(info?.winner).not.toBeDefined();
    }
    // in-game state 2
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(userToken2, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(score2);
    }
    // in-game state for blocked
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(blockedUserToken, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(0);
    }

    // wait winner stat
    await Util.timeout(200);

    // state with winner
    // in-game state 1
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(userToken1, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(score1);
      expect(info?.winner).toBeDefined();
      expect(info?.winner).toBe(SomeLogin);
      expect(info?.winnerScore).toBe(score1);
    }
    // in-game state 2
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(userToken2, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(score2);
      expect(info?.winner).toBeDefined();
      expect(info?.winner).toBe(SomeLogin);
      expect(info?.winnerScore).toBe(score1);
    }
    // in-game state for blocked
    {
      const result = await request(app)
        .get(`/v1/round/info?roundId=${round.id}`)
        .auth(blockedUserToken, { type: 'bearer' })
        .send()
        .expect((resp) => expectCode(resp, 200));
      const { info } = result.body as GetRoundInfoResp;
      expect(info).toBeDefined();
      expect(info?.userScore).toBe(0);
      expect(info?.winner).toBeDefined();
      expect(info?.winner).toBe(SomeLogin);
      expect(info?.winnerScore).toBe(score1);
    }
  });
});
