// Vai trò tệp: Khai báo các URL và HTTP method, sau đó ánh xạ đến controller; nghiệp vụ được giữ ở controller/service.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const productImportController = require("../controllers/productImportController");
const uploadExcel = require("../middlewares/uploadExcel");

// Import Excel: POST /api/products/import-excel
router.post("/import-excel", uploadExcel.single("file"), productImportController.importProductsFromExcel);

// Import JSON hiện tại vẫn giữ nguyên nếu controller đã có hàm importProducts.
if (typeof productImportController.importProducts === "function") {
    router.post("/import", productImportController.importProducts);
}

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
