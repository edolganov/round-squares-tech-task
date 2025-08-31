import { getLog } from './log';
import { isEmpty } from './lang/isEmpty';
import { isString } from './str/isString';
import { isObject } from './lang/isObject';
import { isArray } from './lang/isArray';
import { toJson } from './str/toJson';
import { toJsonPretty } from './str/toJsonPretty';
import { uuid } from './uuid/uuid';
import { isBlank } from './lang/isBlank';
import { parseBool } from './lang/parseBool';
import { hashCode } from './str/hashCode';
import { parseInt } from './lang/parseInt';
import { parseFloat } from './lang/parseFloat';
import { timeout } from './promise/timeout';

/** common functions batch */
export const Util = {
  getLog,
  isEmpty,
  isString,
  isObject,
  isArray,
  toJson,
  toJsonPretty,
  uuid,
  isBlank,
  parseBool,
  hashCode,
  parseInt,
  parseFloat,
  timeout,
};
