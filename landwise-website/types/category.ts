export interface CategoryProps {
  lat: string;
  lng: string;
  historicalLandUse: Record<number, LandUseData> | null;
  elevationData: ElevationData | null;
  cropData: any,
  climateData: Record<number, ClimateData>;
  score: number | null;
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
}

export interface LandUseData {
  landUseData?: (number|null)[];
  height?: number;
  width?: number;
  imageUrl?: string;
  legend?: Record<string, string>;
  cropArea?: number;
  area?: number;
  counts?: Record<number, number>;
};

export interface ElevationData {
  aspect: (number|null)[];
  width: number;
  height: number;
  elevation: (number|null)[];
  avgElevation: number;
  stdElevation: number;
  minElevation: number;
  maxElevation: number;
  slope: (number|null)[];
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
  dayOfYear: number;
  dateStr: string;
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
  weatherData?: Record<string, WeatherData>;
  firstFrost?: string | null;
  lastFrost?: string | null;
  growingSeasonLength?: number | null;
  chu?: Record<number, Record<string, number>>;
  gdd0?: Record<number, Record<string, number>>;
  gdd5?: Record<number, Record<string, number>>;
  gdd10?: Record<number, Record<string, number>>;
  gdd15?: Record<number, Record<string, number>>;
};

export interface WindData {
  windExposureUrl: string,
  minWindExposure: number,
  maxWindExposure: number,
  avgWindSpeed: number,
  stdWindSpeed: number,
  avgWindDir: number,
  stdWindDir: number,
  gustExposureUrl: string,
  minGustExposure: number,
  maxGustExposure: number,
  avgGustSpeed: number,
  stdGustSpeed: number,
  avgGustDir: number,
  stdGustDir: number,
};

export type TypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Float32Array | Float64Array;
