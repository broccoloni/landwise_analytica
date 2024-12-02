'use client';
import React, { useState, useEffect } from "react";
import { FileText } from 'lucide-react';

const DownloadPDFButton = ({ elementId, fileName = "document.pdf" }) => {
  const [isDomReady, setIsDomReady] = useState(false);

  useEffect(() => {
    const checkDomReady = () => {
      if (document.readyState === "complete") {
        setIsDomReady(true);
      } else {
        window.addEventListener("load", () => setIsDomReady(true));
      }
    };

    checkDomReady();

    // Cleanup
    return () => {
      window.removeEventListener("load", () => setIsDomReady(true));
    };
  }, []);

  const handleDownloadPDF = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID "${elementId}" not found.`);
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!isDomReady) {
    return null; // Don't render the button until the DOM is ready
  }

  return (
    <button
      className="px-4 py-2 bg-medium-brown text-white rounded hover:opacity-75 flex"
      onClick={handleDownloadPDF}
    >
      <FileText className="w-5 h-5 mr-2" />
      Download PDF
    </button>
  );
};

export default DownloadPDFButton;
