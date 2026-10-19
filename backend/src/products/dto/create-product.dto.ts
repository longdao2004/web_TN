export class CreateProductDto {
  // --- Thông tin chung của nông sản ---
  name!: string;
  description?: string;
  imageUrl?: string;
  origin?: string; // Xuất xứ (VD: Đà Lạt)
  unit?: string; // Đơn vị tính (VD: kg, bó, hộp)

  // --- Khóa ngoại ---
  categoryId!: string;
  storeId!: string;

  // --- Thông tin Lô hàng đầu tiên (Bắt buộc) ---
  harvestDate!: Date; // Ngày thu hoạch
  expiryDate!: Date; // Hạn sử dụng
  quantity!: number; // Số lượng nhập kho
  price!: number; // Giá bán
  originalPrice?: number; // Giá gốc khi có ưu đãi (VD: 50000)

    // --- Bổ sung Quy cách & Điều kiện bảo quản ---
  specification?: string;
  storageCondition?: string;
}
