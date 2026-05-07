import { api } from "./api";

export const authApi = {
  getMyProfile: async () => {
    const res = await api.get("/auth/users/me");
    return res.data.data;
  },

  updateMyProfile: async (data: {
    nickname?: string;
    profileImageUrl?: string | null;
  }) => {
    const res = await api.patch("/auth/users/me", data);
    return res.data.data;
  },

  logout: async (refreshToken: string) => {
    const res = await api.delete("/auth/logout", {
      data: {
        refreshToken,
      },
    });
    return res.data;
  },

  withdraw: async () => {
    const res = await api.delete("/auth/withdraw", {
      data: {
        consent: true,
      },
    });
    return res.data;
  },

  getProfileImagePresignedUrl: async (fileExtension: string) => {
    const res = await api.post("/auth/images/presigned-url", {
      fileExtension,
    });
    return res.data.data;
  },

  patchMyPushEnabled: async (pushEnabled: 0 | 1) => {
    const res = await api.patch("/auth/users/me/push", {
      pushEnabled,
    });

    return res.data.data;
  },
};
