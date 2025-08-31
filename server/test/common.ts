import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { Config } from '../src/config';
import { Response } from 'supertest';

export const AdminLogin = 'admin';
export const BlockedLogin = 'Никита';
export const SomeLogin = 'some user';
export const SomeLogin2 = 'some user 2';

export let TestCtx = {} as {
  config: typeof Config;
  container: StartedPostgreSqlContainer;
  pgClient: Client;
};

export function saveTestCtxGlobal() {
  (global as any).__TestCtx = TestCtx;
}

export function restoreTestCtxFromGlobal() {
  TestCtx = (global as any).__TestCtx;
}

export async function clearAllTables() {
  await clearTable_app_user();
  await clearTable_app_round();
}

export async function clearTable_app_user() {
  await TestCtx.pgClient.query('Delete from app_user_role');
  await TestCtx.pgClient.query('Delete from app_user_tap_event');
  await TestCtx.pgClient.query('Delete from app_user');
}

export async function clearTable_app_round() {
  await TestCtx.pgClient.query('Delete from app_round');
}

export function expectCode(
  res: Response,
  expectedCode: number,
  expectedText?: string,
) {
  const result = res.statusCode + ' ' + (expectedText || res.text);
  const expected = expectedCode + ' ' + res.text;
  expect(result).toEqual(expected);
}

export function errorBadRequest(message: string) {
  return `{"message":"${message}","error":"Bad Request","statusCode":400}`;
}
