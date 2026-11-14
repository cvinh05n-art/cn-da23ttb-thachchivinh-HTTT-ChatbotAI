const AuthService = require("../services/authService");
const generateToken = require("../utils/generateToken");

// =========================
// REGISTER
// =========================

exports.register = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 8 ký tự"
            });
        }

        const user = await AuthService.register({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            phone
        });

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "Đăng ký tài khoản thành công",
            data: {
                user,
                token
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// LOGIN
// =========================

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập email và mật khẩu"
            });
        }

        const user = await AuthService.login(
            email.trim().toLowerCase(),
            password
        );

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                user,
                token
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// GET CURRENT USER
// =========================

exports.getMe = async (req, res) => {
    try {
        const user = await AuthService.getUserById(
            req.user.userId
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};