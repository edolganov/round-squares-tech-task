import { applyDecorators, HttpCode, Post } from '@nestjs/common';
import { Auth } from '../../auth/decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthProps } from './common';

export function PostAuthSurvivor({
  path,
  summary,
  respType,
  respArray,
}: AuthProps) {
  return applyDecorators(
    Auth('survivor'),
    Post(path),
    HttpCode(200),
    ApiBearerAuth(),
    ApiOperation({ summary }),
    ApiOkResponse({ type: respType, isArray: respArray }),
  );
}
