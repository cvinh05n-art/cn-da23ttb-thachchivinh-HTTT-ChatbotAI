// Vai trò tệp: Khai báo các URL và HTTP method, sau đó ánh xạ đến controller; nghiệp vụ được giữ ở controller/service.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const express = require("express");
const router = express.Router();

const controller = require("../controllers/supplierController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.patch("/:id/status", controller.updateStatus);

module.exports = router;