// Vai trò tệp: Tầng truy cập dữ liệu nhà cung cấp: liệt kê, tìm, tạo, sửa và đổi trạng thái.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const { poolPromise } = require("../config/database");
const sql = require("mssql");

class SupplierService {

    static async getAll() {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT *
            FROM Suppliers
            ORDER BY CreatedAt DESC
        `);

        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT *
                FROM Suppliers
                WHERE SupplierID = @id
            `);

        return result.recordset[0] || null;
    }

    static async create(data) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("code", sql.VarChar(30), data.supplierCode)
            .input("name", sql.NVarChar(200), data.supplierName)
            .input("contact", sql.NVarChar(150), data.contactName || null)
            .input("phone", sql.VarChar(20), data.phone || null)
            .input("email", sql.VarChar(150), data.email || null)
            .input("taxCode", sql.VarChar(30), data.taxCode || null)
            .input("address", sql.NVarChar(500), data.address || null)
            .input("notes", sql.NVarChar(1000), data.notes || null)
            .query(`
                INSERT INTO Suppliers (
                    SupplierCode, SupplierName, ContactName,
                    Phone, Email, TaxCode, Address, Notes
                )
                OUTPUT INSERTED.*
                VALUES (
                    @code, @name, @contact,
                    @phone, @email, @taxCode, @address, @notes
                )
            `);

        return result.recordset[0];
    }

    static async update(id, data) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("name", sql.NVarChar(200), data.supplierName)
            .input("contact", sql.NVarChar(150), data.contactName || null)
            .input("phone", sql.VarChar(20), data.phone || null)
            .input("email", sql.VarChar(150), data.email || null)
            .input("taxCode", sql.VarChar(30), data.taxCode || null)
            .input("address", sql.NVarChar(500), data.address || null)
            .input("notes", sql.NVarChar(1000), data.notes || null)
            .query(`
                UPDATE Suppliers
                SET
                    SupplierName = @name,
                    ContactName = @contact,
                    Phone = @phone,
                    Email = @email,
                    TaxCode = @taxCode,
                    Address = @address,
                    Notes = @notes,
                    UpdatedAt = SYSDATETIME()
                OUTPUT INSERTED.*
                WHERE SupplierID = @id
            `);

        return result.recordset[0] || null;
    }

    static async updateStatus(id, isActive) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("isActive", sql.Bit, isActive)
            .query(`
                UPDATE Suppliers
                SET IsActive = @isActive,
                    UpdatedAt = SYSDATETIME()
                OUTPUT INSERTED.*
                WHERE SupplierID = @id
            `);

        return result.recordset[0] || null;
    }
}

module.exports = SupplierService;