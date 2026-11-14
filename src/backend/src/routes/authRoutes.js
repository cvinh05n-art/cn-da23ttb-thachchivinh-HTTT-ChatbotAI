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