// Vai trò tệp: Tầng truy cập dữ liệu sản phẩm: xây dựng truy vấn SQL và trả kết quả cho controller.
// Luồng tổng quát: nhận/cấu hình dữ liệu -> thực hiện trách nhiệm mô-đun -> xuất kết quả cho phần còn lại của ứng dụng.

const { poolPromise } = require("../config/database");
const sql = require("mssql");

class ProductService {

    // =====================================
    // GET ALL PRODUCTS
    // =====================================

    static async getAllProducts({ search, categoryId, brandId }) {
        const pool = await poolPromise;
        const request = pool.request();

        let query = `
            SELECT
                p.ProductID,
                p.ProductName,
                p.ShortDescription,
                p.Description,
                p.BasePrice,
                p.Status,
                p.CreatedAt,
                p.UpdatedAt,

                c.CategoryID,
                c.CategoryName,

                b.BrandID,
                b.BrandName,
                b.LogoURL AS BrandLogo,
                primaryImage.ImageURL

            FROM Products p

            LEFT JOIN Categories c
                ON p.CategoryID = c.CategoryID

            LEFT JOIN Brands b
                ON p.BrandID = b.BrandID

            OUTER APPLY (
                SELECT TOP 1 ImageURL
                FROM ProductImages
                WHERE ProductID = p.ProductID
                ORDER BY IsPrimary DESC, ImageID ASC
            ) primaryImage

            WHERE 1 = 1
        `;

        if (search) {
            query += ` AND p.ProductName LIKE @search`;
            request.input(
                "search",
                sql.NVarChar(200),
                `%${search}%`
            );
        }

        if (categoryId !== undefined && categoryId !== "") {
            const id = Number(categoryId);

            if (!Number.isInteger(id) || id <= 0) {
                throw new Error("Category ID không hợp lệ");
            }

            query += ` AND p.CategoryID = @categoryId`;
            request.input("categoryId", sql.Int, id);
        }

        if (brandId !== undefined && brandId !== "") {
            const id = Number(brandId);

            if (!Number.isInteger(id) || id <= 0) {
                throw new Error("Brand ID không hợp lệ");
            }

            query += ` AND p.BrandID = @brandId`;
            request.input("brandId", sql.Int, id);
        }

        query += ` ORDER BY p.CreatedAt DESC`;

        const result = await request.query(query);

        return result.recordset;
    }

    // =====================================
    // GET PRODUCT BY ID
    // =====================================

    static async getProductById(id) {
        const pool = await poolPromise;

        // 1. Thông tin sản phẩm
        const productResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT
                    p.ProductID,
                    p.ProductName,
                    p.ShortDescription,
                    p.Description,
                    p.BasePrice,
                    p.Status,
                    p.CreatedAt,
                    p.UpdatedAt,

                    c.CategoryID,
                    c.CategoryName,

                    b.BrandID,
                    b.BrandName,
                    b.Description AS BrandDescription,
                    b.LogoURL AS BrandLogo

                FROM Products p

                LEFT JOIN Categories c
                    ON p.CategoryID = c.CategoryID

                LEFT JOIN Brands b
                    ON p.BrandID = b.BrandID

                WHERE p.ProductID = @id
            `);

        if (productResult.recordset.length === 0) {
            return null;
        }

        const product = productResult.recordset[0];

        // 2. Hình ảnh sản phẩm
        const imageResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT
                    ImageID,
                    ImageURL,
                    IsPrimary
                FROM ProductImages
                WHERE ProductID = @id
                ORDER BY IsPrimary DESC, ImageID ASC
            `);

        // 3. Biến thể sản phẩm
        const variantResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT
                    pv.VariantID,
                    pv.SKU,
                    pv.Price,

                    s.SizeID,
                    s.SizeName,

                    c.ColorID,
                    c.ColorName,
                    c.ColorCode

                FROM ProductVariants pv

                LEFT JOIN Sizes s
                    ON pv.SizeID = s.SizeID

                LEFT JOIN Colors c
                    ON pv.ColorID = c.ColorID

                WHERE pv.ProductID = @id
                    AND pv.IsActive = 1

                ORDER BY pv.VariantID
            `);

        // 4. Định dạng dữ liệu trả về
        return {
            ProductID: product.ProductID,
            ProductName: product.ProductName,
            ShortDescription: product.ShortDescription,
            Description: product.Description,
            BasePrice: product.BasePrice,
            Status: product.Status,
            CreatedAt: product.CreatedAt,
            UpdatedAt: product.UpdatedAt,

            Category: product.CategoryID ? {
                CategoryID: product.CategoryID,
                CategoryName: product.CategoryName
            } : null,

            Brand: product.BrandID ? {
                BrandID: product.BrandID,
                BrandName: product.BrandName,
                Description: product.BrandDescription,
                LogoURL: product.BrandLogo
            } : null,

            Images: imageResult.recordset,

            Variants: variantResult.recordset.map(item => ({
                VariantID: item.VariantID,
                SKU: item.SKU,
                Price: item.Price,

                Size: item.SizeID ? {
                    SizeID: item.SizeID,
                    SizeName: item.SizeName
                } : null,

                Color: item.ColorID ? {
                    ColorID: item.ColorID,
                    ColorName: item.ColorName,
                    ColorCode: item.ColorCode
                } : null
            }))
        };
    }
}

module.exports = ProductService;