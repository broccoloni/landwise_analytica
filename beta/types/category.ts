export interface CategoryProps {
  lat: string;
  lng: string;
  historicalLandUse: { [key: number]: LandUseData } | null;
  elevationData: ElevationData | null;
  cropData: any,
  climateData: Record<number, ClimateData>;
  score: number | null;
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
}

export interface LandUseData {
  imageUrl?: string;
  landUseData?: number[];
  height?: number;
  width?: number;
  legend?: Record<string, string>;
  usableLandPct?: number;
  area?: number;
  majorCommodityCropsGrown?: string[];
};


export interface ElevationData {
  aspect: (number|null)[];
  width: number;
  height: number;
  elevation: string;
  avgElevation: number;
  stdElevation: number;
  minElevation: number;
  maxElevation: number;
  slope: string;
  avgSlope: number;
  stdSlope: number;
  minSlope: number;
  maxSlope: number;
  convexity: string;
  avgConvexity: number;
  stdConvexity: number;
  minConvexity: number;
  maxConvexity: number;
  elevationUrl?: string;
  slopeUrl?: string;
  convexityUrl?: string;
}

export interface WeatherData {
  year: number;
  month: number;
  day: number;
  tempmin: number;
  tempmax: number;
  temp: number;
  precip: number;
  humidity: number;
  dew: number;
  gustSpeed: number;
  gustDir: number;
  windSpeed: number;
  windDir: number;
}

export interface ClimateData {
  weatherData: { [key in string]: WeatherData };
  firstFrost?: string | null;
  lastFrost?: string | null;
  growingSeasonLength?: number | null;
  cornHeatUnits?: Record<string, number>;
  GDD0?: Record<string, number>;
  GDD5?: Record<string, number>;
  GDD10?: Record<string, number>;
  GDD15?: Record<string, number>;
};

export type TypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Float32Array | Float64Array;
