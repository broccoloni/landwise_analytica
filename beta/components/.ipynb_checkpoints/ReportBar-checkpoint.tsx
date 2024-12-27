import React from "react";
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { ArrowRight } from 'lucide-react';
import { ReportStatus } from "@/types/statuses";
import { montserrat } from '@/ui/fonts';
import { useReportContext } from '@/contexts/ReportContext';

// Helper function to calculate days left
const calculateDaysLeft = (createdAt: string): number => {
  const createdDate = new Date(createdAt);
  const expirationDate = new Date(createdDate);
  expirationDate.setDate(createdDate.getDate() + 180); // 180 days after createdAt
  const currentDate = new Date();
  const timeDifference = expirationDate.getTime() - currentDate.getTime();
  const daysLeft = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert ms to days
  return daysLeft >= 0 ? daysLeft : 0; // Return 0 if the report is expired
};

interface Report {
  reportId: string;
  status: string;
  createdAt: string;
}

interface ReportBarProps {
  report: Report;
}

const ReportBar: React.FC<ReportBarProps> = ({ report }) => {
  const router = useRouter();
  const { setReportId, setStatus, clearReportContext} = useReportContext();

  // Pre-redirect logic for unredeemed reports
  const handleRedeemClick = () => {
    clearReportContext();
    setReportId(report.reportId);
    setStatus(report.status);
    router.push('/redeem-a-report');
  };

  const handleViewClick = () => {
    clearReportContext();
    setReportId(report.reportId);
    setStatus(report.status);

    // NOTE: This should probably change when merging view-report and view-realtor-report 
    // using header and sub-header that depend on logged in status
    router.push('/view-realtor-report');  
  };

  if (report.status === ReportStatus.Unredeemed) {
    return (
      <div onClick={handleRedeemClick}>
        <Container className="hover:border-black">
          <div className="flex justify-between items-center">
            <div className="flex text-lg">
              <div className="mr-2 font-semibold">Report ID:</div>
              <div className={`font-normal ${montserrat.className}`}>{report.reportId}</div>
            </div>
            <div className="flex justify-center items-center">
              <div className="mr-2">Redeem Now</div>
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(report.createdAt);

  return (
    <div onClick={handleViewClick}>
      <Container className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-md mb-4 hover:border-black">
        <div className="flex flex-col">
          <div className="text-lg"><span className="font-semibold mr-2">Report ID:</span>{report.reportId}</div>
          <span className="text-sm text-gray-500">Address: {report.address}</span>
          <span className="text-sm text-gray-500">
            Created: {new Date(report.redeemedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex flex-col items-end text-center">
          <div className="text-xl flex justify-center items-center p-2">View Now<ArrowRight className="h-6 w-6 ml-2" /></div>
          <div className="text-md font-semibold text-dark-green w-full">Days Left: {daysLeft}</div>
        </div>
      </Container>
    </div>
  );
};

export default ReportBar;
