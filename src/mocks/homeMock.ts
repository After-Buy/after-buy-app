import { HomeData } from "../types/home";

export const emptyHomeMock = {
  summary: {
    assetCount: 0,
    totalValue: 0,
    expiredCount: 0,
  },
  recentItems: [],
  warrantyAlert: null,
};

export const loadedHomeMock: HomeData = {
  summary: {
    assetCount: 12,
    totalValue: 3420000,
    expiredCount: 2,
  },
  recentItems: [
    { id: 1, name: "Item1", modelCode: "GUGC1T0001" },
    { id: 2, name: "Item2", modelCode: "GUGC1T0001" },
    { id: 3, name: "Item3", modelCode: "GUGC1T0001" },
  ],
  warrantyAlert: {
    id: 3,
    name: "Item3",
    modelCode: "GUGC1T0001",
    dday: 12,
    productLink: "https://example.com",
  },
};
