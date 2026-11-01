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
| **Ngành**           | Hệ thống thông tin |

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
│
```