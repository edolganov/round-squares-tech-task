import { applyDecorators, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Auth } from '../../auth/decorator';
import { AuthProps } from './common';

export function GetAuthSurvivor({
  path,
  summary,
  respType,
  respArray,
}: AuthProps) {
  return applyDecorators(
    Auth('survivor'),
    Get(path),
    ApiBearerAuth(),
    ApiOperation({ summary }),
    ApiOkResponse({ type: respType, isArray: respArray }),
  );
}
