// src/types/notification.ts

export type NotificationType =
  | "WARRANTY_D30"
  | "WARRANTY_D14"
  | "WARRANTY_D1"
  | "WARRANTY_EXPIRED";

export type NotificationItem = {
  notification_id: number;
  device_id: number;
  device_name: string;
  device_image_url: string | null;
  notification_type: NotificationType;
  is_read: 0 | 1;
  warranty_expiry_date: string;
  days_remaining: number;
  sent_at: string;
};

export interface PushSettings {
  settingId?: number;
  userId?: number;
  pushEnabled: 0 | 1;
  fcmToken?: string | null;
  updatedAt?: string;
}
