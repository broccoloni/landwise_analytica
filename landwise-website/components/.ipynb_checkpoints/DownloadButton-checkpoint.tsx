import React, { useState, useEffect } from "react";
import { FileText, ChevronDown } from "lucide-react";

interface DownloadButtonProps {
  reportId: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  address: string | null;
  addressComponents: any; // Adjust type if necessary
  landGeometry: number[][]; // Adjust type if necessary
  status: string | null;
  redeemedAt: string | null;
  createdAt: string | null;
  bbox: number[][] | null; // Adjust type if necessary
  heatUnitData: any; // Adjust type if necessary
  growingSeasonData: any; // Adjust type if necessary
  climateData: any; // Adjust type if necessary
  elevationData: any; // Adjust type if necessary
  landUseData: any; // Adjust type if necessary
  soilData: any; // Adjust type if necessary
  historicData: any; // Adjust type if necessary
  projectedData: any; // Adjust type if necessary
  cropHeatMapData: any; // Adjust type if necessary
}


const DownloadButton: React.FC<DownloadButtonProps> = ({
  reportId,
  latitude,
  longitude,
  address,
  addressComponents,
  landGeometry,
  status,
  redeemedAt,
  createdAt,
  bbox,
  heatUnitData,
  growingSeasonData,
  climateData,
  elevationData,
  landUseData,
  soilData,
  historicData,
  projectedData,
  cropHeatMapData,
}) => {
  const [isDomReady, setIsDomReady] = useState(false);

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

  // const handlePDF = async () => {
  //   try {
  //     const response = await fetch("/api/generatePDF", {  // Make sure this matches the backend route
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         reportId,
  //         latitude,
  //         longitude,
  //         address,
  //         addressComponents,
  //         landGeometry,
  //         status,
  //         redeemedAt,
  //         createdAt,
  //         bbox,
  //         heatUnitData,
  //         growingSeasonData,
  //         climateData,
  //         elevationData,
  //         landUseData,
  //         soilData,
  //         historicData,
  //         projectedData,
  //         cropHeatMapData,
  //       }),
  //     });

  //     if (response.ok) {
  //       const blob = await response.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = `report-${reportId}.pdf`;
  //       link.click();
  //       window.URL.revokeObjectURL(url);
  //     } else {
  //       console.error("Failed to generate PDF");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const handleJSON = async () => {
    if (!isDomReady || !reportId) return;

    const data = {
      reportId,
      latitude,
      longitude,
      address,
      addressComponents,
      landGeometry,
      status,
      redeemedAt,
      createdAt,
      bbox,
      heatUnitData,
      growingSeasonData,
      climateData,
      elevationData,
      landUseData,
      soilData,
      historicData,
      projectedData,
      cropHeatMapData,
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${reportId}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!isDomReady) {
    return null;
  }

  return (
    <button
      onClick={handleJSON}
      className="flex items-center justify-center px-4 py-2 bg-medium-brown text-white rounded hover:opacity-75"
    >
      <FileText className="w-5 h-5 mr-2" />
      <span className="text-left text-lg">Download</span>
    </button>
  );

  // dropdown display for download as JSON and as PDF

  // return (
  //   <div className="relative inline-block group">
  //     <div className="pl-4 pr-2 py-2 bg-medium-brown text-white rounded hover:opacity-75">
  //       <div className="flex items-center cursor-pointer">
  //         <FileText className="w-5 h-5 mr-2" />
  //         <span className="text-left text-lg">Download</span>
  //         <ChevronDown className="w-5 h-5 ml-2 group-hover:rotate-180 transition-all" />
  //       </div>
  //     </div>

  //     {/* Dropdown Menu */}
  //     <ul className="absolute text-md left-0 top-full hidden group-hover:block w-full bg-white border border-gray-300 text-black rounded shadow-lg mt-0 z-10">
  //       <li className="py-2 px-4 text-left cursor-pointer hover:bg-gray-200 hover:text-black border-b border-gray-200">
  //         <button onClick={handlePDF}>as PDF</button>
  //       </li>
  //       <li className="py-2 px-4 text-left cursor-pointer hover:bg-gray-200 hover:text-black">
  //         <button onClick={handleJSON}>as JSON</button>
  //       </li>
  //     </ul>
  //   </div>
  // );
};

export default DownloadButton;
