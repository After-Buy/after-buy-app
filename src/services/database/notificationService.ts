import {
  NotificationItem,
  NotificationRow,
  NotificationType,
} from "../../types/notification";
import { authService } from "./authService";
import { db } from "./sqlite";

const USER_ID = 1;

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDateTime = (date: Date) => {
  const ymd = formatDate(date);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${ymd} ${hh}:${mm}:${ss}`;
};

const calculateDaysRemaining = (expiryDateText: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateText);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

// const getNotificationType = (
//   daysRemaining: number,
// ): NotificationType | null => {
//   if (daysRemaining === 30) return "WARRANTY_D30";
//   if (daysRemaining === 14) return "WARRANTY_D14";
//   if (daysRemaining === 1) return "WARRANTY_D1";
//   if (daysRemaining < 0) return "WARRANTY_EXPIRED";
//   return null;
// };

// 로컬 데모용: 현재 상태 기준 대표 알림 타입
const getNotificationType = (
  daysRemaining: number,
): NotificationType | null => {
  if (daysRemaining < 0) return "WARRANTY_EXPIRED";
  if (daysRemaining <= 1) return "WARRANTY_D1";
  if (daysRemaining <= 14) return "WARRANTY_D14";
  if (daysRemaining <= 30) return "WARRANTY_D30";
  return null;
};

const getExpiredAutoDeleteAt = (expiryDateText: string) => {
  const expiry = new Date(expiryDateText);
  expiry.setDate(expiry.getDate() + 7);
  return formatDateTime(expiry);
};

export const notificationService = {
  initTables: async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        device_id INTEGER NOT NULL,
        device_name TEXT NOT NULL,
        device_image_url TEXT NULL,
        notification_type TEXT NOT NULL,
        is_deleted INTEGER NOT NULL DEFAULT 0,
        is_read INTEGER NOT NULL DEFAULT 0,
        warranty_expiry_date TEXT NOT NULL,
        sent_at TEXT NOT NULL,
        auto_delete_at TEXT NULL
      );
    `);

    try {
      await db.execAsync(`
    ALTER TABLE notifications
    ADD COLUMN is_deleted INTEGER NOT NULL DEFAULT 0
  `);
    } catch (error) {
      // 이미 컬럼이 있으면 무시
    }

    await authService.initPushSettingsTable();
  },

  getPushSettings: async (userId: number = USER_ID) => {
    return await authService.ensurePushSettings(userId);
  },

  syncNotificationsFromDevices: async (userId: number = USER_ID) => {
    const devices = await db.getAllAsync<{
      device_id: number;
      product_name: string;
      image_url: string | null;
      warranty_expiry_date: string | null;
    }>(
      `
      SELECT device_id, product_name, image_url, warranty_expiry_date
      FROM devices
      WHERE user_id = ?
        AND warranty_expiry_date IS NOT NULL
        AND warranty_expiry_date != ''
      `,
      [userId],
    );

    for (const device of devices) {
      const daysRemaining = calculateDaysRemaining(
        device.warranty_expiry_date!,
      );
      const notificationType = getNotificationType(daysRemaining);

      if (!notificationType) continue;

      const existing = await db.getFirstAsync<{ notification_id: number }>(
        `
  SELECT notification_id
  FROM notifications
  WHERE user_id = ?
    AND device_id = ?
    AND notification_type = ?
    AND is_deleted = 0
  `,
        [userId, device.device_id, notificationType],
      );

      const deletedExisting = await db.getFirstAsync<{
        notification_id: number;
      }>(
        `
  SELECT notification_id
  FROM notifications
  WHERE user_id = ?
    AND device_id = ?
    AND notification_type = ?
    AND is_deleted = 1
  `,
        [userId, device.device_id, notificationType],
      );

      if (existing || deletedExisting) continue;

      const sentAt = formatDateTime(new Date());
      const autoDeleteAt =
        notificationType === "WARRANTY_EXPIRED"
          ? getExpiredAutoDeleteAt(device.warranty_expiry_date!)
          : null;

      await db.runAsync(
        `
        INSERT INTO notifications (
          user_id,
          device_id,
          device_name,
          device_image_url,
          notification_type,
          is_read,
          warranty_expiry_date,
          sent_at,
          auto_delete_at
        )
        VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
        `,
        [
          userId,
          device.device_id,
          device.product_name,
          device.image_url ?? null,
          notificationType,
          device.warranty_expiry_date,
          sentAt,
          autoDeleteAt,
        ],
      );
    }

    await db.runAsync(
      `
      DELETE FROM notifications
      WHERE auto_delete_at IS NOT NULL
        AND datetime(auto_delete_at) <= datetime('now')
      `,
    );
  },

  getNotifications: async (
    userId: number = USER_ID,
  ): Promise<NotificationItem[]> => {
    await notificationService.initTables();
    await authService.ensurePushSettings(userId);
    await notificationService.syncNotificationsFromDevices(userId);

    const rows = await db.getAllAsync<NotificationRow>(
      `
      SELECT *
FROM notifications
WHERE user_id = ?
  AND is_deleted = 0
  AND (auto_delete_at IS NULL OR datetime(auto_delete_at) > datetime('now'))
ORDER BY datetime(sent_at) DESC, notification_id DESC
      `,
      [userId],
    );

    return rows.map(
      (row): NotificationItem => ({
        ...row,
        is_read: row.is_read ? 1 : 0,
      }),
    );
  },

  markAsRead: async (notificationId: number, userId: number = USER_ID) => {
    await db.runAsync(
      `
      UPDATE notifications
      SET is_read = 1
      WHERE notification_id = ?
        AND user_id = ?
      `,
      [notificationId, userId],
    );
  },

  deleteNotification: async (
    notificationId: number,
    userId: number = USER_ID,
  ) => {
    await db.runAsync(
      `
    UPDATE notifications
    SET is_deleted = 1
    WHERE notification_id = ?
      AND user_id = ?
    `,
      [notificationId, userId],
    );
  },

  isThereAnyUnread: async (userId: number = USER_ID) => {
    await notificationService.initTables();
    await authService.ensurePushSettings(userId);
    await notificationService.syncNotificationsFromDevices(userId);

    const row = await db.getFirstAsync<{ count: number }>(
      `
    SELECT COUNT(*) as count
    FROM notifications
    WHERE user_id = ?
      AND is_read = 0
      AND is_deleted = 0
      AND (auto_delete_at IS NULL OR datetime(auto_delete_at) > datetime('now'))
    `,
      [userId],
    );

    return (row?.count ?? 0) > 0;
  },

  getDaysRemaining: (warrantyExpiryDate: string) => {
    return calculateDaysRemaining(warrantyExpiryDate);
  },
};
