export interface CategoryProps {
  lat: string;
  lng: string;
  rasterDataCache: { [key: number]: RasterData };
  elevationData: ElevationData | null;
  cropHeatMaps: any;
  yearlyYields: yearlyYield[];
  climateData: Record<number, ClimateData>;
  score: number | null;
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
}

export interface yearlyYield {
  Crop: string;
  Year: number;
  Yield: number;
  levels: string;
}

export interface CropStats {
  imageUrl: string;
  min: number;
  max: number;
  average: number;
  stdDev: number;
  range: number;
  thresholdMin: number;
  thresholdMax: number;
}

export interface CropData {
  [key: string]: CropStats;
}

export interface RasterData {
  imageUrl: string;
  legend: Record<string, string>;
  bbox: number[];
  usableLandPct: number;
  area: number;
  majorCommodityCropsGrown: string[];
};


export interface ElevationData {
  bbox: number[];
  slope: (number|null)[]; 
  aspect: (number|null)[];
  width: number;
  height: number;
  elevationUrl: string;
  avgElevation: number;
  stdElevation: number;
  minElevation: number;
  maxElevation: number;
  slopeUrl: string;
  avgSlope: number;
  stdSlope: number;
  minSlope: number;
  maxSlope: number;
  convexityUrl: string;
  avgConvexity: number;
  stdConvexity: number;
  minConvexity: number;
  maxConvexity: number;
}

export interface WeatherData {
  datetime: string;
  tempmin: number;
  tempmax: number;
  temp: number;
  precip: number;
  humidity: number;
  dew: number;
  windgust: number;
  windspeed: number;
  winddir: number;
}

export interface ClimateData {
  weatherData: WeatherData[];
  firstFrost: string | null;
  lastFrost: string | null;
  growingSeasonLength: number | null;
  cornHeatUnits: Record<string, number>;
  GDD0: Record<string, number>;
  GDD5: Record<string, number>;
  GDD10: Record<string, number>;
  GDD15: Record<string, number>;
};

export type TypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Float32Array | Float64Array;
