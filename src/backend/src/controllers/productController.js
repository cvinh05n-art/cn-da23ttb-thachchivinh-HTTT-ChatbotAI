// Vai trò tệp: Xử lý endpoint truy vấn sản phẩm, kiểm tra tham số và chuyển truy vấn sang service.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const ProductService = require("../services/productService");

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
    try {
        const { search, categoryId, brandId } = req.query;

        const products = await ProductService.getAllProducts({
            search,
            categoryId,
            brandId
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error("Get Products Error:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách sản phẩm",
            error: error.message
        });
    }
};

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Product ID không hợp lệ"
            });
        }

        const product = await ProductService.getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error("Get Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy thông tin sản phẩm",
            error: error.message
        });
    }
};