import { OCRType } from "@/src/types/navigation";
import { api } from "../api/api";

export type OCRRequest = {
  ocr_type: OCRType;
  image_base64: string;
};

export type OCRApiResponse = {
  success: boolean;
  data: {
    ocr_log_id?: number;
    ocr_type: OCRType;
    is_success: boolean;
    result: null | {
      model_name?: string;
      serial_number?: string;
      purchase_date?: string;
      purchase_price?: number;
      purchase_store?: string;
    };
    message?: string;
  };
};

export type ProductSearchResponse = {
  product_name: string;
  model_name: string;
  brand: string;
  image_url: string;
  product_link_url: string;
};

export type DeviceImagePresignedUrlResponse = {
  presigned_url: string;
  image_url: string;
  expires_in: number;
};

export const deviceService = {
  getHomeData: async () => {
    const response = await api.get("/devices/home-summary");

    const data = response.data.data;

    return {
      summary: {
        assetCount: data.summary.total_devices,
        totalValue: data.summary.total_value,
        expiringSoonCount: data.summary.expiring_soon_count,
      },
      recentItems: (data.recent_devices ?? []).map((item: any) => ({
        id: item.device_id,
        name: item.product_name,
        modelCode: item.model_name,
        imageUrl: item.image_url ?? undefined,
      })),
      warrantyAlert: data.urgent_device
        ? {
            id: data.urgent_device.device_id,
            name: data.urgent_device.product_name,
            modelCode: data.urgent_device.model_name ?? "",
            imageUrl: data.urgent_device.image_url ?? undefined,
            productLink: data.urgent_device.product_link_url ?? undefined,
            dday: data.urgent_device.days_remaining,
          }
        : null,
    };
  },

  getUnclassifiedDevices: async (
    sort: "created_desc" | "expiry_asc" = "created_desc",
  ) => {
    const response = await api.get("/devices/home", {
      params: { sort },
    });

    return response.data.data.devices;
  },

  createDevice: async (device: any) => {
    const payload: any = {
      product_name: device.product_name,
      model_name: device.model_name,
      brand: device.brand,
      image_url: device.image_url || null,
      product_link_url: device.product_link_url || null,
      purchase_date: device.purchase_date,
      purchase_price: device.purchase_price,
      purchase_store: device.purchase_store || null,
      warranty_months: device.warranty_months,
      serial_number: device.serial_number || null,
      memo: device.memo || null,
    };

    if (device.folder_id !== null && device.folder_id !== undefined) {
      payload.folder_id = device.folder_id;
    }

    const response = await api.post("/devices/register", payload);
    return response.data.data;
  },

  getDeviceById: async (deviceId: number) => {
    const response = await api.get(`/devices/${deviceId}`);
    return response.data.data;
  },

  updateDevice: async (deviceId: number, updateData: any) => {
    const response = await api.put(`/devices/${deviceId}`, {
      folder_id: updateData.folder_id,
      product_name: updateData.product_name,
      brand: updateData.brand,
      image_url: updateData.image_url || null,
      product_link_url: updateData.product_link_url || null,
      purchase_date: updateData.purchase_date,
      purchase_price: updateData.purchase_price,
      purchase_store: updateData.purchase_store || null,
      warranty_months: updateData.warranty_months,
      serial_number: updateData.serial_number || null,
      memo: updateData.memo || null,
    });

    return response.data.data;
  },

  updateDeviceName: async (deviceId: number, productName: string) => {
    const response = await api.patch(`/devices/${deviceId}/name`, {
      product_name: productName.trim(),
    });

    return response.data.data;
  },

  deleteDevice: async (deviceId: number) => {
    const response = await api.delete(`/devices/${deviceId}`);
    return response.data;
  },

  requestOCR: async (payload: OCRRequest): Promise<OCRApiResponse> => {
    const response = await api.post("/devices/ocr", payload);
    return response.data;
  },

  searchProductByModelName: async (
    query: string,
  ): Promise<ProductSearchResponse> => {
    const response = await api.get("/devices/naver-search", {
      params: { modelName: query },
    });

    const data = response.data.data;

    return {
      product_name: data.productName ?? "",
      model_name: data.modelName ?? query,
      brand: data.brand ?? "",
      image_url: data.imageUrl ?? "",
      product_link_url: data.productLinkUrl ?? "",
    };
  },

  getDeviceImagePresignedUrl: async (
    fileExtension: string,
  ): Promise<DeviceImagePresignedUrlResponse> => {
    const response = await api.post("/devices/images/presigned-url", {
      file_extension: fileExtension,
    });

    return response.data.data;
  },

  uploadImageToS3: async (presignedUrl: string, imageUri: string) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const uploadRes = await fetch(presignedUrl, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": blob.type || "image/jpeg",
      },
    });

    if (!uploadRes.ok) {
      throw new Error("S3 업로드 실패");
    }

    return true;
  },

  searchItems: async (query: string) => {
    const response = await api.get("/devices/search", {
      params: { q: query },
    });

    return response.data.data;
  },

  recordOCRModifiedFields: async ({
    ocrLogId,
    deviceId,
    modifiedFields,
  }: {
    ocrLogId: number;
    deviceId: number;
    modifiedFields: string[];
  }) => {
    const response = await api.post("/devices/ocr/modified-fields", {
      ocr_log_id: ocrLogId,
      device_id: deviceId,
      modified_fields: modifiedFields,
    });

    return response.data;
  },
};
