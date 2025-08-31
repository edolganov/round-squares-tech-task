import {
  Configuration,
  type FetchParams,
  type RequestContext,
  type ResponseContext,
} from '@/generated/api';
import { clearAuth, getAuthToken } from '@/api/auth.ts';
import { Config } from '@/config/Config.ts';
import { Util } from '@/common/utils/Util.ts';
import { ApiError } from '@/common/model/error.ts';

export function makeApiConfig() {
  return new Configuration({
    basePath: import.meta.env.VITE_SERVER_URL,
    accessToken: async () => {
      const token = getAuthToken();
      return token || '';
    },
    middleware: [
      {
        async pre(context: RequestContext): Promise<FetchParams | void> {
          if (Config.isDev && Config.devApiTimeout > 0) {
            await Util.timeout(Config.devApiTimeout);
          }
        },
        async post(context: ResponseContext): Promise<Response | void> {
          const { response } = context;
          if (response && response.status >= 200 && response.status < 300) {
            return response;
          }

          // server resets old auth
          if (response.status === 403) {
            setTimeout(() => {
              clearAuth();
            }, 100);
          }

          const data = await context.response.json();
          throw new ApiError(data.message, response.status, data);
        },
      },
    ],
  });
}
