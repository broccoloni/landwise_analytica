import React, { useState, useEffect } from "react";
import Container from "@/components/Container";
import InfoButton from "@/components/InfoButton";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { useReportsByCustomerId } from "@/hooks/useReports";

const ExpiringReportsWidget: React.FC = () => {
  const { data: session, status } = useSession();
  const [expiringReports, setExpiringReports] = useState<number | null>(null);
  const [totalReports, setTotalReports] = useState<number | null>(null);
  const { reports, isLoading, error } = useReportsByCustomerId(session?.user?.id || null);

  useEffect(() => {
    if (reports && !isLoading) {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the current week (Sunday)
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // End of the current week (Saturday)

      // Filter reports expiring this week
      const reportsExpiringThisWeek = reports.filter((report) => {
        const redeemedAt = new Date(report.redeemedAt);
        const expirationDate = new Date(redeemedAt);
        expirationDate.setDate(expirationDate.getDate() + 180); // Add 180 days to redeemedAt

        // Check if expirationDate is within this week
        return expirationDate >= startOfWeek && expirationDate <= endOfWeek;
      });

      setExpiringReports(reportsExpiringThisWeek.length);
      setTotalReports(reports.length); // Total number of reports
    }
  }, [reports, isLoading]);

  return (
    <Container className="bg-white w-full">
      <div className="flex justify-between items-center text-xl">
        <span>Reports Expiring This Week</span>
        <InfoButton>
          <div className="text-center text-lg">Report Expiration</div>
          <div className="text-sm">
            Once ordered, reports expire after 180 days. To continue viewing your report, you can download a PDF. If you prefer the dynamic display provided on our website, you can also download the report in JSON format and upload the data for viewing.
          </div>
        </InfoButton>
      </div>
      <div className="flex text-4xl justify-center items-center p-4">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="mb-4 mr-2">{expiringReports ?? 0}</div>
            <div className="my-2">/</div>
            <div className="mt-4 ml-2">{totalReports ?? 0}</div>
          </>
        )}
      </div>
    </Container>
  );
};

export default ExpiringReportsWidget;
