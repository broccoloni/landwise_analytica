import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import Loading from "@/components/Loading";
import InfoButton from '@/components/InfoButton';
import { roboto } from '@/ui/fonts';
import Link from 'next/link';

interface DownloadButtonProps {
  reportId: string | null;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ reportId }) => {
  const [isDomReady, setIsDomReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const checkDomReady = () => {
      if (document.readyState === "complete") {
        setIsDomReady(true);
      } else {
        const onLoadHandler = () => setIsDomReady(true);
        window.addEventListener("load", onLoadHandler);
        return () => window.removeEventListener("load", onLoadHandler);
      }
    };

    checkDomReady();
  }, []);

  const handleJSON = async () => {
    if (!isDomReady || !reportId) return;

    try {
      setIsDownloading(true);

      const response = await fetch(
        reportId === "XXXX-XXXX-XXXX" ? "/demoData.json" : "/api/getReportData",
        reportId === "XXXX-XXXX-XXXX"
          ? undefined
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reportId }),
            }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch report: ${response.status} ${response.statusText}`
        );
      }

      
      const data = await response.json();

      const report = reportId === "XXXX-XXXX-XXXX" ? data : data.report;

      if (!report) {
        throw new Error("Report data is missing in the response");
      }

      const jsonString = JSON.stringify(report, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${reportId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error downloading report:",
        error instanceof Error ? error.message : error
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isDomReady) return null;

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleJSON}
        className={`flex items-center justify-center px-4 py-2 bg-medium-brown text-white rounded mr-4 
          ${isDownloading ? "opacity-50 cursor-not-allowed" : "hover:opacity-75"}
        `}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <Loading className="h-5 w-5 mr-2 text-white my-auto" />
            <span className="text-lg">Downloading...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5 mr-2" />
            <span className="text-lg">Download</span>
          </>
        )}
      </button>
      <InfoButton>
        <div className={`${roboto.className} text-center text-lg mb-4`}>Report Download</div>
        <div className="mb-4">
          Reports are downloaded in JSON format. Once downloaded, you can view your report 
          <Link
            href='/view-downloaded-report'
            className="font-bold text-medium-green hover:underline ml-1"
          >
            here
          </Link>
        </div>
        <div className="mb-4">
          Reports expire 180 days after they are redeemed, be sure to download your report before that time for continued viewing.
        </div>
        <div>
          For more information, see our 
          <Link
            href='/faqs'
            className="font-bold text-medium-green hover:underline mx-1"
          >
            FAQs
          </Link>
          or
          <Link
            href='/contact'
            className="font-bold text-medium-green hover:underline ml-1"
          >
            contact us
          </Link>           
        </div>
      </InfoButton>
    </div>
  );
};

export default DownloadButton;
