import { StringUtil } from './StringUtil';

const allPaths = new Set<string>();

export interface Namespace {
  root(): string;
  makePath(suffix: string): string;
  // short makePath methods:
  thunk: SubNamespace;
  direct: SubNamespace;
  support: SubNamespace;
  event: SubNamespace;
}

export interface SubNamespace {
  makePath(suffix: string): string;
}

export function makeNamespace(pathRoot: string): Namespace {
  const normPathRoot = StringUtil.removeEnd(pathRoot, '/');

  if (allPaths.has(normPathRoot)) {
    throw new Error(`duplicate namespace "${normPathRoot}"`);
  }

  allPaths.add(normPathRoot);

  return {
    root() {
      return normPathRoot;
    },

    makePath(suffix: string): string {
      return makePath(normPathRoot, suffix);
    },

    /** reducer call from any place */
    direct: makeSubNamespace(`${normPathRoot}.direct`),

    /** reducer call from any thunk or listener */
    support: makeSubNamespace(`${normPathRoot}.support`),

    /** thunk call */
    thunk: makeSubNamespace(`⚡ ${normPathRoot}.thunk`),

    /** event for listeners */
    event: makeSubNamespace(`📢 ${normPathRoot}.event`),
  };
}

function makeSubNamespace(root: string): SubNamespace {
  return {
    makePath(suffix: string): string {
      return makePath(root, suffix);
    },
  };
}

function makePath(root: string, suffix: string) {
  const normPathRoot = StringUtil.removeEnd(root, '/');
  const normSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`;
  const path = `${normPathRoot}${normSuffix}`;

  if (allPaths.has(path)) {
    throw new Error(
      `duplicate namespace's "${normPathRoot}" suffix "${normSuffix}"`,
    );
  }

  allPaths.add(path);
  return path;
}
