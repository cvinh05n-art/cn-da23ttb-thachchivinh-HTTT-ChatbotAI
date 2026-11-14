// Vai trò tệp: Cấu hình middleware nhận tệp Excel tải lên trước khi gọi bộ phân tích dữ liệu.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const multer = require("multer");

const uploadExcel = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /\.(xlsx|xls)$/i.test(file.originalname || "");
        if (!allowed) return cb(new Error("Chỉ chấp nhận file Excel .xlsx hoặc .xls"));
        cb(null, true);
    }
});

module.exports = uploadExcel;
