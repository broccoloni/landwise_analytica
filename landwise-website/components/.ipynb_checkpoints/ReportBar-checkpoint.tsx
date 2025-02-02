'use client'; // This is important because we are calling new Date, which could cause a hydration error otherwise

import React, { useContext } from "react";
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { ArrowRight } from 'lucide-react';
import { ReportStatus } from "@/types/statuses";
import { montserrat } from '@/ui/fonts';
import { ReportContext } from '@/contexts/report/ReportContext';

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
  address: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  redeemedAt: string | null;
}

interface ReportBarProps {
  report: Report;
}

const ReportBar: React.FC<ReportBarProps> = ({ report }) => {
  const router = useRouter();
  const { clearReportContext } = useContext(ReportContext);

  // Pre-redirect logic for unredeemed reports
  const handleRedeemClick = () => {
    clearReportContext();
    router.push(`/redeem-a-report?reportId=${report.reportId}`);
  };

  const handleViewClick = () => {
    clearReportContext();
    router.push(`/view-report/${report.reportId}`);  
  };

  if (report.status === ReportStatus.Unredeemed) {
    return (
      <div onClick={handleRedeemClick}>
        <Container className="bg-white  shadow-md hover:border-black dark:bg-dark-gray-d dark:border-dark-gray-b dark:hover:border-white">
          <div className="flex-row lg:flex justify-between items-center">
            <div className="flex-row sm:flex text-center justify-center items-center text-lg">
              <div className="mr-2 font-semibold">Report ID:</div>
              <div className={`font-normal ${montserrat.className}`}>{report.reportId}</div>
            </div>
            <div className="flex justify-center items-center mt-4 lg:mt-0">
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
    <div onClick={handleViewClick} className="w-full">
      <Container className="w-full flex justify-between items-center p-4 bg-white dark:bg-dark-gray-d rounded-md shadow-md mb-4 hover:border-gray-800 dark:border-dark-gray-b dark:hover:border-white">
        <div className="w-full flex-row md:flex justify-between">
          <div className="flex-row">
            <div className="flex-row sm:flex text-center justify-center items-center text-lg mb-2 md:text-left md:justify-start">
              <div className="mr-2 font-semibold">Report ID:</div>
              <div className={`font-normal ${montserrat.className}`}>{report.reportId}</div>
            </div>
            <div className="flex-row sm:flex text-sm">
              <div className="mr-2 font-semibold">Address:</div>
              <div className={`font-normal ${montserrat.className}`}>{report.address}</div>
            </div>
            <div className="flex text-center text-sm">
              <div className="mr-2 font-semibold">Created:</div>
              <div className={`font-normal ${montserrat.className}`}>
                {report.redeemedAt ? new Date(report.redeemedAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex-row text-center mt-4 md:mt-0">
            <div className="text-xl flex justify-center items-center p-2">View Now<ArrowRight className="h-6 w-6 ml-2" /></div>
            <div className="text-md font-semibold text-dark-green dark:text-medium-green w-full">Days Left: {daysLeft}</div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ReportBar;
