import { AuthApi, type LoginResp } from '@/generated/api';
import { makeApiConfig } from '@/infrastructure/openapi/makeApiConfig.ts';
import { Util } from '@/common/utils/Util.ts';
import { jwtDecode } from 'jwt-decode';
import { OneMin } from '@/common/utils/date/const.ts';

const log = Util.getLog('api/auth');

// state
let tokenVal: string | undefined =
  localStorage.getItem('guss-auth') || undefined;
let roles: string[] = [];
let tokenExpTime: number | undefined;

export const RestAuth = new AuthApi(makeApiConfig());

export interface AuthListener {
  onAuthUpdated: () => void;
}

let listeners: AuthListener[] = [];

export function addAuthListener(listener: AuthListener) {
  listeners.push(listener);
}

export function removeAuthListener(listener: AuthListener) {
  listeners = listeners.filter((candidate) => candidate !== listener);
}

function fireAuthUpdatedEvent() {
  listeners.forEach((listener) => listener.onAuthUpdated());
}

export function setAuth({ token }: LoginResp, lastLogin?: string) {
  try {
    const decodedData = jwtDecode(token) as
      | { roles: string[]; exp: number }
      | undefined;
    if (!decodedData) {
      throw new Error('invalid auth token');
    }

    tokenVal = token;
    tokenExpTime = decodedData.exp * 1000;
    roles = decodedData.roles || [];

    if (Date.now() + OneMin >= tokenExpTime) {
      throw new Error('token outdated');
    }

    localStorage.setItem('guss-auth', token);
    if (lastLogin) {
      localStorage.setItem('guss-last-login', lastLogin);
    }

    fireAuthUpdatedEvent();
  } catch (e) {
    log.error('cannot init auth token', e);
    clearAuth();
  }
}

export function clearAuth() {
  tokenVal = undefined;
  roles = [];
  tokenExpTime = undefined;
  localStorage.removeItem('guss-auth');
  localStorage.removeItem('guss-last-login');
  fireAuthUpdatedEvent();
}

export function hasAuth() {
  return !!tokenVal && !!tokenExpTime && Date.now() + OneMin < tokenExpTime;
}

export function getLastLogin() {
  return localStorage.getItem('guss-last-login') || undefined;
}

export function getAuthToken(): string | undefined {
  if (!tokenVal || !tokenExpTime) {
    return undefined;
  }

  // cur auth token is fine
  const nearFeature = Date.now() + 5000;
  if (nearFeature < tokenExpTime) {
    return tokenVal;
  }

  // token outdated
  setTimeout(() => {
    clearAuth();
  }, 0);
  return undefined;
}

export function isAdminRole() {
  return roles.includes('admin');
}

// init
if (tokenVal) {
  setAuth({ token: tokenVal });
}
