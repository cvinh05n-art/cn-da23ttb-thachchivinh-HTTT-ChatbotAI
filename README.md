<div align="center">

# ShopTT - Chatbot AI

### Hệ thống bán hàng thời trang trực tuyến tích hợp Chatbot AI

**ĐỒ ÁN CHUYÊN NGÀNH · HỆ THỐNG THÔNG TIN**

![Class](https://img.shields.io/badge/Lớp-DA23TTB-2563EB?style=flat-square)
![Project](https://img.shields.io/badge/Project-ShopTT-7C3AED?style=flat-square)
![Status](https://img.shields.io/badge/Status-In%20Progress-orange?style=flat-square)

</div>

---

## 1. Thông tin sinh viên

| Thông tin | Nội dung |
| :--- | :--- |
| **Họ và tên** | Thạch Chí Vĩnh |
| **Lớp** | DA23TTB |
| **Mã số sinh viên** | 110123063 |
| **Ngành** | Công nghệ thông tin |

## 2. Giới thiệu dự án

**ShopTT** là hệ thống bán hàng thời trang trực tuyến được xây dựng nhằm hỗ trợ hoạt động mua sắm và quản lý kinh doanh trên nền tảng web.

Hệ thống hướng đến việc cung cấp trải nghiệm mua sắm thuận tiện, giao diện thân thiện và tích hợp **Chatbot AI** nhằm hỗ trợ tư vấn sản phẩm, giải đáp thắc mắc và gợi ý sản phẩm phù hợp với nhu cầu của khách hàng.

### Mục tiêu chính

- Xây dựng website thương mại điện tử chuyên về thời trang.
- Hỗ trợ quản lý sản phẩm, danh mục, thương hiệu và biến thể sản phẩm.
- Cung cấp chức năng tìm kiếm, lọc và xem thông tin sản phẩm.
- Hỗ trợ quản lý giỏ hàng và quy trình đặt hàng.
- Xây dựng hệ thống quản lý dành cho quản trị viên.
- Tích hợp Chatbot AI hỗ trợ tư vấn và chăm sóc khách hàng.
- Xây dựng hệ thống có khả năng mở rộng và bảo trì.

## 3. Công nghệ sử dụng

| Thành phần | Công nghệ |
| :--- | :--- |
| Frontend | React, Vite |
| Ngôn ngữ Frontend | JavaScript, JSX, CSS |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Ngôn ngữ Backend | JavaScript |
| Database | Microsoft SQL Server |
| Database Driver | mssql |
| Cấu hình môi trường | dotenv |
| Xác thực và bảo mật | bcryptjs, JSON Web Token |
| Công cụ quản lý CSDL | SQL Server Management Studio (SSMS) |
| Kiểm thử API | Postman |
| Container | Docker |
| Quản lý mã nguồn | Git, GitHub |

**Lưu ý:** Công nghệ Backend đã được lựa chọn và đang trong giai đoạn thiết lập. Các API và chức năng xác thực chưa hoàn thành. Chatbot AI chưa được tích hợp với mô hình AI thực tế.

## 4. Cấu trúc thư mục

```text
ShopTT/
│
├── docker/                     # Cấu hình Docker
│
├── progress-report/            # Báo cáo tiến độ
│
├── setup/                      # Tài liệu hướng dẫn thiết lập
│
├── src/
│   │
│   ├── backend/                # Backend Node.js và Express.js
│   │   ├── config/             # Cấu hình kết nối cơ sở dữ liệu
│   │   ├── controllers/        # Xử lý nghiệp vụ
│   │   ├── middleware/         # Middleware xác thực và phân quyền
│   │   ├── routes/             # Khai báo RESTful API
│   │   └── services/           # Xử lý logic nghiệp vụ
│   │
│   ├── database/               # Cơ sở dữ liệu SQL Server
│   │   └── ShopTT_database.sql
│   │
│   └── frontend/               # Giao diện React
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── common/
│       │   │   ├── layout/
│       │   │   └── product/
│       │   ├── contexts/
│       │   ├── hooks/
│       │   ├── layouts/
│       │   ├── pages/
│       │   │   ├── Auth/
│       │   │   ├── Cart/
│       │   │   ├── Checkout/
│       │   │   ├── Home/
│       │   │   ├── Orders/
│       │   │   ├── ProductDetail/
│       │   │   ├── Products/
│       │   │   ├── Profile/
│       │   │   └── Wishlist/
│       │   ├── routes/
│       │   ├── services/
│       │   └── styles/
│       │
│       ├── package.json
│       └── vite.config.js
│
└── thesis/                     # Tài liệu đồ án
    ├── abs/
    ├── doc/
    ├── html/
    ├── pdf/
    └── refs/
```

*Lưu ý: Cấu trúc Backend thể hiện định hướng tổ chức mã nguồn trong quá trình phát triển. Các thư mục và module sẽ tiếp tục được bổ sung khi triển khai.*

## 5. Các chức năng hệ thống

### 5.1. Khách hàng

- Đăng ký và đăng nhập tài khoản.
- Xem danh sách sản phẩm.
- Tìm kiếm và lọc sản phẩm.
- Xem thông tin chi tiết sản phẩm.
- Lựa chọn kích thước, màu sắc và số lượng.
- Quản lý giỏ hàng.
- Đặt hàng và xem lịch sử đơn hàng.
- Xem chi tiết và theo dõi trạng thái đơn hàng.
- Quản lý thông tin cá nhân.
- Quản lý địa chỉ giao hàng.
- Quản lý danh sách sản phẩm yêu thích.
- Sử dụng Chatbot AI để được tư vấn mua sắm.

### 5.2. Quản trị viên

- Dashboard thống kê tổng quan.
- Quản lý sản phẩm.
- Quản lý danh mục và thương hiệu.
- Quản lý đơn hàng.
- Quản lý khách hàng.
- Quản lý tài khoản quản trị.
- Quản lý tồn kho.
- Quản lý mã giảm giá.
- Theo dõi tình hình kinh doanh.

### 5.3. Chatbot AI

- Tư vấn thông tin sản phẩm.
- Giải đáp thắc mắc của khách hàng.
- Gợi ý sản phẩm theo nhu cầu.
- Hỗ trợ tìm kiếm sản phẩm phù hợp.
- Hỗ trợ trải nghiệm mua sắm.

## 6. Tiến độ phát triển

| Hạng mục | Trạng thái |
| :--- | :--- |
| Khảo sát và phân tích yêu cầu | Hoàn thành |
| Thiết kế kiến trúc hệ thống | Đã xây dựng |
| Thiết kế cơ sở dữ liệu | Đã xây dựng |
| Khởi tạo dự án Frontend | Hoàn thành |
| Giao diện trang chủ | Hoàn thành |
| Giao diện danh sách sản phẩm | Hoàn thành |
| Tìm kiếm và lọc sản phẩm | Đã triển khai Frontend |
| Giao diện chi tiết sản phẩm | Hoàn thành |
| Giỏ hàng và thanh toán | Đã triển khai Frontend |
| Đăng nhập và đăng ký | Đã triển khai Frontend |
| Quản lý thông tin cá nhân | Đã triển khai Frontend |
| Danh sách yêu thích | Đã triển khai Frontend |
| Quản lý đơn hàng | Đã triển khai Frontend |
| Giao diện Admin Dashboard | Đã xây dựng |
| Giao diện quản lý sản phẩm Admin | Đã xây dựng |
| Khởi tạo Backend | Đang thực hiện |
| Kết nối Backend với SQL Server | Đang xử lý |
| RESTful API | Chưa triển khai |
| Tích hợp Frontend với Backend | Chưa triển khai |
| Tích hợp Chatbot AI | Chưa triển khai |
| Kiểm thử và hoàn thiện hệ thống | Chưa thực hiện |

**Lưu ý:** Các chức năng Frontend hiện chủ yếu sử dụng dữ liệu mẫu và LocalStorage để mô phỏng hoạt động. Giao diện Admin đã được xây dựng nhưng chưa kết nối với dữ liệu thực tế. Các chức năng nghiệp vụ cần tiếp tục được triển khai thông qua Backend và RESTful API.

## 7. Hướng dẫn cài đặt và chạy dự án

### 7.1. Yêu cầu môi trường

- Node.js.
- npm.
- Microsoft SQL Server.
- SQL Server Management Studio (SSMS).
- Git.

### 7.2. Clone repository

```bash
git clone https://github.com/cvinh05n-art/cn-da23ttb-thachchivinh-HTTT-ChatbotAI.git
```

Di chuyển vào thư mục dự án:

```bash
cd cn-da23ttb-thachchivinh-HTTT-ChatbotAI
```

### 7.3. Cài đặt và chạy Frontend

Di chuyển vào thư mục Frontend:

```bash
cd src/frontend
```

Cài đặt các thư viện:

```bash
npm install
```

Khởi chạy ứng dụng:

```bash
npm run dev
```

Sau khi khởi chạy thành công, truy cập địa chỉ được Vite hiển thị trong Terminal, thông thường là:

```text
http://localhost:5173/
```

### 7.4. Chuẩn bị cơ sở dữ liệu

1. Mở Microsoft SQL Server Management Studio.
2. Kết nối đến SQL Server Instance.
3. Mở file `src/database/ShopTT_database.sql`.
4. Kiểm tra nội dung script trước khi thực thi.
5. Tạo và kiểm tra database `ShopTT`.

**Lưu ý:** Không chạy lại toàn bộ script tạo bảng trên một database đã có cấu trúc mà chưa kiểm tra các câu lệnh `CREATE TABLE`, vì có thể phát sinh lỗi đối tượng đã tồn tại.

### 7.5. Backend

Backend sử dụng Node.js và Express.js, kết nối với Microsoft SQL Server thông qua thư viện `mssql`.

Các bước cấu hình kết nối, biến môi trường và khởi chạy Backend sẽ được cập nhật sau khi hoàn thiện phần triển khai.

## 8. Định hướng phát triển

Trong các giai đoạn tiếp theo, dự án sẽ tập trung vào:

- Hoàn thiện cấu trúc Backend bằng Node.js và Express.js.
- Kết nối Backend với Microsoft SQL Server.
- Xây dựng RESTful API cho các chức năng quản lý sản phẩm và danh mục.
- Triển khai xác thực và phân quyền người dùng bằng JWT.
- Xây dựng các chức năng giỏ hàng, đặt hàng và quản lý đơn hàng.
- Kết nối Frontend với Backend thông qua RESTful API.
- Tích hợp Chatbot AI hỗ trợ tư vấn và gợi ý sản phẩm.
- Kiểm thử chức năng, tối ưu hiệu năng và bảo mật.
- Hoàn thiện tài liệu và báo cáo đồ án.

---

<div align="center">

**SHOPTT - AI FASHION E-COMMERCE**

*Đồ án chuyên ngành · DA23TTB*

</div>
