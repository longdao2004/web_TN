// frontend/src/utils/docxExport.ts
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";
import { formatOrderCode, formatBatchCode, formatProductCode } from "./order";

// 🟢 Hàm phụ trợ: Tải file Blob về máy người dùng
export const saveDocxBlob = async (doc: Document, filename: string) => {
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// =========================================================================
// 1. BIÊN BẢN KIỂM KÊ KHO NÔNG SẢN & XỬ LÝ LÔ HÀNG CẬN HẠN (.DOCX)
// =========================================================================
export const exportWarehouseDocx = async (
  enrichedBatches: any[],
  expiredLossValue: number,
  expiringSoonCount: number,
  storeName: string
) => {
  const today = new Date();
  const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  // Tạo các hàng trong bảng dữ liệu
  const tableRows = [
    // Header bảng
    new TableRow({
      children: [
        createTableCell("STT", true, "F3F4F6", 6),
        createTableCell("Tên nông sản", true, "F3F4F6", 24),
        createTableCell("Mã lô hàng", true, "F3F4F6", 18),
        createTableCell("Hạn dùng", true, "F3F4F6", 12),
        createTableCell("Tồn kho", true, "F3F4F6", 10),
        createTableCell("Đơn giá", true, "F3F4F6", 14),
        createTableCell("Mức độ rủi ro", true, "F3F4F6", 16),
      ],
    }),
    // Dữ liệu từng lô hàng
    ...enrichedBatches.map((b, idx) => {
      return new TableRow({
        children: [
          createTableCell((idx + 1).toString(), false, undefined, 6, AlignmentType.CENTER),
          createTableCell(b.productName, false, undefined, 24),
          createTableCell(b.batchCode, false, undefined, 18, AlignmentType.CENTER),
          createTableCell(new Date(b.expiryDate).toLocaleDateString("vi-VN"), false, undefined, 12, AlignmentType.CENTER),
          createTableCell(`${b.stock} ${b.unit}`, false, undefined, 10, AlignmentType.RIGHT),
          createTableCell(`${b.price.toLocaleString("vi-VN")}đ`, false, undefined, 14, AlignmentType.RIGHT),
          createTableCell(b.riskLevel, false, b.isExpired ? "FEE2E2" : b.isExpiringSoon ? "FEF3C7" : undefined, 16, AlignmentType.CENTER),
        ],
      });
    }),
  ];

  const doc = new Document({
    sections: [
      {
        children: [
          // Tiêu ngữ
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 24, underline: {} }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: "---o0o---", size: 20 })],
          }),

          // Tiêu đề biên bản
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "BIÊN BẢN KIỂM KÊ KHO NÔNG SẢN VÀ LÔ HÀNG CẬN HẠN",
                bold: true,
                size: 28,
                color: "15803D", // Màu xanh lá đậm
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: `(Gian hàng: ${storeName} — Thời gian: ${dateStr})`, italics: true, size: 20 })],
          }),

          // Bảng dữ liệu kiểm kho
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),

          // Tổng kết hao hụt
          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: `• Tổng số lô hàng kiểm kê: `, bold: true }),
              new TextRun({ text: `${enrichedBatches.length} lô` }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `• Số lô cận hạn (<= 7 ngày): `, bold: true }),
              new TextRun({ text: `${expiringSoonCount} lô (Đề xuất hạ giá xả hàng ngay)` }),
            ],
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({ text: `• Thiệt hại do hàng hết hạn tiêu hủy: `, bold: true, color: "DC2626" }),
              new TextRun({ text: `${expiredLossValue.toLocaleString("vi-VN")} VNĐ`, bold: true, color: "DC2626" }),
            ],
          }),

          // Khung chữ ký hai bên
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "NGƯỜI LẬP BIÊN BẢN", bold: true })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký, ghi rõ họ tên)", italics: true, size: 18 })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ĐẠI DIỆN GIAN HÀNG / THỦ KHO", bold: true })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký, đóng dấu nếu có)", italics: true, size: 18 })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const timestamp = today.toISOString().slice(0, 10);
  await saveDocxBlob(doc, `Bien_Ban_Kiem_Kho_${timestamp}`);
};

// =========================================================================
// 2. BẢNG KÊ CHI TIẾT ĐƠN HÀNG TRONG KỲ (.DOCX)
// =========================================================================
export const exportOrdersDocx = async (orders: any[], storeName: string) => {
  const today = new Date();
  const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  const tableRows = [
    new TableRow({
      children: [
        createTableCell("STT", true, "F3F4F6", 6),
        createTableCell("Mã đơn hàng", true, "F3F4F6", 20),
        createTableCell("Ngày đặt", true, "F3F4F6", 14),
        createTableCell("Người nhận", true, "F3F4F6", 20),
        createTableCell("Số ĐT", true, "F3F4F6", 14),
        createTableCell("Tổng tiền", true, "F3F4F6", 14),
        createTableCell("Trạng thái", true, "F3F4F6", 12),
      ],
    }),
    ...orders.map((o, idx) => {
      const statusMap: Record<string, string> = {
        PENDING: "Chờ xác nhận",
        PACKING: "Đang đóng gói",
        SHIPPING: "Đang giao hàng",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy",
      };
      const statusText = statusMap[o.status] || o.status || "Chờ xử lý";
      return new TableRow({
        children: [
          createTableCell((idx + 1).toString(), false, undefined, 6, AlignmentType.CENTER),
          createTableCell(formatOrderCode(o.id, o.createdAt), false, undefined, 20, AlignmentType.CENTER),
          createTableCell(new Date(o.createdAt).toLocaleDateString("vi-VN"), false, undefined, 14, AlignmentType.CENTER),
          createTableCell(o.customerName || o.shippingAddress?.fullName || o.user?.fullName || "Khách mua lẻ", false, undefined, 20),
          createTableCell(o.phone || o.shippingAddress?.phone || o.user?.phone || "-", false, undefined, 14, AlignmentType.CENTER),
          createTableCell(`${Number(o.totalAmount || 0).toLocaleString("vi-VN")}đ`, false, undefined, 14, AlignmentType.RIGHT),
          createTableCell(statusText, false, undefined, 12, AlignmentType.CENTER),
        ],
      });
    }),
  ];

  const totalSum = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "BẢNG KÊ CHI TIẾT ĐƠN HÀNG NÔNG SẢN", bold: true, size: 28, color: "15803D" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: `Gian hàng: ${storeName} — Xuất ngày: ${dateStr}`, italics: true, size: 20 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
          new Paragraph({
            spacing: { before: 200, after: 300 },
            children: [
              new TextRun({ text: `• Tổng số đơn hàng: `, bold: true }),
              new TextRun({ text: `${orders.length} đơn | ` }),
              new TextRun({ text: `Tổng giá trị: `, bold: true, color: "15803D" }),
              new TextRun({ text: `${totalSum.toLocaleString("vi-VN")} VNĐ`, bold: true, color: "15803D" }),
            ],
          }),
        ],
      },
    ],
  });

  const timestamp = today.toISOString().slice(0, 10);
  await saveDocxBlob(doc, `Bang_Ke_Don_Hang_${timestamp}`);
};

// =========================================================================
// 3. DANH MỤC SẢN PHẨM & TỒN KHO (.DOCX)
// =========================================================================
export const exportProductsDocx = async (products: any[], storeName: string) => {
  const today = new Date();
  const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  const tableRows = [
    new TableRow({
      children: [
        createTableCell("STT", true, "F3F4F6", 6),
        createTableCell("Tên nông sản", true, "F3F4F6", 26),
        createTableCell("Mã SKU", true, "F3F4F6", 16),
        createTableCell("Danh mục", true, "F3F4F6", 16),
        createTableCell("Giá niêm yết", true, "F3F4F6", 14),
        createTableCell("Tồn kho", true, "F3F4F6", 10),
        createTableCell("Trạng thái", true, "F3F4F6", 12),
      ],
    }),
    ...products.map((p, idx) => {
      const statusText = p.isExpired ? "Hết hạn SD" : p.stock > 0 ? "Đang bán" : "Hết hàng";
      return new TableRow({
        children: [
          createTableCell((idx + 1).toString(), false, undefined, 6, AlignmentType.CENTER),
          createTableCell(p.name, false, undefined, 26),
          createTableCell(formatProductCode(p.name, p.id), false, undefined, 16, AlignmentType.CENTER),
          createTableCell(p.category || "Nông sản", false, undefined, 16),
          createTableCell(`${Number(p.price || 0).toLocaleString("vi-VN")}đ`, false, undefined, 14, AlignmentType.RIGHT),
          createTableCell(`${p.stock} ${p.unit || "kg"}`, false, undefined, 10, AlignmentType.RIGHT),
          createTableCell(statusText, false, undefined, 12, AlignmentType.CENTER),
        ],
      });
    }),
  ];

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "BẢNG NIÊM YẾT DANH MỤC NÔNG SẢN VÀ TỒN KHO", bold: true, size: 28, color: "15803D" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: `Gian hàng: ${storeName} — Cập nhật: ${dateStr}`, italics: true, size: 20 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const timestamp = today.toISOString().slice(0, 10);
  await saveDocxBlob(doc, `Danh_Muc_San_Pham_${timestamp}`);
};

// Hàm trợ giúp tạo ô bảng đẹp
function createTableCell(
  text: string,
  isHeader = false,
  bgColor?: string,
  widthPercent?: number,
  alignment: any = AlignmentType.LEFT
) {
  return new TableCell({
    width: widthPercent ? { size: widthPercent, type: WidthType.PERCENTAGE } : undefined,
    shading: bgColor ? { fill: bgColor } : undefined,
    children: [
      new Paragraph({
        alignment,
        children: [
          new TextRun({
            text,
            bold: isHeader,
            size: isHeader ? 20 : 18,
          }),
        ],
      }),
    ],
  });
}