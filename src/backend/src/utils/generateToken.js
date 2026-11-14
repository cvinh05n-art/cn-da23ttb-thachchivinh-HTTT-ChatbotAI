// Vai trò tệp: Tiện ích tạo token xác thực từ thông tin người dùng.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.UserID,
            email: user.Email,
            role: user.Role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};

module.exports = generateToken;