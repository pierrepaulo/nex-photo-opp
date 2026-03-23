import { Role } from '@/domain/enums/Role';

export interface CurrentUserDTO {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
}
