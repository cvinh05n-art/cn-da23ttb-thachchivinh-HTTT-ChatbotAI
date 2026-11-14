// Vai trò tệp: Tầng nghiệp vụ tài khoản: truy vấn SQL để đăng ký, đăng nhập và lấy hồ sơ người dùng.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const { poolPromise } = require("../config/database");
const bcrypt = require("bcryptjs");

class AuthService {

    // =========================
    // REGISTER
    // =========================

    static async register(data) {
        const pool = await poolPromise;

        const { fullName, email, password, phone } = data;

        // Kiểm tra email tồn tại
        const checkEmail = await pool.request()
            .input("email", email)
            .query(`
                SELECT UserID
                FROM Users
                WHERE Email = @email
            `);

        if (checkEmail.recordset.length > 0) {
            throw new Error("Email đã được sử dụng");
        }

        // Mã hóa mật khẩu
        const passwordHash = await bcrypt.hash(password, 12);

        // Thêm người dùng
        const result = await pool.request()
            .input("fullName", fullName)
            .input("email", email)
            .input("passwordHash", passwordHash)
            .input("phone", phone || null)
            .query(`
                INSERT INTO Users (
                    FullName,
                    Email,
                    PasswordHash,
                    Phone,
                    Role,
                    CreatedAt
                )
                OUTPUT
                    INSERTED.UserID,
                    INSERTED.FullName,
                    INSERTED.Email,
                    INSERTED.Phone,
                    INSERTED.Role,
                    INSERTED.CreatedAt
                VALUES (
                    @fullName,
                    @email,
                    @passwordHash,
                    @phone,
                    'Customer',
                    GETDATE()
                )
            `);

        return result.recordset[0];
    }

    // =========================
    // LOGIN
    // =========================

    static async login(email, password) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("email", email)
            .query(`
                SELECT
                    UserID,
                    FullName,
                    Email,
                    PasswordHash,
                    Phone,
                    Role,
                    CreatedAt
                FROM Users
                WHERE Email = @email
            `);

        if (result.recordset.length === 0) {
            throw new Error("Email hoặc mật khẩu không chính xác");
        }

        const user = result.recordset[0];

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(
            password,
            user.PasswordHash
        );

        if (!isMatch) {
            throw new Error("Email hoặc mật khẩu không chính xác");
        }

        // Không trả PasswordHash về Frontend
        delete user.PasswordHash;

        return user;
    }

    // =========================
    // GET USER BY ID
    // =========================

    static async getUserById(userId) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("userId", userId)
            .query(`
                SELECT
                    UserID,
                    FullName,
                    Email,
                    Phone,
                    Role,
                    CreatedAt
                FROM Users
                WHERE UserID = @userId
            `);

        return result.recordset[0] || null;
    }
}

module.exports = AuthService;