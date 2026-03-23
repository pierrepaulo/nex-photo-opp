export interface LogResponseDTO {
  id: string;
  userId: string | null;
  userName: string;
  ipAddress: string;
  method: string;
  route: string;
  requestBody: string | null;
  responseStatus: number;
  actionType: string;
  userAgent: string | null;
  createdAt: string;
}
