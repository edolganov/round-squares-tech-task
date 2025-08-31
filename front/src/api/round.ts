import { RoundApi } from '@/generated/api';
import { makeApiConfig } from '@/infrastructure/openapi/makeApiConfig.ts';

export const RestRound = new RoundApi(makeApiConfig());
