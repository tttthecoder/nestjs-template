export interface NotificationSender<T> {
  sendMessage(option: T): void;
}
