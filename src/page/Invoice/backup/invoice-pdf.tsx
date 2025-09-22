"use client";

import { InvoiceData } from "@/types/invoice";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 12,
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
    textAlign: "center",
    color: "#1e3a8a",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
    color: "#4b5563",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
    padding: 5,
    color: "#1f2937",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  col: {
    flex: 1,
  },
  label: {
    fontWeight: 700,
    marginRight: 5,
    color: "#4b5563",
  },
  value: {
    color: "#1f2937",
  },
  table: {
    style: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: 700,
    padding: 5,
    color: "#1f2937",
  },
  tableCell: {
    padding: 5,
  },
  col20: {
    width: "20%",
  },
  col25: {
    width: "25%",
  },
  col30: {
    width: "30%",
  },
  col40: {
    width: "40%",
  },
  col50: {
    width: "50%",
  },
  col60: {
    width: "60%",
  },
  col70: {
    width: "70%",
  },
  col80: {
    width: "80%",
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 5,
  },
  notesTitle: {
    fontWeight: 700,
    marginBottom: 5,
    color: "#4b5563",
  },
  total: {
    marginTop: 20,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  grandTotal: {
    fontWeight: 700,
    fontSize: 16,
    color: "#1e3a8a",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
  },
});

interface InvoicePDFProps {
  invoice: InvoiceData;
}

export default function InvoicePDF({ invoice }: InvoicePDFProps) {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>RENTAL INVOICE</Text>
          <Text style={styles.subtitle}>
            Invoice #: INV-{invoice.contractCode}-
            {format(new Date(), "yyyyMMdd")}
          </Text>
          <Text style={styles.subtitle}>
            Date: {format(new Date(), "MMMM dd, yyyy")}
          </Text>
        </View>

        {/* Tenant & Room Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tenant & Room Information</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>Tenant Name:</Text>
                <Text style={styles.value}>{invoice.tenantName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Contract Code:</Text>
                <Text style={styles.value}>{invoice.contractCode}</Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>Building Code:</Text>
                <Text style={styles.value}>{invoice.buildingCode}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Room Number:</Text>
                <Text style={styles.value}>{invoice.roomNumber}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Invoice Period */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Period</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>From Date:</Text>
                <Text style={styles.value}>
                  {format(new Date(invoice.fromDate), "MMMM dd, yyyy")}
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>To Date:</Text>
                <Text style={styles.value}>
                  {format(new Date(invoice.toDate), "MMMM dd, yyyy")}
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>Number of Days:</Text>
                <Text style={styles.value}>{invoice.numberOfDays}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Charges Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Charges</Text>

          {/* Table Header */}
          <View style={[styles.table]}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.col40]}>Item</Text>
              <Text style={[styles.tableCell, styles.col20]}>Quantity</Text>
              <Text style={[styles.tableCell, styles.col20]}>Rate</Text>
              <Text style={[styles.tableCell, styles.col20]}>Amount</Text>
            </View>

            {/* Room Fee */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col40]}>Room Fee</Text>
              <Text style={[styles.tableCell, styles.col20]}>
                {invoice.numberOfDays} days
              </Text>
              <Text style={[styles.tableCell, styles.col20]}>
                {Math.round(invoice.roomPrice / 30).toLocaleString()} VND/day
              </Text>
              <Text style={[styles.tableCell, styles.col20]}>
                {Math.round(
                  (invoice.roomPrice / 30) * invoice.numberOfDays
                ).toLocaleString()}{" "}
                VND
              </Text>
            </View>

            {/* Electricity */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col40]}>Electricity</Text>
              <Text style={[styles.tableCell, styles.col20]}>
                {invoice.electricityUsage} kWh
              </Text>
              <Text style={[styles.tableCell, styles.col20]}>
                {invoice.electricityRate.toLocaleString()} VND/kWh
              </Text>
              <Text style={[styles.tableCell, styles.col20]}>
                {invoice.electricityTotal.toLocaleString()} VND
              </Text>
            </View>

            {/* Water */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col40]}>
                Water{" "}
                {invoice.waterCalculationMethod === "meter"
                  ? "(by meter)"
                  : "(by people)"}
              </Text>
              <Text style={[styles.tableCell, styles.col20]}>
                {invoice.waterCalculationMethod === "meter"
                  ? `${invoice.waterUsage} m³`
                  : `${invoice.numberOfPeople} people`}
              </Text>
              <Text style={[styles.tableCell, styles.col20]}>
                {invoice.waterRate.toLocaleString()} VND/
                {invoice.waterCalculationMethod === "meter" ? "m³" : "person"}
              </Text>
              <Text style={[styles.tableCell, styles.col20]}>
                {invoice.waterTotal.toLocaleString()} VND
              </Text>
            </View>

            {/* Services */}
            {invoice.services
              .filter((service) => service.quantity > 0)
              .map((service, index) => (
                <View
                  key={index}
                  style={styles.tableRow}
                >
                  <Text style={[styles.tableCell, styles.col40]}>
                    {service.name}
                  </Text>
                  <Text style={[styles.tableCell, styles.col20]}>
                    {service.quantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.col20]}>
                    {service.unitPrice.toLocaleString()} VND
                  </Text>
                  <Text style={[styles.tableCell, styles.col20]}>
                    {service.total.toLocaleString()} VND
                  </Text>
                </View>
              ))}
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {/* Total */}
        <View style={styles.total}>
          <View style={[styles.totalRow, { marginTop: 10 }]}>
            <Text style={styles.grandTotal}>GRAND TOTAL:</Text>
            <Text style={styles.grandTotal}>
              {invoice.grandTotal.toLocaleString()} VND
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>Payment due within 7 days of invoice date.</Text>
        </View>
      </Page>
    </Document>
  );
}
