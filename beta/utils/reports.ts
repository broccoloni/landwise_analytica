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
      console.error('Error redeeming report:', response.message);
      return { success: false, message: response.message };
    }
  } catch (error) {
    console.error('Error redeeming report:', error);
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}

