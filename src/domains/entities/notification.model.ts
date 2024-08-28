export class Notification {
  id: number;
  transactionId: string;
  isSent: boolean;
  isHandled: boolean;
  isError: boolean;
  exchange: string;
  routingKey: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
