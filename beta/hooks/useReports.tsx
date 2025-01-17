import { useState, useEffect } from "react";

export const useReportsById = (reportId: string) => {
  const [reports, setReports] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      setError("reportId must be provided.");
      setIsLoading(false);
      return;
    }

    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/getReports/byId", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportId }),
        });

        const result = await response.json();

        if (response.ok) {
          setReports(result.reports || []);
        } else {
          setError(result.message || "Failed to fetch reports.");
        }
      } catch (err) {
        setError(`Error fetching reports: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [reportId]);

  return { reports, isLoading, error };
};

export const useReportsByCustomerId = (customerId: string) => {
  const [reports, setReports] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setError("customerId must be provided.");
      setIsLoading(false);
      return;
    }

    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/getReports/byCustomerId", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId }),
        });

        const result = await response.json();

        if (response.ok) {
          setReports(result.reports || []);
        } else {
          setError(result.message || "Failed to fetch reports.");
        }
      } catch (err) {
        setError(`Error fetching reports: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [customerId]);

  return { reports, isLoading, error };
};

export const useReportsBySessionId = (sessionId: string) => {
  const [reports, setReports] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    
  useEffect(() => {
    if (!sessionId) {
      setError("sessionId must be provided.");
      setIsLoading(false);
      return;
    }

    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/getReports/bySessionId", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const result = await response.json();

        console.log("(useReports-bySessionId)", result);

        if (response.ok) {
          if (result.reports.length > 0) {
            setReports(result.reports);
          }
        } else {
          setError(result.message || "Failed to fetch reports.");
        }
      } catch (err) {
        setError(`Error fetching reports: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [sessionId]);

  return { reports, isLoading, error };
};

