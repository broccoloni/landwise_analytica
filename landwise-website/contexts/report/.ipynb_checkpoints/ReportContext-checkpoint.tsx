import {createContext} from 'react';
import type {Report} from '@/types/report';

export const defaultReport: Report = {
  address: null,
  addressComponents: null,
  area: null,
  createdAt: null,
  landGeometry: [],
  latitude: null,
  longitude: null,
  size: null,
  status: null,
  redeemedAt: null,
  reportId: null,
};

export interface ReportContextType extends Report {
  clearReportContext: () => void;
  handleUpdate: (report: Report) => void;
}

export const ReportContext = createContext<ReportContextType>({
  ...defaultReport,
  handleUpdate: (report: Report) => {},
  clearReportContext: () => {},
});