import { db } from "./sqlite";

export const folderService = {
  getFolderContents: async (userId: number, folderId: number | null) => {
    const folderParam = folderId ?? null;

    const folders = await db.getAllAsync<any>(
      `SELECT * FROM folders WHERE user_id = ? AND parent_folder_id ${folderId ? "= ?" : "IS NULL"}`,
      folderId ? [userId, folderId] : [userId],
    );

    const devices = await db.getAllAsync<any>(
      `SELECT * FROM devices WHERE user_id = ? AND folder_id ${folderId ? "= ?" : "IS NULL"}`,
      folderId ? [userId, folderId] : [userId],
    );

    return { folders, devices };
  },
};
