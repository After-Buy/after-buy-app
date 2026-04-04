import { HomeData, HomeItem, WarrantyAlertItem } from "../../types/home";
import { db } from "./sqlite";

const calculateDday = (dateText: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dateText);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const deviceService = {
  createDevice: async (device: any) => {
    const {
      user_id,
      folder_id,
      product_name,
      model_name,
      brand,
      image_url,
      product_link_url,
      purchase_date,
      purchase_price,
      purchase_store,
      warranty_months,
      serial_number,
      memo,
    } = device;

    const pDate = new Date(purchase_date);
    pDate.setMonth(pDate.getMonth() + Number(warranty_months));
    const warranty_expiry_date = pDate.toISOString().split("T")[0];

    const result = await db.runAsync(
      `INSERT INTO devices (
  user_id,
  folder_id,
  product_name,
  model_name,
  brand,
  image_url,
  product_link_url,
  purchase_date,
  purchase_price,
  purchase_store,
  warranty_months,
  warranty_expiry_date,
  serial_number,
  memo
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        folder_id,
        product_name,
        model_name,
        brand,
        image_url ?? null,
        product_link_url ?? null,
        purchase_date,
        purchase_price,
        purchase_store ?? null,
        warranty_months,
        warranty_expiry_date,
        serial_number ?? null,
        memo ?? null,
      ],
    );

    return result.lastInsertRowId;
  },

  getDeviceById: async (deviceId: number) => {
    return await db.getFirstAsync<any>(
      `SELECT * FROM devices WHERE device_id = ?`,
      [deviceId],
    );
  },

  updateDevice: async (deviceId: number, updateData: any) => {
    const {
      folder_id,
      product_name,
      brand,
      image_url,
      product_link_url,
      purchase_date,
      purchase_price,
      purchase_store,
      warranty_months,
      serial_number,
      memo,
    } = updateData;

    const pDate = new Date(purchase_date);
    pDate.setMonth(pDate.getMonth() + Number(warranty_months));
    const warranty_expiry_date = pDate.toISOString().split("T")[0];

    const result = await db.runAsync(
      `UPDATE devices SET 
        folder_id = ?,
        product_name = ?, 
        brand = ?, 
        image_url = ?,
        product_link_url = ?,
        purchase_date = ?, 
        purchase_price = ?, 
        purchase_store = ?,
        warranty_months = ?, 
        warranty_expiry_date = ?, 
        serial_number = ?,
        memo = ?, 
        updated_at = DATETIME('now')
      WHERE device_id = ?`,
      [
        folder_id,
        product_name,
        brand,
        image_url,
        product_link_url,
        purchase_date,
        purchase_price,
        purchase_store,
        warranty_months,
        warranty_expiry_date,
        serial_number,
        memo,
        deviceId,
      ],
    );

    return result.changes;
  },

  deleteDevice: async (deviceId: number) => {
    const result = await db.runAsync(
      `DELETE FROM devices WHERE device_id = ?`,
      [deviceId],
    );

    return result.changes;
  },

  moveDevices: async (deviceIds: number[], targetFolderId: number | null) => {
    if (deviceIds.length === 0) return 0;

    const placeholders = deviceIds.map(() => "?").join(",");

    const result = await db.runAsync(
      `
    UPDATE devices
    SET folder_id = ?,
        updated_at = DATETIME('now')
    WHERE device_id IN (${placeholders})
    `,
      [targetFolderId, ...deviceIds],
    );

    return result.changes;
  },

  getHomeData: async (userId: number = 1): Promise<HomeData> => {
    const summaryRow = await db.getFirstAsync<{
      assetCount: number | null;
      totalValue: number | null;
      expiringSoonCount: number | null;
    }>(
      `
      SELECT
        COUNT(*) AS assetCount,
        COALESCE(SUM(purchase_price), 0) AS totalValue,
        COUNT(
          CASE
            WHEN warranty_expiry_date >= date('now')
             AND warranty_expiry_date <= date('now', '+30 day')
            THEN 1
          END
        ) AS expiringSoonCount
      FROM devices
      WHERE user_id = ?
      `,
      [userId],
    );

    const recentRows = await db.getAllAsync<{
      device_id: number;
      product_name: string;
      model_name: string;
      image_url: string | null;
    }>(
      `
      SELECT
        device_id,
        product_name,
        model_name,
        image_url
      FROM devices
      WHERE user_id = ?
      ORDER BY datetime(created_at) DESC, device_id DESC
      LIMIT 3
      `,
      [userId],
    );

    const urgentRow = await db.getFirstAsync<{
      device_id: number;
      product_name: string;
      model_name: string;
      image_url: string | null;
      product_link_url: string | null;
      warranty_expiry_date: string;
    }>(
      `
      SELECT
        device_id,
        product_name,
        model_name,
        image_url,
        product_link_url,
        warranty_expiry_date
      FROM devices
      WHERE user_id = ?
        AND warranty_expiry_date IS NOT NULL
        AND warranty_expiry_date != ''
      ORDER BY date(warranty_expiry_date) ASC, device_id ASC
      LIMIT 1
      `,
      [userId],
    );

    const recentItems: HomeItem[] = recentRows.map((item) => ({
      id: item.device_id,
      name: item.product_name,
      modelCode: item.model_name,
      imageUrl: item.image_url ?? undefined,
    }));

    const warrantyAlert: WarrantyAlertItem | null = urgentRow
      ? {
          id: urgentRow.device_id,
          name: urgentRow.product_name,
          modelCode: urgentRow.model_name,
          imageUrl: urgentRow.image_url ?? undefined,
          productLink: urgentRow.product_link_url ?? undefined,
          dday: calculateDday(urgentRow.warranty_expiry_date),
        }
      : null;

    return {
      summary: {
        assetCount: summaryRow?.assetCount ?? 0,
        totalValue: summaryRow?.totalValue ?? 0,
        expiringSoonCount: summaryRow?.expiringSoonCount ?? 0,
      },
      recentItems,
      warrantyAlert,
    };
  },
};
