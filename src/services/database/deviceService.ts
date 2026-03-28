import { db } from "./sqlite";

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
};
