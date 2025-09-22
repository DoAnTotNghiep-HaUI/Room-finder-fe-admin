"use client";

import { useState } from "react";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { FiPrinter, FiDownload } from "react-icons/fi";
import type { InvoiceData } from "@/types/invoice";
import InvoiceForm from "./invoice-form";
import InvoicePDF from "./invoice-pdf";

export default function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleInvoiceSubmit = (data: InvoiceData) => {
    setInvoiceData(data);
    setIsGeneratingPDF(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Rental Invoice Generator
        </h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <InvoiceForm onSubmit={handleInvoiceSubmit} />
          </div>
        </div>

        {invoiceData && isGeneratingPDF && (
          <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Invoice Preview
              </h2>
              <div className="flex space-x-4">
                <PDFDownloadLink
                  document={<InvoicePDF invoice={invoiceData} />}
                  fileName={`invoice-${invoiceData.contractCode}.pdf`}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {({ loading, error }) =>
                    loading ? (
                      "Generating PDF..."
                    ) : (
                      <>
                        <FiDownload className="mr-2" />
                        Download PDF
                      </>
                    )
                  }
                </PDFDownloadLink>

                <button
                  onClick={() => {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(
                        "<html><head><title>Print Invoice</title></head><body>"
                      );
                      printWindow.document.write(
                        '<div id="print-container"></div>'
                      );
                      printWindow.document.write("</body></html>");
                      printWindow.document.close();

                      // We would normally render the PDF here, but for simplicity we'll just show a message
                      const container =
                        printWindow.document.getElementById("print-container");
                      if (container) {
                        container.innerHTML = "<p>Printing invoice...</p>";
                      }

                      printWindow.print();
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FiPrinter className="mr-2" />
                  Print
                </button>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-center text-gray-500">
                PDF preview would appear here in a real implementation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
