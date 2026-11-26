// mã đơn hàng (order code) cho từng đơn hàng
export function formatOrderCode(orderId?: string, createdAt?: string | Date): string {
  if (!orderId) return "AGRI-ORDER";

  // 1. Phân vùng thời gian: Lấy ngày đặt hàng theo định dạng YYMMDD (Năm-Tháng-Ngày)
  let datePart = "";
  try {
    const d = createdAt ? new Date(createdAt) : new Date();
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    datePart = `${yy}${mm}${dd}`;
  } catch {
    const d = new Date();
    datePart = `${String(d.getFullYear()).slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  }

  // 2. Lấy 4 ký tự định danh chữ + số (Base36) trích xuất từ UUID
  const cleanId = String(orderId).replace(/-/g, "").toUpperCase();
  const suffix = cleanId.slice(0, 4);

  return `AGRI-${datePart}-${suffix}`;
}

// mã lô sản phẩm (batch code) cho từng lô hàng
export function formatBatchCode(productName?: string, harvestDate?: string | Date, batchId?: string): string {
  // 1. Tạo tên viết tắt tự động từ tên tiếng Việt (loại bỏ nội dung trong ngoặc đơn/vuông)
  let shortName = "SP";
  if (productName) {
    const cleaned = productName
      .replace(/\s*[\(\[\{][^\)\]\}]*[\)\]\}]?/g, "")
      .replace(/[^a-zA-Z0-9\sÀ-ỹà-ỹĐđ]/g, " ")
      .trim();

    const normalized = cleaned
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

    const words = normalized.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      shortName = words[0].slice(0, 3).toUpperCase();
    } else {
      let code = "";
      for (const word of words) {
        if (/\d/.test(word)) {
          code += word.toUpperCase();
        } else {
          code += word.charAt(0).toUpperCase();
        }
      }
      shortName = (code || "SP").slice(0, 5);
    }
  }

  // 2. Lấy ngày thu hoạch / nhập kho dạng YYMMDD (Năm-Tháng-Ngày)
  let datePart = "";
  try {
    const d = harvestDate ? new Date(harvestDate) : new Date();
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    datePart = `${yy}${mm}${dd}`;
  } catch {
    const d = new Date();
    datePart = `${String(d.getFullYear()).slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  }

  return `LO-${shortName}-${datePart}`;
}

// mã sản phẩm (product code) cho từng sản phẩm
export function formatProductCode(productName?: string, productId?: string): string {
  if (!productName) {
    const cleanId = String(productId || "").replace(/-/g, "").toUpperCase();
    return cleanId ? `SP-${cleanId.slice(0, 4)}` : "SP-SANPHAM";
  }

  // 1. Loại bỏ nội dung trong dấu ngoặc đơn (...) hoặc ngoặc vuông [...]
  // Ví dụ: "Mì gạo (Chũ)" -> "Mì gạo", "Dâu tây (Đà Lạt)" -> "Dâu tây"
  const cleaned = productName
    .replace(/\s*[\(\[\{][^\)\]\}]*[\)\]\}]?/g, "")
    .replace(/[^a-zA-Z0-9\sÀ-ỹà-ỹĐđ]/g, " ")
    .trim();

  // 2. Chuẩn hóa tiếng Việt: Bỏ dấu tiếng Việt
  const normalized = cleaned
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  // 3. Tách các từ và trích xuất chữ cái đầu / giữ lại cụm số (như ST25)
  const words = normalized.trim().split(/\s+/).filter(Boolean);

  let shortCode = "";
  for (const word of words) {
    if (/\d/.test(word)) {
      // Nếu từ chứa số (như ST25), giữ nguyên cả cụm
      shortCode += word.toUpperCase();
    } else {
      // Lấy chữ cái đầu tiên
      shortCode += word.charAt(0).toUpperCase();
    }
  }

  // Nếu tên chỉ có 1 từ ngắn (như "Cam"), lấy 3-4 ký tự đầu
  if (words.length === 1) {
    shortCode = words[0].slice(0, 4).toUpperCase();
  }

  return `SP-${shortCode || "NONG_SAN"}`;
}