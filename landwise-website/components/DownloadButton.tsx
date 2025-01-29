import React, { useState, useEffect } from "react";
import { FileText, ChevronDown } from "lucide-react";

interface DownloadButtonProps {
  reportId: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  address: string | null;
  addressComponents: any; 
  landGeometry: number[][]; 
  status: string | null;
  redeemedAt: string | null;
  createdAt: string | null;
  bbox: number[][] | null; 
  heatUnitData: any; 
  growingSeasonData: any; 
  climateData: any; 
  elevationData: any; 
  landUseData: any; 
  soilData: any; 
  historicData: any; 
  projectedData: any; 
  cropHeatMapData: any;
  windData: any;
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
  windData,
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
      windData,
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
};

export default DownloadButton;
