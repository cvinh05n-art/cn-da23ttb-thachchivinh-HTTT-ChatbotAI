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
