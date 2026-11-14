// Vai trò tệp: Khai báo các URL và HTTP method, sau đó ánh xạ đến controller; nghiệp vụ được giữ ở controller/service.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Đăng ký
router.post("/register", authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Lấy thông tin người dùng hiện tại
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;