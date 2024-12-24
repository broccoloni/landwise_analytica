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
  const { setReportId, setLandGeometry, setAddress, setLatitude, setLongitude, setAddressComponents, setStatus } = useReportContext();

  // Pre-redirect logic for unredeemed reports
  const handleRedeemClick = () => {
    setReportId(report.id);
    setAddress(null);
    setLatitude(null);
    setLongitude(null);
    setAddressComponents(null);
    setLandGeometry([]);
    setStatus(report.status);
    router.push('/redeem-a-report');
  };

  if (report.status === ReportStatus.Unredeemed) {
    return (
      <div onClick={handleRedeemClick}>
        <Container className="hover:border-black">
          <div className="flex justify-between items-center">
            <div className="flex text-lg font-semibold">
              <div className="mr-2">Report ID:</div>
              <div className={`font-normal ${montserrat.className}`}>{report.id}</div>
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
    <Container className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-md mb-4">
      <div className="flex flex-col">
        <span className="text-lg font-semibold">Report ID: {report.reportId}</span>
        <span className="text-sm text-gray-500">Status: {report.status}</span>
        <span className="text-sm text-gray-500">
          Created: {new Date(report.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-lg font-semibold text-dark-green">Days Left: {daysLeft}</span>
      </div>
    </Container>
  );
};

export default ReportBar;
