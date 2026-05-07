import {
    BreadcrumbItem,
    Folder,
    FolderContentResponse,
} from "../../types/database";
import { api } from "../api/api";

const normalizeFolder = (folder: any): Folder => {
  console.log("[FolderService] normalizeFolder raw:", folder);

  const normalized = {
    ...folder,
    folder_id: folder.folder_id ?? folder.folderId,
    folder_name: folder.folder_name ?? folder.folderName,
    parent_folder_id: folder.parent_folder_id ?? folder.parentFolderId ?? null,
    device_count:
      folder.child_count ?? folder.device_count ?? folder.deviceCount ?? 0,
  };

  console.log("[FolderService] normalizeFolder normalized:", normalized);

  return normalized;
};

const getFolderContents = async (
  _userId: number,
  folderId: number | null,
): Promise<FolderContentResponse> => {
  console.log("[FolderService] getFolderContents request:", { folderId });

  if (folderId === null) {
    const response = await api.get("/devices/folders");

    console.log("[FolderService] root response:", response.data);

    const data = response.data.data;

    return {
      folders: (data.folders ?? []).map(normalizeFolder),
      devices: data.unclassified_devices ?? data.unclassifiedDevices ?? [],
      breadcrumbs: [],
    };
  }

  const response = await api.get(`/devices/folders/${folderId}/items`);

  console.log("[FolderService] folder items response:", response.data);

  const data = response.data.data;

  return {
    folders: (data.sub_folders ?? data.subfolders ?? data.subFolders ?? []).map(
      normalizeFolder,
    ),
    devices: data.devices ?? [],
    breadcrumbs: (data.breadcrumb ?? data.breadcrumbs ?? []).map(
      (item: any) => ({
        folder_id: item.folder_id ?? item.folderId,
        folder_name: item.folder_name ?? item.folderName,
      }),
    ),
  };
};

const getBreadcrumbs = async (
  _userId: number,
  folderId: number,
): Promise<BreadcrumbItem[]> => {
  const response = await api.get(`/devices/folders/${folderId}/items`);

  return (response.data.data.breadcrumb ?? []).map((item: any) => ({
    folder_id: item.folder_id ?? item.folderId,
    folder_name: item.folder_name ?? item.folderName,
  }));
};

const bulkDeleteItems = async ({
  folderIds,
  deviceIds,
}: {
  folderIds: number[];
  deviceIds: number[];
}) => {
  const response = await api.delete("/devices/folders/bulk-delete", {
    data: {
      folder_ids: folderIds,
      device_ids: deviceIds,
    },
  });

  return response.data;
};

const createFolder = async ({
  folderName,
  parentFolderId,
}: {
  userId: number;
  folderName: string;
  parentFolderId: number | null;
}) => {
  const payload = {
    folder_name: folderName.trim(),
    parent_folder_id: parentFolderId,
  };

  console.log("[FolderService] createFolder request:", payload);

  const response = await api.post("/devices/folders", payload);

  console.log("[FolderService] createFolder response:", response.data);

  return response.data.data;
};

const updateFolderName = async (folderId: number, folderName: string) => {
  const response = await api.patch(`/devices/folders/${folderId}`, {
    folder_name: folderName.trim(),
  });

  return response.data.data;
};

const deleteFolder = async (folderId: number) => {
  const response = await api.delete(`/devices/folders/${folderId}`);
  return response.data;
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
  const response = await api.patch("/devices/folders/bulk-move", {
    folder_ids: folderIds,
    device_ids: deviceIds,
    target_folder_id: targetFolderId,
  });

  return response.data;
};

const isDescendantFolder = async (
  sourceFolderId: number,
  targetFolderId: number | null,
): Promise<boolean> => {
  if (targetFolderId === null) return false;

  return sourceFolderId === targetFolderId;
};

export const folderService = {
  getFolderContents,
  getBreadcrumbs,
  createFolder,
  updateFolderName,
  deleteFolder,
  isDescendantFolder,
  bulkMoveItems,
  bulkDeleteItems,
};
