import { ReportSize, reportSizeLabels, reportSizeAcres } from '@/types/reportSizes';

export const sqMetersPerAcre = 4046.8565;

const getSizeFromAcres = (acres: number | null): ReportSize => {
  if (acres === null) return null;

  for (let i = 0; i < reportSizeAcres.length; i++) {
    if (acres <= reportSizeAcres[i]) {
      return reportSizeLabels[i];
    }
  }
  return reportSizeLabels.slice(-1)[0];
};

export const getSizeFromSqM = (area: number | null): ReportSize => {
  if (area === null) return null;

  const acres = Math.round(area / sqMetersPerAcre);
  return getSizeFromAcres(acres);
};

export const getAcresFromSize = (size: ReportSize): number => {
  const labelIndex = reportSizeLabels.indexOf(size);
  return reportSizeAcres[labelIndex];
};

export const isValidSize = (reportSize: string | null, propertySize: string | null) => {    
  if (reportSize === null || propertySize === null) return false;
  if (!reportSizeLabels.includes(propertySize as ReportSize) || !reportSizeLabels.includes(reportSize as ReportSize)) return false;
  return reportSizeLabels.indexOf(propertySize as ReportSize) <= reportSizeLabels.indexOf(reportSize as ReportSize);
}

export const isValidReport = (data: any) => {
    const {
      address, 
      addressComponents,
      bbox,
      climateData,
      createdAt,
      cropHeatMapData,
      elevationData,
      growingSeasonData,
      heatUnitData,
      historicData,
      landGeometry,
      landUseData,
      latitude,
      longitude,
      projectedData,
      redeemedAt,
      reportId,
      soilData,
      status,
      windData,
    } = data;

    // Note that createdAt is ommitted, might add later

    // Currently ommitting historicData, cropHeatMapData, and projectedData
    if (!address || !addressComponents || !bbox || !climateData || !elevationData || !growingSeasonData || !heatUnitData || !landGeometry || !landUseData || !latitude || !longitude || !redeemedAt || !reportId || !soilData || !status || !windData) {
      console.log("Missing generic");
      console.log(data);

      return false;
    }

    if (typeof addressComponents !== 'object' || Object.keys(addressComponents).lenth <= 1) {
      console.log("Bad Add Comp");
      return false;
    }

    if (!Array.isArray(bbox) || bbox.length !== 2) {
      return false;
    }

    if (!Array.isArray(bbox[0]) || bbox[0].length !== 2) {
      return false;
    }

    if (!Array.isArray(bbox[1]) || bbox[1].length !== 2) {
      return false;
    }

    if (typeof climateData !== 'object' || Object.keys(climateData).lenth <= 1) {
      console.log("Bad Climate");
      return false;
    }

    const climateData0 = Object.values(climateData)[0];
    if (!climateData0?.precip) {
      console.log("Bad Climate Deep");
      return false;
    }

    return true;
};

export const fetchReportsBySessionId = async (sessionId: string) => {
  try {
    const response = await fetch("/api/getReports/bySessionId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    const result = await response.json();

    if (response.ok) {
      return result.reports;
    } else {
      throw new Error(result.message || "Failed to fetch reports.");
    }
  } catch (err) {
    throw new Error(`Error fetching reports: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export const fetchReportsById = async (reportId: string) => {
  try {
    const response = await fetch("/api/getReports/byId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId }),
    });

    const result = await response.json();

    if (response.ok) {
      return result.reports;
    } else {
      throw new Error(result.message || "Failed to fetch reports.");
    }
  } catch (err) {
    throw new Error(`Error fetching reports: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export const fetchReportsByCustomerId = async (customerId: string) => {
  try {
    const response = await fetch("/api/getReports/byCustomerId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });

    const result = await response.json();

    if (response.ok) {
      return result.reports;
    } else {
      throw new Error(result.message || "Failed to fetch reports.");
    }
  } catch (err) {
    throw new Error(`Error fetching reports: ${err instanceof Error ? err.message : String(err)}`);
  }
};

// utils/redeemReport.ts

export interface RedeemReportParams {
  reportId: string;
  address: string;
  addressComponents: Record<string, any>;
  landGeometry: number[][];
}

export async function redeemReport({
  reportId,
  address,
  addressComponents,
  landGeometry,
}: RedeemReportParams): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/redeemReport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reportId, address, addressComponents, landGeometry }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      console.error('Error redeeming report:', errorData.message);
      return { success: false, message: errorData.message };
    }
  } catch (error) {
    console.error('Error redeeming report:', error);
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}


