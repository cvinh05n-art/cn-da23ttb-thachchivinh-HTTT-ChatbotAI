// Vai trò tệp: Lắp ráp ứng dụng Express: middleware chung, các nhóm endpoint, kiểm tra sức khỏe và xử lý lỗi.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const { poolPromise } = require("./config/database");
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/purchase-orders", purchaseOrderRoutes);

// ================================
// DEFAULT ROUTE
// ================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to ShopTT API",
        version: "1.0.0"
    });
});

// ================================
// HEALTH CHECK
// ================================

app.get("/api/health", async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                DB_NAME() AS databaseName,
                SUSER_SNAME() AS currentLogin,
                CONNECTIONPROPERTY('net_transport') AS networkProtocol,
                GETDATE() AS serverTime
        `);

        res.status(200).json({
            success: true,
            message: "Backend and SQL Server are working!",
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Health Check Error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

// ================================
// AUTH ROUTES
// ================================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
// ================================
// 404 NOT FOUND
// ================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// ================================
// GLOBAL ERROR HANDLER
// ================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

module.exports = app;