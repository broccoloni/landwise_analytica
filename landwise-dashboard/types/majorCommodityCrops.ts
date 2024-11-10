export type MajorCommodityCrop = "Flaxseed" | "Wheat" | "Barley" | "Oats" | "Canola" | "Peas" | "Corn" | "Soy";

export const majorCommodityCrops: MajorCommodityCrop[] = [
  "Flaxseed",
  "Wheat",
  "Barley",
  "Oats",
  "Canola",
  "Peas",
  "Corn",
  "Soy"
];

export const majorCommodityThresholds: Record<MajorCommodityCrop, { vmin: number; vmax: number }> = {
  Flaxseed: { vmin: 56, vmax: 96 },
  Wheat: { vmin: 77, vmax: 117 },
  Barley: { vmin: 61, vmax: 101 },
  Oats: { vmin: 56, vmax: 96 },
  Canola: { vmin: 43, vmax: 83 },
  Peas: { vmin: 66, vmax: 106 },
  Corn: { vmin: 63, vmax: 103 },
  Soy: { vmin: 63, vmax: 103 },
};