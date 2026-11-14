// Vai trò tệp: Xử lý các thao tác HTTP quản lý nhà cung cấp và kiểm tra dữ liệu trước khi gọi service.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const SupplierService = require("../services/supplierService");

exports.getAll = async (req, res) => {
    try {
        const suppliers = await SupplierService.getAll();

        res.json({
            success: true,
            count: suppliers.length,
            data: suppliers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const supplier = await SupplierService.getById(Number(req.params.id));

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhà cung cấp"
            });
        }

        res.json({
            success: true,
            data: supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const {
            supplierCode,
            supplierName
        } = req.body;

        if (!supplierCode || !supplierName) {
            return res.status(400).json({
                success: false,
                message: "Mã và tên nhà cung cấp là bắt buộc"
            });
        }

        const supplier = await SupplierService.create(req.body);

        res.status(201).json({
            success: true,
            message: "Tạo nhà cung cấp thành công",
            data: supplier
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const supplier = await SupplierService.update(
            Number(req.params.id),
            req.body
        );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhà cung cấp"
            });
        }

        res.json({
            success: true,
            message: "Cập nhật nhà cung cấp thành công",
            data: supplier
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive phải là true hoặc false"
            });
        }

        const supplier = await SupplierService.updateStatus(
            Number(req.params.id),
            isActive
        );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhà cung cấp"
            });
        }

        res.json({
            success: true,
            data: supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};