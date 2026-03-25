export interface AssetSummary {
  assetCount: number;
  totalValue: number;
  expiredCount: number;
}

export interface HomeItem {
  id: number;
  name: string;
  modelCode: string;
  imageUrl?: string;
}

export interface WarrantyAlertItem extends HomeItem {
  dday: number;
  productLink?: string;
}

export interface HomeData {
  summary: AssetSummary;
  recentItems: HomeItem[];
  warrantyAlert?: WarrantyAlertItem | null;
}

export type HomeStatus = "empty" | "loaded" | "error";
