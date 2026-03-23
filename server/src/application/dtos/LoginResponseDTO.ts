import { Role } from '@/domain/enums/Role';

export interface LoginResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
    role: Role;
  };
}
