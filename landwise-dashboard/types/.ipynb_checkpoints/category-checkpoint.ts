export interface CategoryProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
  weatherData: any;
  score: number | null;
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
}