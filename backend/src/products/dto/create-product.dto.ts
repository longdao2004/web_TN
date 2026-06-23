export class CreateProductDto {
  // --- Thông tin chung của nông sản ---
  name!: string;
  description?: string;
  imageUrl?: string;
  origin?: string; // Xuất xứ (VD: Đà Lạt)
  unit?: string;   // Đơn vị tính (VD: kg, bó, hộp)
  
  // --- Khóa ngoại ---
  categoryId!: string;
  storeId!: string;

  // --- Thông tin Lô hàng đầu tiên (Bắt buộc) ---
  harvestDate!: Date; // Ngày thu hoạch
  expiryDate!: Date;  // Hạn sử dụng
  quantity!: number;  // Số lượng nhập kho
  price!: number;     // Giá bán
}