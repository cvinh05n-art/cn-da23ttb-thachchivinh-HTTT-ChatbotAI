// Vai trò tệp: Khai báo các URL và HTTP method, sau đó ánh xạ đến controller; nghiệp vụ được giữ ở controller/service.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const productImportController = require("../controllers/productImportController");

// Lấy danh sách sản phẩm
router.get("/", productController.getAllProducts);

// Import nhiều sản phẩm
router.post("/import", productImportController.importProducts);

// Lấy chi tiết sản phẩm
router.get("/:id", productController.getProductById);

module.exports = router;