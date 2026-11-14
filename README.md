<div align="center">

# ShopTT - Chatbot AI

### Hệ thống bán hàng thời trang trực tuyến tích hợp Chatbot AI

![Project](https://img.shields.io/badge/Project-ShopTT-7C3AED?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square)
![Database](https://img.shields.io/badge/Database-SQL%20Server-CC2927?style=flat-square)
![Container](https://img.shields.io/badge/Container-Docker-2496ED?style=flat-square)

**ĐỒ ÁN CHUYÊN NGÀNH · LỚP DA23TTB**

</div>

---

## 1. Giới thiệu

**ShopTT** là hệ thống bán hàng thời trang trực tuyến được xây dựng trên nền tảng web. Hệ thống hỗ trợ khách hàng tìm kiếm, xem thông tin sản phẩm, quản lý giỏ hàng và thực hiện các thao tác mua sắm. Dự án định hướng tích hợp Chatbot AI để tư vấn sản phẩm, giải đáp thắc mắc và hỗ trợ khách hàng lựa chọn sản phẩm phù hợp.

Hệ thống được phát triển theo mô hình Frontend - Backend - Database. Frontend sử dụng ReactJS, Backend xây dựng bằng Node.js và Express.js, dữ liệu được quản lý bằng Microsoft SQL Server.

### Mục tiêu

- Xây dựng website thương mại điện tử chuyên về thời trang.
- Quản lý thông tin sản phẩm, danh mục, thương hiệu và biến thể.
- Hỗ trợ tìm kiếm, lọc và xem chi tiết sản phẩm.
- Hỗ trợ giỏ hàng, đặt hàng và quản lý đơn hàng.
- Cung cấp khu vực quản trị hệ thống.
- Định hướng tích hợp Chatbot AI hỗ trợ tư vấn mua sắm.

## 2. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | ReactJS, Vite |
| Ngôn ngữ giao diện | JavaScript, JSX, CSS |
| Điều hướng | React Router DOM |
| Gọi API | Axios |
| Icon | Lucide React |
| Backend | Node.js, Express.js |
| Database | Microsoft SQL Server |
| Kết nối SQL Server | `mssql` |
| Xác thực | JSON Web Token, bcryptjs |
| Upload/import dữ liệu | Multer, xlsx |
| Container | Docker, Docker Compose |
| Quản trị cơ sở dữ liệu | SQL Server Management Studio (SSMS) |
| Kiểm thử API | Postman |
| Quản lý mã nguồn | Git, GitHub |

## 3. Chức năng hệ thống

### 3.1. Khách hàng

- Xem danh sách sản phẩm đang được kinh doanh.
- Tìm kiếm và lọc sản phẩm.
- Xem thông tin chi tiết sản phẩm.
- Chọn biến thể sản phẩm khi dữ liệu biến thể có sẵn.
- Quản lý giỏ hàng.
- Quản lý danh sách yêu thích.
- Đăng ký, đăng nhập và quản lý tài khoản.
- Thực hiện quy trình đặt hàng và theo dõi đơn hàng theo các chức năng đã triển khai.

### 3.2. Quản trị

- Dashboard quản trị.
- Quản lý sản phẩm.
- Quản lý thông tin nhà cung cấp.
- Quản lý đơn đặt hàng nhập hàng.
- Hỗ trợ import sản phẩm từ dữ liệu JSON/Excel theo API đã xây dựng.

### 3.3. Chatbot AI

Chatbot AI là định hướng chức năng của dự án, nhằm hỗ trợ tư vấn sản phẩm, trả lời câu hỏi và gợi ý sản phẩm. Việc triển khai mô hình AI thực tế cần được đánh giá theo cấu hình và dịch vụ AI được tích hợp trong từng phiên bản.

## 4. Cấu trúc dự án

```text
ShopTT/
├── docker/
│   └── mssql/
│       ├── backup/                 # Lưu file backup SQL Server
│       └── 02-create-app-login.sql # Script tạo tài khoản ứng dụng
│
├── docker-compose.yml              # Cấu hình chạy các service Docker
├── src/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/             # Cấu hình database
│   │   │   ├── controllers/        # Xử lý request
│   │   │   ├── middlewares/        # Middleware xác thực/upload
│   │   │   ├── routes/             # Khai báo API
│   │   │   ├── services/           # Nghiệp vụ và truy vấn dữ liệu
│   │   │   └── app.js              # Cấu hình Express
│   │   ├── server.js
│   │   └── package.json
│   │
│   ├── database/
│   │   └── ShopTT_database.sql     # Script cấu trúc cơ sở dữ liệu
│   │
│   └── frontend/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── hooks/
│       │   ├── pages/
│       │   ├── services/           # Cấu hình Axios/API
│       │   ├── styles/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
│
└── README.md
```

## 5. Cơ sở dữ liệu

Dự án sử dụng **Microsoft SQL Server**. File `src/database/ShopTT_database.sql` chứa script cơ sở dữ liệu ban đầu. Trong quá trình phát triển và demo, database có thể được khôi phục từ file backup `.bak`.

Một số nhóm dữ liệu chính của hệ thống:

- Sản phẩm và danh mục.
- Thương hiệu.
- Hình ảnh sản phẩm.
- Biến thể sản phẩm.
- Tài khoản và thông tin khách hàng.
- Giỏ hàng, đơn hàng và các dữ liệu nghiệp vụ liên quan.
- Nhà cung cấp và đơn đặt hàng nhập hàng.

### Dữ liệu demo hiện tại

Database demo `ShopTT_Demo` được khôi phục từ bản backup của database `ShopTT` trên SQL Server Windows.

Tại thời điểm cập nhật README:

- Tổng số sản phẩm: **22**.
- Sản phẩm có trạng thái `Active`: **6**.
- Sản phẩm có trạng thái `Inactive`: **16**.
- Bảng `ProductImages` chưa có dữ liệu ảnh cho các sản phẩm được kiểm tra.

Danh sách sản phẩm trên giao diện được lọc theo trạng thái `Active`. Vì vậy, số sản phẩm hiển thị ở cửa hàng có thể ít hơn tổng số bản ghi trong bảng `Products`.

> Không chạy lại script tạo database trên cơ sở dữ liệu đang có dữ liệu nếu chưa kiểm tra nội dung script. Nên backup trước khi thực hiện thay đổi cấu trúc hoặc dữ liệu.

## 6. API chính

Backend có các nhóm endpoint chính sau:

| Phương thức | Endpoint | Mô tả |
|---|---|---|
| GET | `/` | Kiểm tra Backend |
| GET | `/api/health` | Kiểm tra kết nối Backend và SQL Server |
| GET | `/api/products` | Lấy danh sách sản phẩm |
| GET | `/api/products/:id` | Lấy chi tiết sản phẩm |
| POST | `/api/products/import` | Import sản phẩm từ JSON (nếu controller hỗ trợ) |
| POST | `/api/products/import-excel` | Import sản phẩm từ Excel |
| `/api/auth/...` | Nhóm API xác thực | Đăng ký, đăng nhập và các chức năng xác thực |
| `/api/suppliers/...` | Nhóm API nhà cung cấp | Nghiệp vụ nhà cung cấp |
| `/api/purchase-orders/...` | Nhóm API đơn nhập hàng | Nghiệp vụ đơn đặt hàng nhập hàng |

Ví dụ kiểm tra danh sách sản phẩm:

```http
GET http://localhost:5000/api/products
```

Response danh sách sản phẩm có dạng:

```json
{
  "success": true,
  "count": 22,
  "data": []
}
```

`data` là danh sách bản ghi thực tế trả về từ database; số lượng cụ thể phụ thuộc dữ liệu hiện có.

## 7. Hướng dẫn cài đặt và chạy ở chế độ phát triển

### 7.1. Yêu cầu môi trường

- Windows 10/11 hoặc môi trường tương thích.
- Node.js và npm.
- Docker Desktop.
- SQL Server Management Studio (SSMS), nếu cần kiểm tra database bằng giao diện.
- Git (nếu clone source từ repository).

### 7.2. Cấu hình Backend

Mở Terminal tại thư mục Backend:

```powershell
cd src/backend
npm install
```

Tạo file `.env` theo mẫu cấu hình của dự án. Ví dụ khi Backend chạy trên máy Windows và SQL Server chạy trong Docker, ánh xạ cổng host `1435`:

```env
PORT=5000
NODE_ENV=development

DB_USER=sa
DB_PASSWORD=YOUR_SQL_PASSWORD
DB_SERVER=127.0.0.1
DB_PORT=1435
DB_DATABASE=ShopTT_Demo

JWT_SECRET=YOUR_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=1d
```

Thay `YOUR_SQL_PASSWORD` và `YOUR_LONG_RANDOM_SECRET` bằng giá trị của môi trường đang sử dụng. Không commit file `.env` chứa thông tin đăng nhập thật lên GitHub.

Khởi chạy Backend:

```powershell
npm run dev
```

Backend mặc định sử dụng cổng `5000`.

### 7.3. Cấu hình Frontend

Mở Terminal khác:

```powershell
cd src/frontend
npm install
npm run dev
```

Truy cập địa chỉ Vite hiển thị trong Terminal, mặc định:

```text
http://localhost:5173
```

Frontend sử dụng Axios với đường dẫn API tương đối `/api`. Trong môi trường phát triển, Vite cần proxy `/api` đến Backend `http://localhost:5000`. Cấu hình proxy nằm trong `vite.config.js`.

### 7.4. Khởi động SQL Server demo bằng Docker

Nếu đã có container SQL Server demo được tạo và cấu hình ánh xạ cổng `1435:1433`, kiểm tra container:

```powershell
docker ps
```

Đảm bảo container đang chạy trước khi khởi động Backend.

Có thể kết nối bằng SSMS:

```text
Server name: 127.0.0.1,1435
Authentication: SQL Server Authentication
Login: sa
Password: Mật khẩu đã cấu hình cho container
```

Chọn database `ShopTT_Demo` để kiểm tra dữ liệu.

### 7.5. Kiểm tra hoạt động

Kiểm tra API health:

```text
http://localhost:5000/api/health
```

Kiểm tra danh sách sản phẩm:

```text
http://localhost:5000/api/products
```

Kiểm tra giao diện:

```text
http://localhost:5173
```

## 8. Chạy bằng Docker Compose

Repository có file `docker-compose.yml` để xây dựng các service SQL Server, Backend và Frontend.

Trước khi chạy:

1. Tạo file `.env` tại thư mục gốc dự án.
2. Khai báo các biến `MSSQL_SA_PASSWORD`, `DB_PASSWORD`, `DB_DATABASE` và `JWT_SECRET`.
3. Đảm bảo mật khẩu SQL Server đáp ứng chính sách độ phức tạp của SQL Server.
4. Kiểm tra cấu hình port và volume trong `docker-compose.yml`.
5. Đảm bảo database đã được khởi tạo/restore đúng vào SQL Server container.

Khởi động:

```powershell
docker compose up -d --build
```

Kiểm tra trạng thái:

```powershell
docker compose ps
```

Xem log:

```powershell
docker compose logs -f
```

Dừng các service:

```powershell
docker compose down
```

> Lưu ý: Cấu hình Docker Compose và cấu hình chạy demo phát triển cục bộ là hai cách triển khai riêng. Hãy kiểm tra port, tên database, biến môi trường và volume đang sử dụng trước khi chạy. Không xóa Docker volume nếu chưa backup dữ liệu cần giữ.

## 9. Tình trạng và giới hạn hiện tại

- Danh sách sản phẩm và trang chi tiết đang được kết nối với API/backend theo phiên bản demo.
- Dữ liệu sản phẩm hiển thị phụ thuộc trạng thái trong SQL Server.
- Bảng `ProductImages` hiện chưa có ảnh cho các sản phẩm đã kiểm tra, vì vậy cần bổ sung ảnh sản phẩm để hiển thị hình ảnh thực tế.
- Khu vực danh mục nổi bật trên trang chủ đã được tạm ẩn trong phiên bản demo vì dữ liệu danh mục chưa được hoàn thiện đồng bộ.
- Cần tiếp tục kiểm thử các luồng đăng nhập, giỏ hàng, đặt hàng và quản trị trên môi trường triển khai thực tế.
- Chatbot AI là định hướng tích hợp của dự án; trạng thái hoạt động phụ thuộc module và cấu hình AI được triển khai.

## 10. Hướng phát triển

- Bổ sung ảnh sản phẩm và hoàn thiện dữ liệu hình ảnh.
- Mở rộng dữ liệu sản phẩm, danh mục và thương hiệu.
- Hoàn thiện dữ liệu biến thể, kích thước, màu sắc và tồn kho.
- Hoàn thiện quy trình giỏ hàng, thanh toán và quản lý đơn hàng.
- Hoàn thiện các chức năng quản trị.
- Tích hợp Chatbot AI với dữ liệu sản phẩm.
- Tăng cường kiểm thử, bảo mật và tối ưu hiệu năng.
- Hoàn thiện triển khai Docker và tài liệu vận hành.

---

<div align="center">

**SHOPTT - ONLINE FASHION STORE**

*Đồ án chuyên ngành · DA23TTB*

</div>
