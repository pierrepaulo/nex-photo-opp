export interface LoginLogContextDTO {
  ipAddress: string;
  method: string;
  route: string;
  requestBody: string;
  userAgent: string | null;
}
