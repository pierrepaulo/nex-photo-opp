export interface Log {
  id: string;
  userId: string | null;
  ipAddress: string;
  method: string;
  route: string;
  requestBody: string | null;
  responseStatus: number;
  actionType: string;
  userAgent: string | null;
  createdAt: Date;
}

