import { db } from "./sqlite";

export const deviceService = {
  /**
   * 새 기기 등록 (물리 설계 반영)
   */
  createDevice: async (device: any) => {
    const {
      user_id,
      folder_id,
      product_name,
      model_name,
      brand,
      purchase_date,
      purchase_price,
      warranty_months,
    } = device;

    // 보증 만료일 계산 로직 (purchase_date + warranty_months)
    const pDate = new Date(purchase_date);
    pDate.setMonth(pDate.getMonth() + Number(warranty_months));
    const warranty_expiry_date = pDate.toISOString().split("T")[0];

    const result = await db.runAsync(
      `INSERT INTO devices (
        user_id, folder_id, product_name, model_name, brand, 
        purchase_date, purchase_price, warranty_months, warranty_expiry_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        folder_id,
        product_name,
        model_name,
        brand,
        purchase_date,
        purchase_price,
        warranty_months,
        warranty_expiry_date,
      ],
    );

    return result.lastInsertRowId;
  },

  /**
   * 특정 기기 상세 정보 조회
   */
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

    // 1. 보증 만료일 자동 재계산 (API 명세서 요구사항)
    const pDate = new Date(purchase_date);
    pDate.setMonth(pDate.getMonth() + Number(warranty_months));
    const warranty_expiry_date = pDate.toISOString().split("T")[0];

    // 2. SQL 실행 (model_name을 제외한 모든 필드 업데이트)
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
