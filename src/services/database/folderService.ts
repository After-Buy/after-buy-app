import {
  BreadcrumbItem,
  Device,
  Folder,
  FolderContentResponse,
} from "../../types/database";
import { deviceService } from "./deviceService";
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

const deleteFolder = async (folderId: number) => {
  const result = await db.runAsync(`DELETE FROM folders WHERE folder_id = ?`, [
    folderId,
  ]);

  return result.changes;
};

const moveFolders = async (
  folderIds: number[],
  targetFolderId: number | null,
) => {
  if (folderIds.length === 0) return 0;

  const placeholders = folderIds.map(() => "?").join(",");

  const result = await db.runAsync(
    `
    UPDATE folders
    SET parent_folder_id = ?,
        updated_at = DATETIME('now')
    WHERE folder_id IN (${placeholders})
    `,
    [targetFolderId, ...folderIds],
  );

  return result.changes;
};

const isDescendantFolder = async (
  sourceFolderId: number,
  targetFolderId: number | null,
): Promise<boolean> => {
  if (targetFolderId === null) return false;
  if (sourceFolderId === targetFolderId) return true;

  let currentFolderId: number | null = targetFolderId;

  while (currentFolderId !== null) {
    const folder: Pick<Folder, "folder_id" | "parent_folder_id"> | null =
      await db.getFirstAsync(
        `
    SELECT folder_id, parent_folder_id
    FROM folders
    WHERE folder_id = ?
    `,
        [currentFolderId],
      );
    if (!folder) return false;
    if (folder.parent_folder_id === sourceFolderId) return true;

    currentFolderId = folder.parent_folder_id;
  }

  return false;
};

const bulkMoveItems = async ({
  folderIds,
  deviceIds,
  targetFolderId,
}: {
  folderIds: number[];
  deviceIds: number[];
  targetFolderId: number | null;
}) => {
  if (folderIds.length === 0 && deviceIds.length === 0) {
    throw new Error("이동할 폴더 또는 기기를 하나 이상 선택해야 합니다.");
  }

  if (folderIds.length > 0) {
    await moveFolders(folderIds, targetFolderId);
  }

  if (deviceIds.length > 0) {
    await deviceService.moveDevices(deviceIds, targetFolderId);
  }

  return true;
};

export const folderService = {
  getFolderContents,
  getBreadcrumbs,
  createFolder,
  deleteFolder,
  moveFolders,
  isDescendantFolder,
  bulkMoveItems,
};
