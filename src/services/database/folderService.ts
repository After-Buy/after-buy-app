import {
  BreadcrumbItem,
  Device,
  Folder,
  FolderContentResponse,
} from "../../types/database";
import { db } from "./sqlite";

const getBreadcrumbs = async (
  userId: number,
  folderId: number,
): Promise<BreadcrumbItem[]> => {
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentFolderId: number | null = folderId;

  while (currentFolderId !== null) {
    const folder: Pick<
      Folder,
      "folder_id" | "folder_name" | "parent_folder_id"
    > | null = await db.getFirstAsync(
      `
    SELECT folder_id, folder_name, parent_folder_id
    FROM folders
    WHERE user_id = ? AND folder_id = ?
    `,
      [userId, currentFolderId],
    );

    if (!folder) break;

    breadcrumbs.unshift({
      folder_id: folder.folder_id,
      folder_name: folder.folder_name,
    });

    currentFolderId = folder.parent_folder_id;
  }

  return breadcrumbs;
};

const createFolder = async ({
  userId,
  folderName,
  parentFolderId,
}: {
  userId: number;
  folderName: string;
  parentFolderId: number | null;
}): Promise<number | bigint> => {
  const trimmedName = folderName.trim();

  if (!trimmedName) {
    throw new Error("폴더명은 비어 있을 수 없습니다.");
  }

  const result = await db.runAsync(
    `
    INSERT INTO folders (user_id, folder_name, parent_folder_id)
    VALUES (?, ?, ?)
    `,
    [userId, trimmedName, parentFolderId],
  );

  return result.lastInsertRowId;
};

const getFolderContents = async (
  userId: number,
  folderId: number | null,
): Promise<FolderContentResponse> => {
  const folders = await db.getAllAsync<Folder>(
    `
    SELECT
      f.*,
      (
        SELECT COUNT(*)
        FROM devices d
        WHERE d.folder_id = f.folder_id
      ) AS device_count
    FROM folders f
    WHERE f.user_id = ?
      AND f.parent_folder_id ${folderId !== null ? "= ?" : "IS NULL"}
    ORDER BY f.created_at DESC
    `,
    folderId !== null ? [userId, folderId] : [userId],
  );

  const devices = await db.getAllAsync<Device>(
    `
    SELECT *
    FROM devices
    WHERE user_id = ?
      AND folder_id ${folderId !== null ? "= ?" : "IS NULL"}
    ORDER BY created_at DESC
    `,
    folderId !== null ? [userId, folderId] : [userId],
  );

  const breadcrumbs =
    folderId !== null ? await getBreadcrumbs(userId, folderId) : [];

  return {
    folders,
    devices,
    breadcrumbs,
  };
};

export const folderService = {
  getFolderContents,
  getBreadcrumbs,
  createFolder,
};
