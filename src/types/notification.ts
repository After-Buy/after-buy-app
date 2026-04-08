export type NotificationType =
  | "WARRANTY_D30"
  | "WARRANTY_D14"
  | "WARRANTY_D1"
  | "WARRANTY_EXPIRED";

export type NotificationRow = Omit<NotificationItem, "is_read"> & {
  is_read: number;
  count: number;
};

export interface NotificationItem {
  notification_id: number;
  user_id: number;
  device_id: number;
  device_name: string;
  device_image_url: string | null;
  notification_type: NotificationType;
  is_read: 0 | 1;
  is_deleted: number;
  warranty_expiry_date: string;
  sent_at: string;
  auto_delete_at: string | null;
}

export interface PushSettings {
  setting_id: number;
  user_id: number;
  push_enabled: 0 | 1;
  fcm_token: string | null;
  updated_at: string;
}
