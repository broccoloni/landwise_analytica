export type ReportSize = 'small' | 'medium' | 'large' | 'xlarge' | 'jumbo' | null;

export interface Report {
  address: string | null;
  addressComponents: Record<string, string> | null;
  area: number | null;
  createdAt: string | null;
  landGeometry: number[][];
  latitude: number | string | null;
  longitude: number | string | null;
  size: ReportSize;
  status: string | null;
  redeemedAt: string | null;
  reportId: string | null;

  clearReportContext: () => void;
  handleUpdate: (report: Report) => void;
}