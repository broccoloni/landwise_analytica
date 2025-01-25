export interface DemoData {
  latitude: number;
  longitude: number;
  bbox: number[][];
  historicData: PerformanceData;
  projectedData: Record<string, PerformanceData>;
  cropHeatMapData: Record<string, ImageAndStats>;
  heatUnitData:any;
  growingSeasonData:any;
  climateData: any;
  elevationData: Record<string, ImageAndStats>;
  landUseData: Record<number, ImageAndLegend>;
  windData: Record<string, ImageAndStats>;
  soilData: any;
}

export interface ImageAndLegend {
  imageUrl: string;
  legend: Record<string, string>;
  uniqueElements?: Record<string, string>;
  counts: Record<string, number>;  
  cropArea: number;
  area: number;
};

export interface ImageAndStats {
  imageUrl: string;
  min: number;
  max: number;
  avg: number;
  std: number;
  variation: number; // For crop consistency
  avgDir: number;    // For windData
  stdDir: number;    // For windData
};

export interface PerformanceData {
  property: number[];
  neighbourhood: number[];
  national: number[];
  avgNePerf: number;
  stdNePerf: number;
  avgNaPerf: number;
  stdNaPerf: number;
  avgPerf: number;
  labels: string[];      // For historicData
  cropsGrown: string[];  // For projectedData
  years: number[];       // For projectedData
}

// Unprocessed - not used in demo
export interface Data {
  sampleData: DataArray;
  width: number;
  height: number;
};

export type DataArray = (number | null)[];
