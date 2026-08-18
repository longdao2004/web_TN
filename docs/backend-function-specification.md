# ĐẶC TẢ CHỨC NĂNG BACKEND – AGRIMARKET

## 1. Mục đích tài liệu
Tài liệu này cung cấp bức tranh toàn cảnh về các chức năng nghiệp vụ mà hệ thống Backend hiện tại đã xây dựng được. Tài liệu được biên soạn dựa trên việc **đọc trực tiếp source code Backend thực tế** (Controller, Service, Database Schema) để đối chiếu với phạm vi đề tài, giúp sinh viên báo cáo và xin ý kiến giảng viên hướng dẫn một cách chính xác nhất.

## 2. Phạm vi hệ thống
Hệ thống là một **Sàn thương mại điện tử nông sản** kết nối người mua và người bán. Backend được xây dựng dưới dạng RESTful API, cung cấp dữ liệu cho Frontend (Next.js) và các nền tảng khác trong tương lai. Hệ thống xử lý các nghiệp vụ cốt lõi: Xác thực, Quản lý Sản phẩm, Giỏ hàng, Đơn hàng, Thanh toán trực tuyến (VNPay), và Thống kê.

## 3. Actor (Người dùng hệ thống)
Hệ thống hỗ trợ 3 Actor chính có khả năng tương tác trực tiếp:
- **BUYER (Người mua):** Khách hàng tìm kiếm và mua nông sản.
- **SELLER (Người bán):** Đại lý, cửa hàng nông sản, siêu thị. Quản lý cửa hàng và bán hàng trên hệ thống.
- **ADMIN (Quản trị viên):** Người điều hành, quản lý toàn bộ hệ thống.

> **⚠️ LƯU Ý QUAN TRỌNG VỀ NÔNG DÂN (FARMER):**  
> Nông dân **KHÔNG PHẢI** là Actor trực tiếp của hệ thống. Trong Database hiện tại, Nông dân chỉ là **dữ liệu text** (`farmerName`, `farmerAddress`) nằm trong thông tin của Sản phẩm (`Product`). Nông dân đóng vai trò là "Nguồn gốc xuất xứ" của nông sản chứ không đăng nhập hay thao tác trên hệ thống.

## 4. Kiến trúc Backend
- **Framework:** NestJS v11 (Node.js).
- **Architecture:** Controller - Service - Module với DTO Validator.
- **Database:** PostgreSQL.
- **ORM:** Prisma v6.19.3.
- **Authentication:** JWT (JSON Web Token), Passport, Google OAuth20.
- **Media Storage:** Cloudinary (Lưu trữ ảnh).

## 5. Danh sách module hiện tại
Dựa vào source code, Backend đã triển khai các Module sau:
1. `AuthModule`: Đăng ký, Đăng nhập, Quên mật khẩu, Google Login.
2. `UsersModule`: Quản lý hồ sơ và phân quyền.
3. `StoresModule`: Quản lý gian hàng của Seller.
4. `CategoriesModule`: Quản lý danh mục nông sản.
5. `ProductsModule`: Quản lý thông tin chung của sản phẩm.
6. `ProductBatchesModule`: Quản lý từng lô hàng (Hạn sử dụng, Ngày thu hoạch).
7. `CertificatesModule`: Quản lý giấy chứng nhận chất lượng của sản phẩm.
8. `CartModule`: Quản lý giỏ hàng của Buyer.
9. `OrderModule`: Quản lý đơn hàng.
10. `PaymentsModule`: Tích hợp thanh toán VNPay và COD.
11. `ReviewsModule`: Đánh giá sản phẩm.
12. `StatisticsModule`: Thống kê doanh thu/đơn hàng.

---

## 6. Đặc tả chức năng theo Actor

### 6.1 NGƯỜI MUA (BUYER)
*Buyer là Role mặc định khi người dùng đăng ký tài khoản.*

1. **Xác thực & Tài khoản**
   - Đăng ký tài khoản (Email, Password).
   - Đăng nhập (Email/Password) và Đăng nhập bằng Google.
   - Quên mật khẩu & Đặt lại mật khẩu (OTP Token).
   - Xem và Cập nhật hồ sơ cá nhân (Tên, Số điện thoại, Địa chỉ).
2. **Sản phẩm & Cửa hàng (Public)**
   - Xem danh sách Danh mục và Sản phẩm.
   - Xem chi tiết Sản phẩm (Bao gồm thông tin lô hàng, chứng nhận chất lượng, tên Nông dân).
   - Xem chi tiết một Cửa hàng (Store) của Seller.
3. **Đánh giá (Review)**
   - Xem các đánh giá của một sản phẩm.
   - Viết đánh giá sản phẩm (Rating & Comment).
   - Sửa, Xóa đánh giá của chính mình.
4. **Giỏ hàng (Cart)**
   - Thêm sản phẩm vào giỏ hàng.
   - Xem giỏ hàng cá nhân.
   - Cập nhật số lượng hoặc xóa sản phẩm khỏi giỏ hàng.
5. **Đơn hàng & Thanh toán (Order)**
   - Tạo đơn đặt hàng từ giỏ hàng.
   - Xem lịch sử mua hàng của chính mình.
   - Tạo URL thanh toán qua VNPay hoặc chọn COD.

### 6.2 NGƯỜI BÁN (SELLER)
*Seller là các Đại lý/Cửa hàng nông sản được Admin cấp quyền hoặc mở Store.*

1. **Quản lý Cửa hàng**
   - Đăng ký mở Cửa hàng (Tạo Store).
   - Xem và Cập nhật thông tin Cửa hàng (Tên, Mô tả, Logo).
2. **Quản lý Sản phẩm (Product)**
   - Đăng bán Sản phẩm mới (Kèm upload ảnh lên Cloudinary).
   - Sửa / Xóa Sản phẩm.
3. **Quản lý Lô hàng & Chứng nhận (Traceability)**
   - Thêm, sửa, xóa Lô hàng (Product Batch) quy định ngày thu hoạch, hạn sử dụng, số lượng tồn kho.
   - Thêm, sửa, xóa Giấy chứng nhận (Certificate) cho sản phẩm (VietGAP, GlobalGAP...).
4. **Quản lý Đơn hàng**
   - Cập nhật trạng thái đơn hàng (PENDING -> PACKING -> SHIPPING -> COMPLETED/CANCELLED).
5. **Thống kê**
   - Xem báo cáo tổng quan (Overview Stats) cho cửa hàng của mình.

### 6.3 QUẢN TRỊ VIÊN (ADMIN)
*Admin quản lý toàn bộ hệ thống.*

1. **Quản lý Người dùng**
   - Xem danh sách toàn bộ người dùng.
   - Thay đổi quyền (Role) của người dùng (Thăng cấp lên SELLER/ADMIN).
   - Xóa người dùng.
2. **Quản lý Gian hàng (Stores)**
   - Xem toàn bộ danh sách Cửa hàng trên sàn.
   - Xóa Cửa hàng vi phạm.
3. **Quản lý Danh mục (Categories)**
   - Thêm, sửa, xóa Danh mục nông sản.
4. **Quyền hạn tối cao**
   - Được phép tác động (Sửa/Xóa) toàn bộ Sản phẩm, Đánh giá, Lô hàng, Chứng nhận của bất kỳ Seller nào.

---

## 7. Danh sách API hiện tại

*Dưới đây là các API chính đã được code và cấu hình thành công trong Backend.*

**Auth & User:**
- `POST /auth/register`, `POST /auth/login`, `GET /auth/google`
- `POST /auth/forgot-password`, `POST /auth/reset-password`
- `GET /users/profile`, `PATCH /users/profile` (Auth: BUYER, SELLER, ADMIN)
- `GET /users`, `PATCH /users/:id/role`, `DELETE /users/:id` (Auth: ADMIN)

**Category & Product:**
- `GET /categories`, `GET /categories/:id`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id`
- `GET /products`, `GET /products/:id` (Public)
- `POST /products`, `PATCH /products/:id`, `DELETE /products/:id` (Auth: SELLER, ADMIN)

**Store & Traceability (SELLER, ADMIN):**
- `POST /stores`, `GET /stores/my-store`, `PATCH /stores/my-store`
- `POST /product-batches`, `PATCH /product-batches/:id`, `DELETE /product-batches/:id`
- `POST /certificates`, `PATCH /certificates/:id`, `DELETE /certificates/:id`

**Cart & Order (BUYER):**
- `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`
- `POST /orders`, `GET /orders/history`
- `PATCH /orders/:id/status` (Auth: SELLER, ADMIN)

**Payment:**
- `POST /payments/create-url` (Tạo link VNPay)
- `GET /payments/vnpay-return` (Webhook xử lý kết quả VNPay)

**Review & Statistics:**
- `GET /reviews/product/:id` (Public)
- `POST /reviews`, `PATCH /reviews/:id`, `DELETE /reviews/:id` (Auth: BUYER/SELLER/ADMIN)
- `GET /statistics/overview` (Auth: SELLER, ADMIN)

---

## 8. Database Liên quan (Dựa trên Prisma Schema)
- **User**: Chứa Role (`BUYER`, `SELLER`, `ADMIN`).
- **Store**: Liên kết 1-1 với User (Owner).
- **Product**: Liên kết với Category và Store. Chứa text field `farmerName`, `farmerAddress`.
- **ProductBatch**: Liên kết với Product. Giải quyết bài toán Lô hàng (hạn sử dụng riêng biệt cho từng đợt nhập).
- **Certificate**: Liên kết với Product (Ảnh giấy chứng nhận chất lượng).
- **Order & OrderItem**: OrderItem liên kết thẳng tới **ProductBatch** cụ thể để trừ tồn kho chính xác.
- **Payment**: Lưu thông tin giao dịch VNPay/COD.

---

## 9. Bảng tổng hợp chức năng

| STT | Actor | Module | Chức năng | API | Method | Role | Trạng thái |
|---|---|---|---|---|---|---|---|
| 1 | Mọi người | Auth | Đăng nhập/Đăng ký | `/auth/...` | POST | N/A | Đã triển khai |
| 2 | Mọi người | Auth | Google Login | `/auth/google` | GET | N/A | Đã triển khai |
| 3 | Buyer | User | Quản lý Profile | `/users/profile` | GET/PATCH | BUYER | Đã triển khai |
| 4 | Buyer | Cart | Quản lý Giỏ hàng | `/cart/...` | GET/POST...| BUYER | Đã triển khai |
| 5 | Buyer | Order | Đặt hàng | `/orders` | POST | BUYER | Đã triển khai |
| 6 | Buyer | Payment| Thanh toán VNPay | `/payments/create-url` | POST | BUYER | Đã triển khai |
| 7 | Seller | Store | Quản lý Gian hàng | `/stores/my-store` | GET/PATCH | SELLER | Đã triển khai |
| 8 | Seller | Product| Đăng bán Sản phẩm | `/products` | POST | SELLER | Triển khai 1 phần |
| 9 | Seller | Batch | Quản lý Lô hàng | `/product-batches` | POST/PATCH | SELLER | Đã triển khai |
| 10| Admin | User | Quản lý Role | `/users/:id/role`| PATCH | ADMIN | Đã triển khai |
| 11| Admin | Category| Quản lý Danh mục | `/categories` | POST/PATCH | ADMIN | Chưa hoàn thiện |

---

## 10. Các chức năng chưa hoàn thiện (Cần code thêm)

| Chức năng / Module | Hiện trạng thực tế trong Code | Vấn đề / Lỗ hổng | Mức độ | Đề xuất khắc phục |
|---|---|---|---|---|
| **Categories Module** | Đã có code CRUD API hoàn chỉnh. | File `categories.controller.ts` **hoàn toàn không có Guard bảo vệ**. Ai cũng có thể POST/PATCH/DELETE. | Nghiêm trọng | Bổ sung `@UseGuards(AuthGuard('jwt'))` và `@Roles(Role.ADMIN)`. |
| **Products Module** | Đã chặn tạo sản phẩm (chỉ Seller/Admin). | Phương thức `@Patch` và `@Delete` **không có Guard**. Ai gọi API cũng có thể xóa/sửa sản phẩm. | Nghiêm trọng | Bổ sung AuthGuard và kiểm tra chủ sở hữu (Store Owner) hoặc Admin. |
| **Sản phẩm (Image)** | Đang upload ảnh qua mảng. | Backend hiện chỉ hỗ trợ upload 1 ảnh qua form-data. Việc cập nhật ảnh chưa có luồng rõ ràng. | Trung bình | Tối ưu Service lưu trữ ảnh, hỗ trợ multiple images nếu cần. |

---

## 11. Use Case theo Actor

**Buyer (Người mua):**
- Đăng nhập/Đăng ký/Quên mật khẩu.
- Xem danh mục, xem sản phẩm.
- Quản lý giỏ hàng.
- Tạo đơn hàng, thanh toán qua VNPay.
- Xem lịch sử đơn hàng, cập nhật hồ sơ cá nhân.
- Đánh giá sản phẩm đã mua.

**Seller (Cửa hàng/Đại lý):**
- Mở gian hàng (Store).
- Đăng sản phẩm mới (Kèm upload hình ảnh).
- Tạo các lô hàng (Product Batch) và giấy chứng nhận cho sản phẩm.
- Cập nhật trạng thái đơn hàng do mình bán.
- Xem thống kê tổng quan doanh thu.

**Admin:**
- Quản lý toàn bộ Category.
- Thăng quyền Seller cho User.
- Xóa gian hàng, người dùng vi phạm.
- Quản lý tất cả sản phẩm, lô hàng, chứng nhận trên hệ thống.

---

## 12. Các vấn đề cần xác nhận với Giảng viên
1. **Nông dân không phải là Actor:** Em đã thiết kế hệ thống theo hướng người bán là "Đại lý/Siêu thị", do đó "Nông dân" chỉ được coi là trường dữ liệu lưu truy xuất nguồn gốc (farmerName) của sản phẩm. Em xin phép giữ nguyên mô hình 3 Actor (Buyer, Seller, Admin) này.
2. **Quyền quản lý hệ thống:** Hiện tại Admin có quyền lực tối cao, nhưng chưa có luồng phân chia phần trăm doanh thu hoa hồng với Seller. Em xin phép trong phạm vi đồ án chỉ giải quyết luồng mua bán trực tiếp.

## 13. Đề xuất phạm vi chức năng
Em xin phép chốt phạm vi chức năng Backend hiện hành và chuẩn bị chuyển sang xây dựng Front-end Nhóm 3 (Buyer).
Mọi logic hiện tại đã đáp ứng đủ quy trình từ lúc Khách thêm vào giỏ, đặt hàng, cho tới khi thanh toán qua cổng VNPay.
