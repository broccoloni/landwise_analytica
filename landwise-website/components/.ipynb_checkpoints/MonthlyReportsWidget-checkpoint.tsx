'use client';

import React, { useState, useEffect } from "react";
import { Infinity } from "lucide-react";
import Container from "@/components/Container";
import InfoButton from "@/components/InfoButton";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { useReportsByCustomerId } from "@/hooks/useReports";
import Link from 'next/link';
import { getCouponName } from '@/utils/pricingTiers';

const MonthlyReportsWidget: React.FC = () => {
  const { data: session, status } = useSession();
  const [monthlyReports, setMonthlyReports] = useState<number | null>(null);
  const { reports, isLoading, error } = useReportsByCustomerId(session?.user?.id || null);

  useEffect(() => {
    if (reports && !isLoading) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Filter reports created this month
      const reportsThisMonth = reports.filter((report) => {
        const createdAt = new Date(report.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      });

      setMonthlyReports(reportsThisMonth.length);
    }
  }, [reports, isLoading]);

  const discount = getCouponName(monthlyReports);

  return (
    <Container className="bg-white w-full">
      <div className="flex justify-between items-center text-xl">
        <span>Reports Ordered This Month</span>
        <InfoButton>
          <div className="text-center text-lg">Reports Ordered</div>
          <div className="text-sm mt-2">
            Once the Pilot Program has ended, the more reports you buy in a month, the better the discount!
          </div>
          <div className="text-sm mt-2">
            Check out our prices 
            <Link
              href='/reports?tab=pricing'
              className="font-bold text-medium-green hover:underline ml-1"
            >
              here
            </Link>                        
          </div>
        </InfoButton>
      </div>
      <div className="flex text-4xl justify-center items-center p-4">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="mt-2 mb-4">{monthlyReports ?? 0}</div>
        )}
      </div>
      <div className="">
        {discount && (
          <div className="text-center text-lg">Discount: {discount}</div>
        )}
      </div>
    </Container>
  );
};

export default MonthlyReportsWidget;
