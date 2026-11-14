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