import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import { InsertValues } from '../../infrastructure/drizzle/orm/types';
import { appUser, appUserRole } from '../../generated/drizzle/schema';
import { ColsUser } from './ColsUser';
import { Role } from '../../common/model/role';
import { getFirst } from '../../infrastructure/db/getFirst';

export async function insertUserWithRolesTx(
  orm: DrizzleService,
  user: InsertValues<typeof appUser>,
  roles: Role[],
) {
  return orm.db().transaction(async (tx) => {
    // user
    const newUser = await tx
      .insert(appUser)
      .values(user)
      .returning({ ...ColsUser })
      .then(getFirst);

    const userId = newUser.id;

    // user roles
    await tx
      .insert(appUserRole)
      .values(roles.map((role) => ({ roleValue: role, userId })));

    return newUser;
  });
}
