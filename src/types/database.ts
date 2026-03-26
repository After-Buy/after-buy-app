export interface Folder {
  folder_id: number;
  user_id: number;
  parent_folder_id: number | null;
  folder_name: string;
  created_at: string;
  updated_at: string;
  child_count?: number;
}

export interface Device {
  device_id: number;
  user_id: number;
  folder_id: number | null;
  product_name: string;
  model_name: string;
  brand: string;
  image_url: string | null;
  product_link_url: string | null;
  purchase_date: string;
  purchase_price: number;
  purchase_store: string | null;
  warranty_months: number;
  warranty_expiry_date: string;
  serial_number: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export type OCRType = "MODEL" | "SERIAL" | "RECEIPT";

export interface OCRLog {
  ocr_log_id: number;
  user_id: number;
  device_id: number | null;
  ocr_type: OCRType;
  is_success: number;
  modified_fields: string | null;
  created_at: string;
}

export interface FolderContentResponse {
  current_folder?: Folder;
  folders: Folder[];
  devices: Device[];
}

export type CreateDeviceRequest = Omit<
  Device,
  "device_id" | "created_at" | "updated_at" | "warranty_expiry_date"
>;

export type UpdateDeviceRequest = Partial<
  Omit<
    Device,
    "device_id" | "user_id" | "model_name" | "created_at" | "updated_at"
  >
>;
