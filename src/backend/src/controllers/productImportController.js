const XLSX = require("xlsx");
const ProductImportService = require("../services/productImportService");

const clean = (value) => value === undefined || value === null ? "" : String(value).trim();
const numberOrNull = (value) => {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value === "number") return value;
    // Hỗ trợ giá dạng 299000 hoặc 299.000 hoặc 299,000
    const normalized = String(value).trim().replace(/[.,](?=\d{3}(\D|$))/g, "").replace(/,/g, ".");
    const result = Number(normalized);
    return Number.isFinite(result) ? result : NaN;
};

exports.importProductsFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Vui lòng chọn file Excel ở field 'file'" });
        }

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) throw new Error("File Excel không có sheet dữ liệu");

        const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "", raw: false });
        if (!rawRows.length) throw new Error("Sheet Excel không có dòng dữ liệu");

        // Một dòng Excel tương ứng một biến thể. Các dòng cùng SourceSKU được gom thành một sản phẩm.
        const grouped = new Map();
        rawRows.forEach((r, index) => {
            const sourceSKU = clean(r.sourceSKU || r.SourceSKU || r["Mã mẫu nguồn"]);
            const productName = clean(r.productName || r.ProductName || r["Tên sản phẩm"]);
            const key = sourceSKU || productName;
            if (!key) throw new Error(`Dòng Excel ${index + 2}: thiếu Mã mẫu nguồn và Tên sản phẩm`);

            let product = grouped.get(key);
            if (!product) {
                product = {
                    productName,
                    brandName: clean(r.brandName || r.BrandName || r["Thương hiệu"]),
                    categoryName: clean(r.categoryName || r.CategoryName || r["Danh mục"]),
                    basePrice: numberOrNull(r.basePrice || r.BasePrice || r["Giá gốc"]),
                    description: clean(r.description || r.Description || r["Mô tả"]),
                    shortDescription: clean(r.shortDescription || r.ShortDescription || r["Mô tả ngắn"]),
                    sourceSKU: sourceSKU || null,
                    sourceURL: clean(r.sourceURL || r.SourceURL || r["URL nguồn"]) || null,
                    status: clean(r.status || r.Status || r["Trạng thái"]) || "Inactive",
                    images: [],
                    variants: []
                };
                grouped.set(key, product);
            }

            const imageURL = clean(r.imageURL || r.ImageURL || r["URL hình ảnh"]);
            if (imageURL && !product.images.some(x => x.url === imageURL)) {
                product.images.push({ url: imageURL, isPrimary: clean(r.isPrimary || r["Ảnh chính"]).toLowerCase() === "true" || clean(r["Ảnh chính"]) === "1" });
            }

            const sku = clean(r.variantSKU || r.SKU || r["SKU biến thể"]);
            if (sku) {
                product.variants.push({
                    sku,
                    sizeName: clean(r.sizeName || r.SizeName || r["Kích thước"]) || null,
                    colorName: clean(r.colorName || r.ColorName || r["Màu sắc"]) || null,
                    price: numberOrNull(r.variantPrice || r.VariantPrice || r["Giá bán"]) ?? product.basePrice
                });
            }
        });

        const products = [...grouped.values()];
        for (const [index, product] of products.entries()) {
            if (product.basePrice === null || Number.isNaN(product.basePrice)) {
                throw new Error(`Sản phẩm '${product.productName || index + 1}': Giá gốc không hợp lệ`);
            }
        }

        const result = await ProductImportService.importProducts(products);
        return res.status(200).json({
            success: true,
            message: "Import Excel thành công",
            data: { ...result, rowsRead: rawRows.length, productsGrouped: products.length }
        });
    } catch (error) {
        console.error("Excel Import Error:", error);
        return res.status(400).json({
            success: false,
            message: error.message,
            note: "Nếu lỗi xảy ra trong quá trình ghi SQL, toàn bộ transaction sẽ được rollback."
        });
    }
};

// Giữ tương thích với endpoint import JSON đã dùng trước đó.
exports.importProducts = async (req, res) => {
    try {
        const rows = req.body.products;
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({ success: false, message: "Body phải có dạng { products: [...] }" });
        }
        const result = await ProductImportService.importProducts(rows);
        return res.status(200).json({ success: true, message: "Import sản phẩm thành công", data: result });
    } catch (error) {
        console.error("JSON Import Error:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};
