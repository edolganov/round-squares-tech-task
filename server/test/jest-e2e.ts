import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'steps',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testTimeout: 60_000,
  globalSetup: './globalSetup.ts',
  globalTeardown: './globalTeardown.ts',
  maxWorkers: 1,
  bail: 1,
};

export default config;
