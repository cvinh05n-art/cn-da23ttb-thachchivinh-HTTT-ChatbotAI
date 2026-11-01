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

| Thông tin           | Nội dung           |
| :------------------ | :----------------- |
| **Họ và tên**       | Thạch Chí Vĩnh     |
| **Lớp**             | DA23TTB            |
| **Mã số sinh viên** | 110123063          |
| **Ngành**           | Công nghệ thông tin|

## 2. Giới thiệu dự án

**ShopTT** là hệ thống bán hàng thời trang trực tuyến được xây dựng nhằm hỗ trợ hoạt động mua sắm và quản lý kinh doanh trên nền tảng web.

Hệ thống hướng đến việc cung cấp trải nghiệm mua sắm thuận tiện, giao diện thân thiện và tích hợp **Chatbot AI** nhằm hỗ trợ tư vấn sản phẩm, giải đáp thắc mắc và gợi ý sản phẩm phù hợp với nhu cầu của khách hàng.

### Mục tiêu chính

* Xây dựng website thương mại điện tử chuyên về thời trang.
* Hỗ trợ quản lý sản phẩm, danh mục, thương hiệu và biến thể sản phẩm.
* Cung cấp các chức năng tìm kiếm, lọc và xem thông tin sản phẩm.
* Hỗ trợ quản lý giỏ hàng và quy trình đặt hàng.
* Tích hợp Chatbot AI hỗ trợ tư vấn và chăm sóc khách hàng.
* Xây dựng hệ thống có khả năng mở rộng và bảo trì.

## 3. Công nghệ sử dụng

| Thành phần           | Công nghệ                           |
| :------------------- | :---------------------------------- |
| Frontend             | ReactJS, Vite                       |
| Ngôn ngữ frontend    | JavaScript, JSX, CSS                |
| Routing              | React Router DOM                    |
| HTTP Client          | Axios                               |
| Icons                | Lucide React                        |
| Database             | Microsoft SQL Server                |
| Công cụ quản lý CSDL | SQL Server Management Studio (SSMS) |
| Container            | Docker                              |
| Quản lý mã nguồn     | Git, GitHub                         |

*Các công nghệ backend và AI sẽ được cập nhật khi triển khai và tích hợp vào hệ thống.*

## 4. Cấu trúc thư mục

```text
.
├── docker/                  # Cấu hình Docker
│
├── progress-report/         # Báo cáo tiến độ
│
├── setup/                   # Tài liệu hướng dẫn thiết lập
│
├── src/
│   ├── database/            # Cơ sở dữ liệu SQL Server
│   │   └── ShopTT_database.sql
│   │
│   └── frontend/            # Mã nguồn giao diện React
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── hooks/
│       │   ├── layouts/
│       │   ├── pages/
│       │   │   ├── Home/
│       │   │   ├── Products/
│       │   │   └── ProductDetail/
│       │   ├── routes/
│       │   ├── services/
│       │   └── styles/
│       │
│       ├── package.json
│       └── vite.config.js
│
└── thesis/                  # Tài liệu đồ án
    ├── abs/
    ├── doc/
    ├── html/
    ├── pdf/
    └── refs/
```

## 5. Các chức năng dự kiến

### Khách hàng

* Đăng ký và đăng nhập tài khoản.
* Xem danh sách sản phẩm.
* Tìm kiếm và lọc sản phẩm.
* Xem thông tin chi tiết sản phẩm.
* Lựa chọn kích thước, màu sắc và số lượng.
* Quản lý giỏ hàng.
* Đặt hàng và theo dõi đơn hàng.
* Quản lý thông tin cá nhân.
* Đánh giá sản phẩm.
* Sử dụng Chatbot AI để được tư vấn mua sắm.

### Quản trị viên

* Quản lý sản phẩm.
* Quản lý danh mục và thương hiệu.
* Quản lý người dùng.
* Quản lý đơn hàng.
* Quản lý tồn kho.
* Quản lý mã giảm giá.
* Theo dõi thống kê và báo cáo.

### Chatbot AI

* Tư vấn thông tin sản phẩm.
* Giải đáp thắc mắc của khách hàng.
* Gợi ý sản phẩm theo nhu cầu.
* Hỗ trợ trải nghiệm mua sắm.

## 6. Tiến độ phát triển

| Hạng mục                      | Trạng thái                 |
| :---------------------------- | :------------------------- |
| Khảo sát và phân tích yêu cầu | Đang thực hiện             |
| Thiết kế cơ sở dữ liệu        | Đã xây dựng bản thiết kế   |
| Khởi tạo dự án Frontend       | Hoàn thành                 |
| Giao diện trang chủ           | Hoàn thành                 |
| Giao diện danh sách sản phẩm  | Hoàn thành                 |
| Chức năng tìm kiếm và lọc     | Đã triển khai bản Frontend |
| Giao diện chi tiết sản phẩm   | Hoàn thành                 |
| Giỏ hàng                      | Đang phát triển            |
| Backend và RESTful API        | Chưa tích hợp              |
| Tích hợp Chatbot AI           | Chưa triển khai            |
| Kiểm thử và hoàn thiện        | Chưa thực hiện             |

*Lưu ý: Một số chức năng hiện mới có giao diện hoặc xử lý minh họa ở Frontend, chưa kết nối với cơ sở dữ liệu và API thực tế.*

## 7. Hướng dẫn chạy Frontend

### Yêu cầu môi trường

* Node.js
* npm

### Cài đặt

Clone repository:

```bash
git clone https://github.com/cvinh05n-art/cn-da23ttb-thachchivinh-HTTT-ChatbotAI.git
```

Di chuyển vào thư mục Frontend:

```bash
cd src/frontend
```

Cài đặt các dependencies:

```bash
npm install
```

Khởi chạy dự án:

```bash
npm run dev
```

Sau khi khởi chạy thành công, truy cập địa chỉ được Vite hiển thị trong terminal, thông thường là:

```text
http://localhost:5173/
```

## 8. Định hướng phát triển

Trong các giai đoạn tiếp theo, dự án sẽ tập trung vào:

* Hoàn thiện giao diện và trải nghiệm người dùng.
* Xây dựng Backend và RESTful API.
* Kết nối Frontend với SQL Server thông qua Backend.
* Hoàn thiện các chức năng quản lý và mua hàng.
* Tích hợp Chatbot AI vào hệ thống.
* Kiểm thử, tối ưu hiệu năng và bảo mật.
* Hoàn thiện tài liệu và báo cáo đồ án.

---

<div align="center">

**SHOPTT - AI FASHION E-COMMERCE**

*Đồ án chuyên ngành · DA23TTB*

</div>
