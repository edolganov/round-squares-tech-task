import { getTableColumns } from 'drizzle-orm';
import { appUser } from '../../generated/drizzle/schema';

export const ColsUser = getTableColumns(appUser);
