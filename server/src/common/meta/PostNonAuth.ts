import { applyDecorators, HttpCode, Post, Type } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { NonAuthProps } from './common';

export function PostNonAuth({
  path,
  summary,
  respType,
  respArray,
}: NonAuthProps) {
  return applyDecorators(
    Post(path),
    HttpCode(200),
    ApiOperation({ summary }),
    ApiOkResponse({ type: respType, isArray: respArray }),
  );
}
