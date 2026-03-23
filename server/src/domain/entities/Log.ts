export interface Log {
  id: string;
  userId: string | null;
  ipAddress: string;
  method: string;
  route: string;
  requestBody: string | null;
  responseStatus: number;
  actionType: string;
  createdAt: Date;
}

