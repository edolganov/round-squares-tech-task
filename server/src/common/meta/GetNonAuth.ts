import { applyDecorators, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { NonAuthProps } from './common';

export function GetNonAuth({
  path,
  summary,
  respType,
  respArray,
}: NonAuthProps) {
  return applyDecorators(
    Get(path),
    ApiOperation({ summary }),
    ApiOkResponse({ type: respType, isArray: respArray }),
  );
}
