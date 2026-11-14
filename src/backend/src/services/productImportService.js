const sql = require("mssql");
const { poolPromise } = require("../config/database");

class ProductImportService {
    static async importProducts(rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error("Danh sách sản phẩm trống");
        }

        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        const summary = { created: 0, skipped: 0, variantsCreated: 0, errors: [] };

        await transaction.begin();
        try {
            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                const line = index + 1;

                try {
                    const productName = String(row.productName || "").trim();
                    const categoryName = String(row.categoryName || "").trim();
                    const brandName = String(row.brandName || "").trim();
                    const basePrice = Number(row.basePrice);

                    if (!productName || !categoryName ||
                        !Number.isFinite(basePrice) || basePrice < 0) {
                        throw new Error("Thiếu productName/categoryName hoặc basePrice không hợp lệ");
                    }

                    const sourceSKU = row.sourceSKU ? String(row.sourceSKU).trim() : null;
                    const sourceURL = row.sourceURL ? String(row.sourceURL).trim() : null;

                    // Không tạo trùng theo mã mẫu nguồn (nếu có).
                    if (sourceSKU) {
                        const duplicate = await new sql.Request(transaction)
                            .input("sourceSKU", sql.VarChar(50), sourceSKU)
                            .query(`SELECT TOP 1 ProductID FROM Products WHERE SourceSKU = @sourceSKU`);
                        if (duplicate.recordset.length) {
                            summary.skipped++;
                            continue;
                        }
                    }

                    let brandId = null;
                    if (brandName) {
                        const foundBrand = await new sql.Request(transaction)
                            .input("brandName", sql.NVarChar(100), brandName)
                            .query(`SELECT TOP 1 BrandID FROM Brands WHERE BrandName = @brandName`);
                        if (foundBrand.recordset.length) {
                            brandId = foundBrand.recordset[0].BrandID;
                        } else {
                            const insertedBrand = await new sql.Request(transaction)
                                .input("brandName", sql.NVarChar(100), brandName)
                                .query(`
                                    INSERT INTO Brands (BrandName, IsActive, CreatedAt)
                                    OUTPUT INSERTED.BrandID
                                    VALUES (@brandName, 1, SYSDATETIME())
                                `);
                            brandId = insertedBrand.recordset[0].BrandID;
                        }
                    }

                    let categoryId;
                    const foundCategory = await new sql.Request(transaction)
                        .input("categoryName", sql.NVarChar(100), categoryName)
                        .query(`SELECT TOP 1 CategoryID FROM Categories WHERE CategoryName = @categoryName`);
                    if (foundCategory.recordset.length) {
                        categoryId = foundCategory.recordset[0].CategoryID;
                    } else {
                        const insertedCategory = await new sql.Request(transaction)
                            .input("categoryName", sql.NVarChar(100), categoryName)
                            .query(`
                                INSERT INTO Categories (CategoryName, IsActive, CreatedAt)
                                OUTPUT INSERTED.CategoryID
                                VALUES (@categoryName, 1, SYSDATETIME())
                            `);
                        categoryId = insertedCategory.recordset[0].CategoryID;
                    }

                    const status = row.status === "Active" ? "Active" : "Inactive";
                    const productResult = await new sql.Request(transaction)
                        .input("categoryId", sql.Int, categoryId)
                        .input("brandId", sql.Int, brandId)
                        .input("name", sql.NVarChar(200), productName)
                        .input("description", sql.NVarChar(sql.MAX), row.description || null)
                        .input("shortDescription", sql.NVarChar(255), row.shortDescription || null)
                        .input("basePrice", sql.Decimal(18, 2), basePrice)
                        .input("status", sql.VarChar(20), status)
                        .input("sourceURL", sql.NVarChar(500), sourceURL)
                        .input("sourceSKU", sql.VarChar(50), sourceSKU)
                        .query(`
                            INSERT INTO Products (
                                CategoryID, BrandID, ProductName, Description,
                                ShortDescription, BasePrice, Status, SourceURL, SourceSKU,
                                CreatedAt, UpdatedAt
                            )
                            OUTPUT INSERTED.ProductID
                            VALUES (
                                @categoryId, @brandId, @name, @description,
                                @shortDescription, @basePrice, @status, @sourceURL, @sourceSKU,
                                SYSDATETIME(), SYSDATETIME()
                            )
                        `);
                    const productId = productResult.recordset[0].ProductID;

                    for (const image of (Array.isArray(row.images) ? row.images : [])) {
                        const imageURL = typeof image === "string" ? image : image.url;
                        if (!imageURL) continue;
                        await new sql.Request(transaction)
                            .input("productId", sql.Int, productId)
                            .input("imageURL", sql.NVarChar(500), imageURL)
                            .input("isPrimary", sql.Bit, typeof image === "object" && image.isPrimary === true)
                            .query(`
                                INSERT INTO ProductImages (ProductID, ImageURL, IsPrimary)
                                VALUES (@productId, @imageURL, @isPrimary)
                            `);
                    }

                    for (const variant of (Array.isArray(row.variants) ? row.variants : [])) {
                        const sku = String(variant.sku || "").trim();
                        const variantPrice = Number(variant.price ?? basePrice);
                        if (!sku || !Number.isFinite(variantPrice) || variantPrice < 0) {
                            throw new Error("Mỗi biến thể phải có SKU thực tế và giá hợp lệ");
                        }

                        const skuExists = await new sql.Request(transaction)
                            .input("sku", sql.VarChar(50), sku)
                            .query(`SELECT TOP 1 VariantID FROM ProductVariants WHERE SKU = @sku`);
                        if (skuExists.recordset.length) {
                            throw new Error(`SKU biến thể đã tồn tại: ${sku}`);
                        }

                        let sizeId = null;
                        if (variant.sizeName) {
                            const sizeName = String(variant.sizeName).trim();
                            const size = await new sql.Request(transaction)
                                .input("sizeName", sql.NVarChar(20), sizeName)
                                .query(`SELECT TOP 1 SizeID FROM Sizes WHERE SizeName = @sizeName`);
                            if (!size.recordset.length) throw new Error(`Chưa có size trong danh mục: ${sizeName}`);
                            sizeId = size.recordset[0].SizeID;
                        }

                        let colorId = null;
                        if (variant.colorName) {
                            const colorName = String(variant.colorName).trim();
                            const color = await new sql.Request(transaction)
                                .input("colorName", sql.NVarChar(50), colorName)
                                .query(`SELECT TOP 1 ColorID FROM Colors WHERE ColorName = @colorName`);
                            if (!color.recordset.length) throw new Error(`Chưa có màu trong danh mục: ${colorName}`);
                            colorId = color.recordset[0].ColorID;
                        }

                        const insertedVariant = await new sql.Request(transaction)
                            .input("productId", sql.Int, productId)
                            .input("sizeId", sql.Int, sizeId)
                            .input("colorId", sql.Int, colorId)
                            .input("sku", sql.VarChar(50), sku)
                            .input("price", sql.Decimal(18, 2), variantPrice)
                            .query(`
                                INSERT INTO ProductVariants (ProductID, SizeID, ColorID, SKU, Price, IsActive)
                                OUTPUT INSERTED.VariantID
                                VALUES (@productId, @sizeId, @colorId, @sku, @price, 1)
                            `);

                        // Tồn kho khởi tạo 0, chỉ tăng khi xác nhận nhận hàng.
                        await new sql.Request(transaction)
                            .input("variantId", sql.Int, insertedVariant.recordset[0].VariantID)
                            .query(`INSERT INTO Inventory (VariantID, Quantity, UpdatedAt) VALUES (@variantId, 0, SYSDATETIME())`);
                        summary.variantsCreated++;
                    }

                    summary.created++;
                } catch (error) {
                    throw new Error(`Dòng ${line} (${row.productName || "chưa có tên"}): ${error.message}`);
                }
            }

            await transaction.commit();
            return summary;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = ProductImportService;
