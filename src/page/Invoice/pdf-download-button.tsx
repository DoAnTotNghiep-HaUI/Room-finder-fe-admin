"use client";
import { IInvoice } from "@/types/invoice";
import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";

interface PDFDownloadButtonProps {
  invoice: IInvoice;
}

export default function PDFDownloadButton({ invoice }: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [PDFComponents, setPDFComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    const loadPDFComponents = async () => {
      try {
        const [pdfRenderer, invoicePDF] = await Promise.all([
          import("@react-pdf/renderer"),
          import("./invoice-pdf"),
        ]);
        setPDFComponents({
          PDFDownloadLink: pdfRenderer.PDFDownloadLink,
          InvoicePDF: invoicePDF.default,
        });
      } catch (error) {
        console.error("Failed to load PDF components:", error);
      }
    };

    loadPDFComponents();
  }, []);

  if (!isClient || !PDFComponents) {
    return (
      <button
        disabled
        className="flex items-center px-3 py-1 text-sm bg-gray-400 text-white rounded cursor-not-allowed"
      >
        <FiDownload className="mr-1" />
        Loading...
      </button>
    );
  }

  const { PDFDownloadLink, InvoicePDF } = PDFComponents;

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={`invoice-${
        invoice.contract.contract_number || invoice.invoice_number
      }.pdf`}
      className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
    >
      {({ loading, error }) =>
        loading ? (
          "Generating PDF..."
        ) : (
          <>
            <FiDownload className="mr-1" />
            Tải PDF
          </>
        )
      }
    </PDFDownloadLink>
  );
}
