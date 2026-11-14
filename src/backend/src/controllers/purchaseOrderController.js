const PurchaseOrderService = require("../services/purchaseOrderService");

// =====================================
// GET ALL PURCHASE ORDERS
// =====================================

exports.getAll = async (req, res) => {
    try {
        const orders = await PurchaseOrderService.getAll();

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        console.error("Get Purchase Orders Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================
// GET PURCHASE ORDER BY ID
// =====================================

exports.getById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Purchase Order ID không hợp lệ"
            });
        }

        const order = await PurchaseOrderService.getById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phiếu nhập"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error("Get Purchase Order Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================
// CREATE PURCHASE ORDER
// =====================================

exports.create = async (req, res) => {
    try {
        const { supplierId, notes } = req.body;

        const id = Number(supplierId);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "SupplierID không hợp lệ"
            });
        }

        const order = await PurchaseOrderService.create(id, notes);

        res.status(201).json({
            success: true,
            message: "Tạo phiếu nhập thành công",
            data: order
        });

    } catch (error) {
        console.error("Create Purchase Order Error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================
// ADD ITEM
// =====================================

exports.addItem = async (req, res) => {
    try {
        const orderId = Number(req.params.id);

        const { variantId, quantity, unitCost } = req.body;

        const variant = Number(variantId);
        const qty = Number(quantity);
        const cost = Number(unitCost);

        if (!Number.isInteger(orderId) || orderId <= 0 ||
            !Number.isInteger(variant) || variant <= 0 ||
            !Number.isInteger(qty) || qty <= 0 ||
            !Number.isFinite(cost) || cost < 0) {

            return res.status(400).json({
                success: false,
                message: "Thông tin sản phẩm nhập không hợp lệ"
            });
        }

        const item = await PurchaseOrderService.addItem(
            orderId,
            variant,
            qty,
            cost
        );

        res.status(201).json({
            success: true,
            message: "Thêm sản phẩm vào phiếu nhập thành công",
            data: item
        });

    } catch (error) {
        console.error("Add Purchase Item Error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================
// RECEIVE STOCK
// =====================================

exports.receive = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const { items } = req.body;

        if (!Number.isInteger(orderId) || orderId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Purchase Order ID không hợp lệ"
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Danh sách sản phẩm nhận không hợp lệ"
            });
        }

        for (const item of items) {
            if (
                !Number.isInteger(Number(item.purchaseOrderItemId)) ||
                Number(item.purchaseOrderItemId) <= 0 ||
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Thông tin số lượng nhận không hợp lệ"
                });
            }
        }

        const result = await PurchaseOrderService.receive(
            orderId,
            items
        );

        res.status(200).json({
            success: true,
            message: "Nhận hàng và cập nhật tồn kho thành công",
            data: result
        });

    } catch (error) {
        console.error("Receive Purchase Order Error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};