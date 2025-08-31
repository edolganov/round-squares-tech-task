import { Role } from '../common/model/role';

export interface JwtAuthPayload {
  userId: string;
  login: string;
  roles: Role[];
}
