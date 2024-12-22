'use client';

import { montserrat, roboto, merriweather, raleway } from '@/ui/fonts';
import { useReportContext } from '@/contexts/ReportContext';
import { useCartContext } from '@/contexts/CartContext';
import { useEffect } from 'react';

export default function CheckoutComplete() {
  const reportContext = useReportContext();
  useEffect(() => {
    console.log("Report context:", reportContext);
  }, [reportContext]);

    
  const { quantity } = useCartContext();
            
  // Create api route to async generate new report and return a reportId immediately
  const reportId = 'XXXX-XXXX-XXXX';
  const reportId1 = 'XXXX-XXXX-XXXX';
  const reportId2 = 'YYYY-YYYY-YYYY';
  const reportId3 = 'ZZZZ-ZZZZ-ZZZZ';
        
  return (
    <div className={`${roboto.className} px-40 py-20`}>
      <div className="text-2xl text-center mb-12 font-bold">
        Thank You For Your Purchase!
      </div>
      <div className="">
        <div className="text-xl">
          {quantity === 1 ? (
            <div className="">Your Report ID: {reportId}</div>
          ) : quantity === 3 ? (
            <div className="flex-row">
              <div className="">Your Report IDs:</div>
              <div className="ml-2">{reportId1}</div>
              <div className="ml-2">{reportId2}</div>
              <div className="ml-2">{reportId3}</div>
            </div>
          ) : (
            <div className="">Report quantity not found</div>
          )}
        </div>
        {reportContext.address ? (
          <div className="my-4">
            <div className="">
              Your report for {reportContext.address} may take a few minutes to process.
            </div>
            <div className="">
              
            </div>
          </div>
        ) : (
          <div className="my-4">No address</div>
        )}
      </div>
    </div>
  );
}
