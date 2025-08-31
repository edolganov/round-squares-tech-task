import { Type } from '@nestjs/common';

export interface NonAuthProps {
  path: string | string[] | undefined;
  summary: string;
  respType: string | Function | Type<unknown> | [Function] | undefined;
  respArray?: boolean | undefined;
}

export interface AuthProps extends NonAuthProps {}
