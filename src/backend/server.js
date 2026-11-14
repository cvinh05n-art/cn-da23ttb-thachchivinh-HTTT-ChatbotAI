// Vai trò tệp: Điểm khởi chạy API: nạp cấu hình môi trường, khởi tạo ứng dụng Express và mở cổng HTTP.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("------------------------------------");
    console.log("       SHOPTT BACKEND SERVER");
    console.log("------------------------------------");
    console.log(`Server running: http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});