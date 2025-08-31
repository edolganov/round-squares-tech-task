import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import { appUser } from '../../generated/drizzle/schema';
import { Role } from '../../common/model/role';

export async function selectUserWithRoles(orm: DrizzleService, login: string) {
  return orm
    .db()
    .query.appUser.findFirst({
      where: eq(appUser.login, login),
      with: { appUserRoles: { columns: { roleValue: true } } },
    })
    .then((item) =>
      item
        ? {
            ...item,
            appUserRoles: item.appUserRoles.map(
              (data) => data.roleValue as Role,
            ),
          }
        : undefined,
    );
}
