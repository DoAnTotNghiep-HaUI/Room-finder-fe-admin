import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { IInvoice } from "@/types/invoice";
import MDEditor from "@uiw/react-md-editor";
import MarkdownRenderer from "./markdown-render";
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
// Định nghĩa style cho PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 11,
    padding: 30,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    style: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    // width: "25%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    fontWeight: "bold",
    padding: 4,
  },
  tableCol: {
    // width: "25%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 4,
  },
  col10: {
    width: "10%",
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
  right: {
    textAlign: "right",
  },
  center: {
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: "center",
  },
  signRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    fontWeight: "bold",
  },
});

// Format helpers
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN").format(amount);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const getCurrentMonth = (dateStr: string) => {
  const d = new Date(dateStr);
  return `Tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
};

export default function InvoicePDFDocument({ invoice }: { invoice: IInvoice }) {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        {/* Header */}
        <Text style={styles.title}>THÔNG BÁO HÓA ĐƠN</Text>
        <Text style={styles.subtitle}>
          {getCurrentMonth(invoice.from_date)}
        </Text>

        {/* Thông tin chung */}
        <View style={styles.section}>
          <Text>
            Từ ngày{" "}
            <Text style={styles.bold}>{formatDate(invoice.from_date)}</Text> đến
            ngày <Text style={styles.bold}>{formatDate(invoice.to_date)}</Text>
          </Text>
        </View>

        <View
          style={[
            styles.section,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <View>
            <Text>
              Họ và tên khách hàng:{" "}
              <Text style={[styles.bold, { fontSize: 12 }]}>
                {invoice.contract.tenant.first_name}{" "}
                {invoice.contract.tenant.last_name}
              </Text>
            </Text>
            <Text>
              Nhà:{" "}
              <Text style={styles.bold}>
                {invoice.contract.room.building.name}
              </Text>
            </Text>
            <Text>
              Số phòng:{" "}
              <Text style={styles.bold}>
                {invoice.contract.room.number_room}
              </Text>
            </Text>
            <Text>
              Mã hợp đồng:{" "}
              <Text style={styles.bold}>
                {invoice.contract.contract_number}
              </Text>
            </Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <View
              style={{
                backgroundColor: "#f6e05e",
                padding: 6,
                borderRadius: 2,
              }}
            >
              <Text style={[styles.bold, { fontSize: 12 }]}>
                {invoice.invoice_number}
              </Text>
              <Text>{formatDate(invoice.date_created)}</Text>
            </View>
          </View>
        </View>

        {/* Bảng chi tiết */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.col10]}>STT</Text>
            <Text style={[styles.tableColHeader, styles.col20]}>Khoản</Text>
            <Text style={[styles.tableColHeader, styles.col50]}>Chi tiết</Text>
            <Text style={[styles.tableColHeader, styles.col20]}>
              Thành tiền
            </Text>
          </View>

          {/* Tiền phòng */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.col10]}>1</Text>
            <Text style={[styles.tableCol, styles.col20]}>Tiền phòng</Text>
            <Text style={[styles.tableCol, styles.col50]}>
              Từ {formatDate(invoice.from_date)} đến{" "}
              {formatDate(invoice.to_date)}
            </Text>
            <Text style={[styles.tableCol, styles.right, styles.col20]}>
              {formatCurrency(invoice.contract.room.room_price)}
            </Text>
          </View>

          {/* Điện */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.col10]}>2</Text>
            <Text style={[styles.tableCol, styles.col20]}>DV Điện</Text>
            <Text style={[styles.tableCol, styles.col50]}>
              CS cũ {invoice.electricity_old_index} CS mới{" "}
              {invoice.electricity_new_index} SD {invoice.electricity_usage}
            </Text>
            <Text style={[styles.tableCol, styles.right, styles.col20]}>
              {formatCurrency(invoice.electricity_total)}
            </Text>
          </View>

          {/* Nước */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.col10]}>3</Text>
            <Text style={[styles.tableCol, styles.col20]}>DV Nước</Text>
            <Text style={[styles.tableCol, styles.col50]}>
              {invoice.water_calculation_type === "meter"
                ? `CS cũ ${invoice.water_old_index} CS mới ${invoice.water_new_index} SD ${invoice.water_usage}`
                : `Số người ${
                    invoice.water_people_count
                  } Đơn giá ${formatCurrency(invoice.water_price)}`}
            </Text>
            <Text style={[styles.tableCol, styles.right, styles.col20]}>
              {formatCurrency(invoice.water_total)}
            </Text>
          </View>

          {/* Dịch vụ khác */}
          {invoice?.services?.map((service, idx) => (
            <View
              key={idx}
              style={styles.tableRow}
            >
              <Text style={[styles.tableCol, styles.col10]}>{4 + idx}</Text>
              <Text style={[styles.tableCol, styles.col20]}>
                {service.name}
              </Text>
              <Text style={[styles.tableCol, styles.col50]}>
                SL {service.quantity} ĐG {formatCurrency(service.unit_price)}
              </Text>
              <Text style={[styles.tableCol, styles.right, styles.col20]}>
                {formatCurrency(service.quantity * service.unit_price)}
              </Text>
            </View>
          ))}

          {/* Dòng trống */}
          {Array.from({
            length: Math.max(0, 11 - (3 + invoice.services.length)),
          }).map((_, i) => (
            <View
              key={i}
              style={styles.tableRow}
            >
              <Text style={[styles.tableCol, styles.col10]}>
                {4 + invoice.services.length + i}
              </Text>
              <Text style={[styles.tableCol, styles.col20]}></Text>
              <Text style={[styles.tableCol, styles.col50]}></Text>
              <Text style={[styles.tableCol, styles.center, styles.col20]}>
                -
              </Text>
            </View>
          ))}

          {/* Tổng cộng */}
          <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
            <Text
              style={[
                styles.tableCol,
                { width: "75%", textAlign: "center", fontWeight: "bold" },
                styles.col80,
              ]}
            >
              Cộng:
            </Text>
            <Text
              style={[
                styles.tableCol,
                styles.right,
                { fontSize: 12, fontWeight: "bold" },
                styles.col20,
              ]}
            >
              {formatCurrency(invoice.total_amount)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        {invoice.payment_info && (
          <View style={styles.footer}>
            {/* <MarkdownRenderer md={invoice.description} /> */}
            <Text>
              Quý khách vui lòng chuyển khoản <Text>ĐÚNG</Text> số tiền,
              <Text>ĐÚNG</Text> nội dung, và{" "}
              <Text>ĐÚNG số tài khoản được cung cấp.</Text> Ban quản lý KHÔNG{" "}
              <Text>chịu</Text>
              trách nhiệm nếu quý khách chuyển vào tài khoản khác!
            </Text>

            <Text>
              Nội dung CK:
              <Text style={styles.bold}>
                {invoice.payment_info.payment_content}
              </Text>
              | STK{" "}
              <Text style={{ color: "#fe0000ff" }}>
                {invoice.payment_info.bank_account} -{" "}
                {invoice.payment_info.bank_owner} -{" "}
                {invoice.payment_info.bank_name}
              </Text>
            </Text>

            <Text>
              Trong đó: {invoice.contract.room.building.name} = tòa nhà,{" "}
              {invoice.contract.room.number_room} = số phòng,{" "}
              {getCurrentMonth(invoice.from_date)} = tháng thanh toán
            </Text>
            <Text>Hotline: {invoice.payment_info.hotline}</Text>
          </View>
        )}
        {/* Ký tên */}
        <View style={styles.signRow}>
          <Text>
            BAN QUẢN LÝ {invoice.contract.room.building.name.toUpperCase()}
          </Text>
          <Text>KHÁCH HÀNG</Text>
        </View>
      </Page>
    </Document>
  );
}
