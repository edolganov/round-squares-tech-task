import { applyDecorators, HttpCode, Post } from '@nestjs/common';
import { Auth } from '../../auth/decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthProps } from './common';

export function PostAuthAdmin({
  path,
  summary,
  respType,
  respArray,
}: AuthProps) {
  return applyDecorators(
    Auth('admin'),
    Post(path),
    HttpCode(200),
    ApiBearerAuth(),
    ApiOperation({ summary }),
    ApiOkResponse({ type: respType, isArray: respArray }),
  );
}
