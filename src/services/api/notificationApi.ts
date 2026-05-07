import { NotificationItem, PushSettings } from "../../types/notification";
import { api } from "./api";

export const notificationApi = {
  updateFcmToken: async (fcmToken: string | null): Promise<PushSettings> => {
    console.log("[UPDATE FCM TOKEN REQUEST]", {
      url: "/notifications/settings",
      body: { fcmToken },
    });

    const res = await api.patch("/notifications/settings", {
      fcmToken,
    });

    return res.data.data;
  },

  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await api.get("/notifications/home");
    const rows = res.data.data.notifications ?? [];

    return rows.map((item: any) => ({
      notification_id: item.notificationId,
      device_id: item.deviceId,
      device_name: item.deviceName,
      device_image_url: item.deviceImageUrl,
      notification_type: item.notificationType,
      is_read: item.isRead,
      warranty_expiry_date: item.warrantyExpiryDate,
      sent_at: item.sentAt,
    }));
  },

  getPushSettings: async (): Promise<PushSettings> => {
    const res = await api.get("/notifications/settings");
    console.log("[GET PUSH SETTINGS]", res.data);
    const data = res.data.data;

    return {
      pushEnabled: data.pushEnabled,
      fcmToken: data.fcmToken,
      updatedAt: data.updatedAt,
    };
  },

  markAsRead: async (notificationId: number) => {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  deleteNotification: async (notificationId: number) => {
    await api.delete(`/notifications/${notificationId}`);
  },

  getDaysRemaining: (date: string) => {
    const today = new Date();
    const target = new Date(date);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
  },
};
