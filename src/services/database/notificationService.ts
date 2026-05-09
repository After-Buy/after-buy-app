import { NotificationItem, PushSettings } from "../../types/notification";
import { api } from "../api/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await api.get<
      ApiResponse<{
        notifications: any[];
        totalCount: number;
      }>
    >("/notifications/home");

    const rows = res.data.data.notifications ?? [];

    return rows.map((item) => ({
      notification_id: item.notificationId,
      device_id: item.deviceId,
      device_name: item.deviceName,
      device_image_url: item.deviceImageUrl,
      notification_type: item.notificationType,
      is_read: item.isRead,
      warranty_expiry_date: item.warrantyExpiryDate,

      // 직접 계산
      days_remaining: this.getDaysRemaining(item.warrantyExpiryDate),

      sent_at: item.sentAt,
    }));
  },

  async getPushSettings(): Promise<PushSettings> {
    const res = await api.get<ApiResponse<PushSettings>>(
      "/notifications/settings",
    );

    return res.data.data;
  },

  async updateFcmToken(fcmToken: string | null): Promise<PushSettings> {
    const res = await api.patch<ApiResponse<PushSettings>>(
      "/notifications/settings",
      {
        fcmToken,
      },
    );

    return res.data.data;
  },

  async markAsRead(notificationId: number) {
    const res = await api.patch<
      ApiResponse<{
        notification_id: number;
        is_read: 1;
      }>
    >(`/notifications/${notificationId}/read`);

    return res.data.data;
  },

  async deleteNotification(notificationId: number) {
    await api.delete(`/notifications/${notificationId}`);

    return true;
  },

  getDaysRemaining(warrantyExpiryDate: string) {
    const today = new Date();
    const target = new Date(warrantyExpiryDate);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
  },
};
