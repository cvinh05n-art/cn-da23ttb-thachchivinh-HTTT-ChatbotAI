// Vai trò tệp: Tầng nghiệp vụ phiếu nhập: đọc/ghi nhà cung cấp, chi tiết đơn, tồn kho và lịch sử giao dịch.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const { poolPromise } = require("../config/database");
const sql = require("mssql");

class PurchaseOrderService {

    // =====================================
    // GET ALL PURCHASE ORDERS
    // =====================================

    static async getAll() {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                po.PurchaseOrderID,
                po.PurchaseOrderCode,
                po.SupplierID,
                s.SupplierName,
                po.Status,
                po.TotalAmount,
                po.CreatedAt,
                po.ReceivedAt
            FROM PurchaseOrders po
            INNER JOIN Suppliers s
                ON po.SupplierID = s.SupplierID
            ORDER BY po.CreatedAt DESC
        `);

        return result.recordset;
    }

    // =====================================
    // GET PURCHASE ORDER BY ID
    // =====================================

    static async getById(id) {
        const pool = await poolPromise;

        const orderResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT
                    po.*,
                    s.SupplierName,
                    s.Phone AS SupplierPhone
                FROM PurchaseOrders po
                INNER JOIN Suppliers s
                    ON po.SupplierID = s.SupplierID
                WHERE po.PurchaseOrderID = @id
            `);

        if (!orderResult.recordset.length) return null;

        const itemsResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT
                    poi.*,
                    pv.SKU,
                    p.ProductName,
                    sz.SizeName,
                    c.ColorName
                FROM PurchaseOrderItems poi
                INNER JOIN ProductVariants pv
                    ON poi.VariantID = pv.VariantID
                INNER JOIN Products p
                    ON pv.ProductID = p.ProductID
                LEFT JOIN Sizes sz
                    ON pv.SizeID = sz.SizeID
                LEFT JOIN Colors c
                    ON pv.ColorID = c.ColorID
                WHERE poi.PurchaseOrderID = @id
                ORDER BY poi.PurchaseOrderItemID
            `);

        return {
            ...orderResult.recordset[0],
            Items: itemsResult.recordset
        };
    }

    // =====================================
    // CREATE PURCHASE ORDER
    // =====================================

    static async create(supplierId, notes) {
        const pool = await poolPromise;

        const code = `PO-${Date.now()}`;

        const result = await pool.request()
            .input("code", sql.VarChar(30), code)
            .input("supplierId", sql.Int, supplierId)
            .input("notes", sql.NVarChar(1000), notes || null)
            .query(`
                INSERT INTO PurchaseOrders (
                    PurchaseOrderCode,
                    SupplierID,
                    Status,
                    TotalAmount,
                    Notes
                )
                OUTPUT INSERTED.*
                VALUES (
                    @code,
                    @supplierId,
                    'Draft',
                    0,
                    @notes
                )
            `);

        return result.recordset[0];
    }

    // =====================================
    // ADD ITEM
    // =====================================

    static async addItem(orderId, variantId, quantity, unitCost) {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);

        await transaction.begin();

        try {
            const request = new sql.Request(transaction);

            const orderResult = await request
                .input("orderId", sql.Int, orderId)
                .query(`
                    SELECT Status
                    FROM PurchaseOrders WITH (UPDLOCK, HOLDLOCK)
                    WHERE PurchaseOrderID = @orderId
                `);

            if (!orderResult.recordset.length) {
                throw new Error("Không tìm thấy phiếu nhập");
            }

            if (orderResult.recordset[0].Status !== "Draft") {
                throw new Error("Chỉ được thêm sản phẩm vào phiếu Draft");
            }

            const variantResult = await new sql.Request(transaction)
                .input("variantId", sql.Int, variantId)
                .query(`
                    SELECT VariantID
                    FROM ProductVariants
                    WHERE VariantID = @variantId
                `);

            if (!variantResult.recordset.length) {
                throw new Error("Biến thể sản phẩm không tồn tại");
            }

            const itemResult = await new sql.Request(transaction)
                .input("orderId", sql.Int, orderId)
                .input("variantId", sql.Int, variantId)
                .query(`
                    SELECT PurchaseOrderItemID
                    FROM PurchaseOrderItems
                    WHERE PurchaseOrderID = @orderId
                      AND VariantID = @variantId
                `);

            if (itemResult.recordset.length) {
                throw new Error("Biến thể đã tồn tại trong phiếu nhập");
            }

            const insertResult = await new sql.Request(transaction)
                .input("orderId", sql.Int, orderId)
                .input("variantId", sql.Int, variantId)
                .input("quantity", sql.Int, quantity)
                .input("unitCost", sql.Decimal(18, 2), unitCost)
                .query(`
                    INSERT INTO PurchaseOrderItems (
                        PurchaseOrderID,
                        VariantID,
                        QuantityOrdered,
                        QuantityReceived,
                        UnitCost
                    )
                    OUTPUT INSERTED.*
                    VALUES (
                        @orderId,
                        @variantId,
                        @quantity,
                        0,
                        @unitCost
                    )
                `);

            await new sql.Request(transaction)
                .input("orderId", sql.Int, orderId)
                .query(`
                    UPDATE PurchaseOrders
                    SET TotalAmount = (
                        SELECT COALESCE(SUM(QuantityOrdered * UnitCost), 0)
                        FROM PurchaseOrderItems
                        WHERE PurchaseOrderID = @orderId
                    ),
                    UpdatedAt = SYSDATETIME()
                    WHERE PurchaseOrderID = @orderId
                `);

            await transaction.commit();

            return insertResult.recordset[0];

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // =====================================
    // RECEIVE STOCK
    // =====================================

    static async receive(orderId, receivedItems) {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);

        await transaction.begin();

        try {
            const orderResult = await new sql.Request(transaction)
                .input("orderId", sql.Int, orderId)
                .query(`
                    SELECT *
                    FROM PurchaseOrders WITH (UPDLOCK, HOLDLOCK)
                    WHERE PurchaseOrderID = @orderId
                `);

            const order = orderResult.recordset[0];

            if (!order) throw new Error("Không tìm thấy phiếu nhập");

            if (!["Draft", "PartiallyReceived"].includes(order.Status)) {
                throw new Error("Phiếu nhập không thể nhận hàng");
            }

            const existingItems = await new sql.Request(transaction)
                .input("orderId", sql.Int, orderId)
                .query(`
                    SELECT *
                    FROM PurchaseOrderItems
                    WHERE PurchaseOrderID = @orderId
                `);

            if (!existingItems.recordset.length) {
                throw new Error("Phiếu nhập chưa có sản phẩm");
            }

            const itemMap = new Map(
                existingItems.recordset.map(item => [
                    item.PurchaseOrderItemID,
                    item
                ])
            );

            for (const received of receivedItems) {
                const item = itemMap.get(Number(received.purchaseOrderItemId));

                if (!item) {
                    throw new Error("Chi tiết sản phẩm không thuộc phiếu nhập");
                }

                const quantity = Number(received.quantity);

                if (!Number.isInteger(quantity) || quantity <= 0) {
                    throw new Error("Số lượng nhận phải là số nguyên dương");
                }

                const remaining = item.QuantityOrdered - item.QuantityReceived;

                if (quantity > remaining) {
                    throw new Error("Số lượng nhận vượt số lượng còn lại");
                }

                // Khóa bản ghi tồn kho để tránh cập nhật đồng thời.
                const inventoryResult = await new sql.Request(transaction)
                    .input("variantId", sql.Int, item.VariantID)
                    .query(`
                        SELECT InventoryID, Quantity
                        FROM Inventory WITH (UPDLOCK, HOLDLOCK)
                        WHERE VariantID = @variantId
                    `);

                let before = 0;

                if (inventoryResult.recordset.length) {
                    before = inventoryResult.recordset[0].Quantity;

                    await new sql.Request(transaction)
                        .input("variantId", sql.Int, item.VariantID)
                        .input("quantity", sql.Int, quantity)
                        .query(`
                            UPDATE Inventory
                            SET Quantity = Quantity + @quantity,
                                UpdatedAt = SYSDATETIME()
                            WHERE VariantID = @variantId
                        `);
                } else {
                    await new sql.Request(transaction)
                        .input("variantId", sql.Int, item.VariantID)
                        .input("quantity", sql.Int, quantity)
                        .query(`
                            INSERT INTO Inventory (VariantID, Quantity)
                            VALUES (@variantId, @quantity)
                        `);
                }

                const after = before + quantity;

                await new sql.Request(transaction)
                    .input("variantId", sql.Int, item.VariantID)
                    .input("change", sql.Int, quantity)
                    .input("before", sql.Int, before)
                    .input("after", sql.Int, after)
                    .input("orderId", sql.Int, orderId)
                    .input("itemId", sql.Int, item.PurchaseOrderItemID)
                    .query(`
                        INSERT INTO StockTransactions (
                            VariantID,
                            TransactionType,
                            QuantityChange,
                            QuantityBefore,
                            QuantityAfter,
                            PurchaseOrderID,
                            PurchaseOrderItemID,
                            Notes
                        )
                        VALUES (
                            @variantId,
                            'IN',
                            @change,
                            @before,
                            @after,
                            @orderId,
                            @itemId,
                            N'Nhập hàng từ phiếu nhập'
                        )
                    `);

                await new sql.Request(transaction)
                    .input("itemId", sql.Int, item.PurchaseOrderItemID)
                    .input("quantity", sql.Int, quantity)
                    .query(`
                        UPDATE PurchaseOrderItems
                        SET QuantityReceived = QuantityReceived + @quantity
                        WHERE PurchaseOrderItemID = @itemId
                    `);

                item.QuantityReceived += quantity;
            }

            const allReceived = existingItems.recordset.every(
                item => item.QuantityReceived === item.QuantityOrdered
            );

            const anyReceived = existingItems.recordset.some(
                item => item.QuantityReceived > 0
            );

            const status = allReceived
                ? "Received"
                : anyReceived
                    ? "PartiallyReceived"
                    : "Draft";

            await new sql.Request(transaction)
                .input("orderId", sql.Int, orderId)
                .input("status", sql.VarChar(20), status)
                .query(`
                    UPDATE PurchaseOrders
                    SET Status = @status,
                        ReceivedAt = CASE
                            WHEN @status = 'Received' THEN SYSDATETIME()
                            ELSE NULL
                        END,
                        UpdatedAt = SYSDATETIME()
                    WHERE PurchaseOrderID = @orderId
                `);

            await transaction.commit();

            return { status };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = PurchaseOrderService;