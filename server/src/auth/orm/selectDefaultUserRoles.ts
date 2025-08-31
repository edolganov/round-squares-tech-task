import { eq, or } from 'drizzle-orm';
import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import { appUserRoleDefault } from '../../generated/drizzle/schema';
import { Role } from '../../common/model/role';

export async function selectDefaultUserRoles(
  orm: DrizzleService,
  login: string,
) {
  return orm
    .db()
    .query.appUserRoleDefault.findMany({
      columns: { roleValue: true },
      where: or(
        eq(appUserRoleDefault.login, login),
        eq(appUserRoleDefault.login, ''),
      ),
    })
    .then((data) => data.map((item) => item.roleValue as Role));
}
