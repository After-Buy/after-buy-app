import { PushSettings } from "../../types/notification";
import { db } from "./sqlite";

const USER_ID = 1;

const formatDateTime = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
};

export type UserProfile = {
  user_id: number;
  email: string;
  nickname: string;
  profile_image_url: string | null;
  updated_at: string;
};

export const authService = {
  initPushSettingsTable: async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS push_settings (
        setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        push_enabled INTEGER NOT NULL DEFAULT 1,
        fcm_token TEXT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  },

  ensurePushSettings: async (userId: number = USER_ID) => {
    await authService.initPushSettingsTable();

    const existing = await db.getFirstAsync<PushSettings>(
      `SELECT * FROM push_settings WHERE user_id = ?`,
      [userId],
    );

    if (existing) return existing;

    const now = formatDateTime(new Date());

    await db.runAsync(
      `
      INSERT INTO push_settings (user_id, push_enabled, fcm_token, updated_at)
      VALUES (?, 1, NULL, ?)
      `,
      [userId, now],
    );

    return await db.getFirstAsync<PushSettings>(
      `SELECT * FROM push_settings WHERE user_id = ?`,
      [userId],
    );
  },

  patchMyPushEnabled: async (pushEnabled: 0 | 1, userId: number = USER_ID) => {
    if (pushEnabled !== 0 && pushEnabled !== 1) {
      throw new Error("push_enabled는 0 또는 1만 허용됩니다.");
    }

    await authService.ensurePushSettings(userId);

    const now = formatDateTime(new Date());

    await db.runAsync(
      `
      UPDATE push_settings
      SET push_enabled = ?, updated_at = ?
      WHERE user_id = ?
      `,
      [pushEnabled, now, userId],
    );

    return {
      success: true,
      data: {
        push_enabled: pushEnabled,
      },
    };
  },

  initUserProfileTable: async () => {
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_profile (
      user_id INTEGER PRIMARY KEY,
      email TEXT NOT NULL,
      nickname TEXT NOT NULL,
      profile_image_url TEXT,
      updated_at TEXT NOT NULL
    );
  `);
  },

  ensureUserProfile: async (userId: number = USER_ID): Promise<UserProfile> => {
    await authService.initUserProfileTable();

    const existing = await db.getFirstAsync<UserProfile>(
      `SELECT * FROM user_profile WHERE user_id = ?`,
      [userId],
    );

    if (existing) return existing;

    const now = formatDateTime(new Date());

    await db.runAsync(
      `
    INSERT INTO user_profile (
      user_id,
      email,
      nickname,
      profile_image_url,
      updated_at
    ) VALUES (?, ?, ?, ?, ?)
    `,
      [userId, "gachon@gachon.ac.kr", "가천대", null, now],
    );

    const created = await db.getFirstAsync<UserProfile>(
      `SELECT * FROM user_profile WHERE user_id = ?`,
      [userId],
    );

    if (!created) {
      throw new Error("프로필 초기화에 실패했습니다.");
    }

    return created;
  },

  getMyProfile: async (
    userId: number = USER_ID,
  ): Promise<UserProfile | null> => {
    await authService.ensureUserProfile(userId);

    return await db.getFirstAsync<UserProfile>(
      `SELECT * FROM user_profile WHERE user_id = ?`,
      [userId],
    );
  },

  patchMyProfile: async (
    data: {
      nickname?: string;
      profile_image_url?: string | null;
    },
    userId: number = USER_ID,
  ): Promise<UserProfile> => {
    await authService.ensureUserProfile(userId);

    const current = await authService.getMyProfile(userId);

    if (!current) {
      throw new Error("프로필을 찾을 수 없습니다.");
    }

    if (data.nickname !== undefined) {
      const trimmed = data.nickname.trim();

      if (!trimmed) {
        throw new Error("닉네임은 비워둘 수 없습니다.");
      }

      if (trimmed.length > 50) {
        throw new Error("닉네임은 최대 50자까지 입력 가능합니다.");
      }

      data.nickname = trimmed;
    }

    const now = formatDateTime(new Date());

    await db.runAsync(
      `
    UPDATE user_profile
    SET nickname = ?, profile_image_url = ?, updated_at = ?
    WHERE user_id = ?
    `,
      [
        data.nickname ?? current.nickname,
        data.profile_image_url !== undefined
          ? data.profile_image_url
          : current.profile_image_url,
        now,
        userId,
      ],
    );

    const updated = await authService.getMyProfile(userId);

    if (!updated) {
      throw new Error("프로필 저장 후 조회에 실패했습니다.");
    }

    return updated;
  },
};
