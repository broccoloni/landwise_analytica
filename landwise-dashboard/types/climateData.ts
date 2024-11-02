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

export interface ClimateData = {
  weatherData: WeatherData[];
  firstFrost: string | null;
  lastFrost: string | null;
  growingSeasonLength: number | null;
  cornHeatUnits: number;
  GDD0: number;
  GDD5: number;
  GDD10: number;
  GDD15: number;
};