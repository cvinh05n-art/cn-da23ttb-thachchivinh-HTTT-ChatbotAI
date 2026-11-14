/* Vai trò tệp: Kịch bản SQL mô tả/cài đặt cấu trúc và dữ liệu của cơ sở dữ liệu ShopTT.
 * Các câu lệnh bên dưới tạo hoặc cập nhật cấu trúc/dữ liệu; chạy theo thứ tự xuất hiện trong môi trường SQL Server.
 */

GO
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    Role VARCHAR(20) NOT NULL DEFAULT 'Customer',
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO
-- DANH MỤC SẢN PHẨM
CREATE TABLE Categories (
CategoryID INT IDENTITY(1,1) PRIMARY KEY,
CategoryName NVARCHAR(100) NOT NULL,
Description NVARCHAR(500),
ParentID INT NULL,
IsActive BIT DEFAULT 1,
CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
FOREIGN KEY (ParentID) REFERENCES Categories(CategoryID)
);
GO
-- SẢN PHẨM
CREATE TABLE Products (
ProductID INT IDENTITY(1,1) PRIMARY KEY,
CategoryID INT NOT NULL,
ProductName NVARCHAR(200) NOT NULL,
Description NVARCHAR(MAX),
BasePrice DECIMAL(18,2) NOT NULL,
Status VARCHAR(20) DEFAULT 'Active',
CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
CHECK (BasePrice >= 0)
);
GO
-- KÍCH CỠ
CREATE TABLE Sizes (
SizeID INT IDENTITY(1,1) PRIMARY KEY,
SizeName NVARCHAR(20) NOT NULL UNIQUE
);
GO
-- MÀU SẮC
CREATE TABLE Colors (
ColorID INT IDENTITY(1,1) PRIMARY KEY,
ColorName NVARCHAR(50) NOT NULL UNIQUE,
ColorCode VARCHAR(10)
);
GO
-- BIẾN THỂ SẢN PHẨM
CREATE TABLE ProductVariants (
VariantID INT IDENTITY(1,1) PRIMARY KEY,
ProductID INT NOT NULL,
SizeID INT NOT NULL,
ColorID INT NOT NULL,
SKU VARCHAR(50) NOT NULL UNIQUE,
Price DECIMAL(18,2) NOT NULL,
IsActive BIT DEFAULT 1,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
FOREIGN KEY (SizeID) REFERENCES Sizes(SizeID),
FOREIGN KEY (ColorID) REFERENCES Colors(ColorID),
CHECK (Price >= 0)
);
GO
-- TỒN KHO
CREATE TABLE Inventory (
InventoryID INT IDENTITY(1,1) PRIMARY KEY,
VariantID INT NOT NULL UNIQUE,
Quantity INT NOT NULL DEFAULT 0,
UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
FOREIGN KEY (VariantID) REFERENCES ProductVariants(VariantID),
CHECK (Quantity >= 0)
);
GO
--HÌNH ẢNH SẢN PHẨM
CREATE TABLE ProductImages (
ImageID INT IDENTITY(1,1) PRIMARY KEY,
ProductID INT NOT NULL,
ImageURL NVARCHAR(500) NOT NULL,
IsPrimary BIT DEFAULT 0,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO
--GIỎ HÀNG
CREATE TABLE Carts (
CartID INT IDENTITY(1,1) PRIMARY KEY,
UserID INT NOT NULL UNIQUE,
CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO
-- CHI TIẾT GIỎ HÀNG
CREATE TABLE CartItems (
CartItemID INT IDENTITY(1,1) PRIMARY KEY,
CartID INT NOT NULL,
VariantID INT NOT NULL,
Quantity INT NOT NULL,
FOREIGN KEY (CartID) REFERENCES Carts(CartID),
FOREIGN KEY (VariantID) REFERENCES ProductVariants(VariantID),
UNIQUE (CartID, VariantID),
CHECK (Quantity > 0)
);
GO
-- ĐƠN HÀNG
CREATE TABLE Orders (
OrderID INT IDENTITY(1,1) PRIMARY KEY,
UserID INT NOT NULL,
RecipientName NVARCHAR(100) NOT NULL,
Phone VARCHAR(15) NOT NULL,
ShippingAddress NVARCHAR(500) NOT NULL,
TotalAmount DECIMAL(18,2) NOT NULL,
OrderStatus VARCHAR(30) DEFAULT 'Pending',
PaymentMethod VARCHAR(30),
PaymentStatus VARCHAR(30) DEFAULT 'Unpaid',
CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
FOREIGN KEY (UserID) REFERENCES Users(UserID),
CHECK (TotalAmount >= 0)
);
GO
-- CHI TIẾT ĐƠN HÀNG
CREATE TABLE OrderItems (
OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
OrderID INT NOT NULL,
VariantID INT NOT NULL,
ProductNameSnapshot NVARCHAR(200) NOT NULL,
SizeSnapshot NVARCHAR(20),
ColorSnapshot NVARCHAR(50),
UnitPrice DECIMAL(18,2) NOT NULL,
Quantity INT NOT NULL,
FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
FOREIGN KEY (VariantID) REFERENCES ProductVariants(VariantID),
CHECK (UnitPrice >= 0),
CHECK (Quantity > 0)
);
GO
-- PHIÊN CHATBOT
CREATE TABLE ChatSessions (
SessionID INT IDENTITY(1,1) PRIMARY KEY,
UserID INT NULL,
StartedAt DATETIME2 DEFAULT SYSDATETIME(),
FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO
-- TẠO BẢNG THƯƠNG HIỆU
IF OBJECT_ID('dbo.Brands', 'U') IS NULL
BEGIN
CREATE TABLE Brands (
BrandID INT IDENTITY(1,1) PRIMARY KEY,
BrandName NVARCHAR(100) NOT NULL UNIQUE,
Description NVARCHAR(500),
LogoURL NVARCHAR(500),
IsActive BIT NOT NULL DEFAULT 1,
CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
END;
GO

-- 2. BỔ SUNG BRANDID VÀO PRODUCTS
IF COL_LENGTH('dbo.Products', 'BrandID') IS NULL
BEGIN
ALTER TABLE Products
ADD BrandID INT NULL;
END;
GO

-- 3. TẠO KHÓA NGOẠI PRODUCTS -> BRANDS
IF NOT EXISTS (
SELECT 1
FROM sys.foreign_keys
WHERE name = 'FK_Products_Brands'
)
BEGIN
ALTER TABLE Products
ADD CONSTRAINT FK_Products_Brands
FOREIGN KEY (BrandID) REFERENCES Brands(BrandID);
END;
GO

-- 4. BỔ SUNG MÔ TẢ NGẮN CHO PRODUCTS
IF COL_LENGTH('dbo.Products', 'ShortDescription') IS NULL
BEGIN
ALTER TABLE Products
ADD ShortDescription NVARCHAR(255) NULL;
END;
GO

-- 5. BỔ SUNG GHI CHÚ CHO ORDERS
IF COL_LENGTH('dbo.Orders', 'Note') IS NULL
BEGIN
ALTER TABLE Orders
ADD Note NVARCHAR(500) NULL;
END;
GO

-- 6. BỔ SUNG THỜI GIAN CẬP NHẬT ĐƠN HÀNG
IF COL_LENGTH('dbo.Orders', 'UpdatedAt') IS NULL
BEGIN
ALTER TABLE Orders
ADD UpdatedAt DATETIME2 NULL;
END;
GO

-- 7. TẠO INDEX CHO BRANDID
IF NOT EXISTS (
SELECT 1
FROM sys.indexes
WHERE name = 'IX_Products_BrandID'
AND object_id = OBJECT_ID('dbo.Products')
)
BEGIN
CREATE INDEX IX_Products_BrandID
ON Products(BrandID);
END;
GO

-- LOẠI THUỘC TÍNH
IF OBJECT_ID('dbo.Attributes', 'U') IS NULL
BEGIN
    CREATE TABLE Attributes (
        AttributeID INT IDENTITY(1,1) PRIMARY KEY,
        AttributeName NVARCHAR(100) NOT NULL UNIQUE,
        IsVariantAttribute BIT NOT NULL DEFAULT 1
    );
END;
GO

-- GIÁ TRỊ THUỘC TÍNH
IF OBJECT_ID('dbo.AttributeValues', 'U') IS NULL
BEGIN
    CREATE TABLE AttributeValues (
        AttributeValueID INT IDENTITY(1,1) PRIMARY KEY,
        AttributeID INT NOT NULL,
        ValueName NVARCHAR(100) NOT NULL,

        FOREIGN KEY (AttributeID)
        REFERENCES Attributes(AttributeID),

        UNIQUE (AttributeID, ValueName)
    );
END;
GO

-- THUỘC TÍNH CỦA BIẾN THỂ
IF OBJECT_ID('dbo.VariantAttributeValues', 'U') IS NULL
BEGIN
    CREATE TABLE VariantAttributeValues (
        VariantID INT NOT NULL,
        AttributeValueID INT NOT NULL,

        PRIMARY KEY (VariantID, AttributeValueID),

        FOREIGN KEY (VariantID)
        REFERENCES ProductVariants(VariantID),

        FOREIGN KEY (AttributeValueID)
        REFERENCES AttributeValues(AttributeValueID)
    );
END;
GO

-- THUỘC TÍNH CHUNG CỦA SẢN PHẨM
IF OBJECT_ID('dbo.ProductAttributeValues', 'U') IS NULL
BEGIN
    CREATE TABLE ProductAttributeValues (
        ProductID INT NOT NULL,
        AttributeValueID INT NOT NULL,

        PRIMARY KEY (ProductID, AttributeValueID),

        FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID),

        FOREIGN KEY (AttributeValueID)
        REFERENCES AttributeValues(AttributeValueID)
    );
END;
GO

-- Cho phép sản phẩm không có Size hoặc Color
ALTER TABLE ProductVariants
ALTER COLUMN SizeID INT NULL;
GO

ALTER TABLE ProductVariants
ALTER COLUMN ColorID INT NULL;
GO
-- TIN NHẮN CHATBOT
CREATE TABLE ChatMessages (
MessageID INT IDENTITY(1,1) PRIMARY KEY,
SessionID INT NOT NULL,
Sender VARCHAR(20) NOT NULL,
MessageContent NVARCHAR(MAX) NOT NULL,
SentAt DATETIME2 DEFAULT SYSDATETIME(),
FOREIGN KEY (SessionID) REFERENCES ChatSessions(SessionID),
CHECK (Sender IN ('User', 'Assistant'))
);
GO
--ĐỊA CHỈ KHÁCH HÀNG
IF OBJECT_ID('dbo.Addresses', 'U') IS NULL
BEGIN
    CREATE TABLE Addresses (
        AddressID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,
        RecipientName NVARCHAR(100) NOT NULL,
        Phone VARCHAR(15) NOT NULL,
        Province NVARCHAR(100) NOT NULL,
        District NVARCHAR(100),
        Ward NVARCHAR(100),
        StreetAddress NVARCHAR(300) NOT NULL,
        IsDefault BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),

        FOREIGN KEY (UserID)
        REFERENCES Users(UserID)
    );
END;
GO
--ĐÁNH GIÁ SẢN PHẨM
IF OBJECT_ID('dbo.ProductReviews', 'U') IS NULL
BEGIN
    CREATE TABLE ProductReviews (
        ReviewID INT IDENTITY(1,1) PRIMARY KEY,
        ProductID INT NOT NULL,
        UserID INT NOT NULL,
        Rating INT NOT NULL,
        Comment NVARCHAR(1000),
        IsVerifiedPurchase BIT DEFAULT 0,
        IsApproved BIT DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),

        FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID),

        FOREIGN KEY (UserID)
        REFERENCES Users(UserID),

        CHECK (Rating BETWEEN 1 AND 5),

        UNIQUE (ProductID, UserID)
    );
END;
GO
--lỊCH SỬ ĐƠN HÀNG
IF OBJECT_ID('dbo.OrderStatusHistory', 'U') IS NULL
BEGIN
    CREATE TABLE OrderStatusHistory (
        HistoryID INT IDENTITY(1,1) PRIMARY KEY,
        OrderID INT NOT NULL,
        OldStatus VARCHAR(30),
        NewStatus VARCHAR(30) NOT NULL,
        Note NVARCHAR(500),
        ChangedBy INT NULL,
        ChangedAt DATETIME2 DEFAULT SYSDATETIME(),

        FOREIGN KEY (OrderID)
        REFERENCES Orders(OrderID),

        FOREIGN KEY (ChangedBy)
        REFERENCES Users(UserID)
    );
END;
GO
--MÃ GIẢM GIÁ
IF OBJECT_ID('dbo.Coupons', 'U') IS NULL
BEGIN
    CREATE TABLE Coupons (
        CouponID INT IDENTITY(1,1) PRIMARY KEY,
        CouponCode VARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(500),
        DiscountType VARCHAR(20) NOT NULL,
        DiscountValue DECIMAL(18,2) NOT NULL,
        MinimumOrderAmount DECIMAL(18,2) DEFAULT 0,
        MaximumDiscount DECIMAL(18,2),
        StartDate DATETIME2 NOT NULL,
        EndDate DATETIME2 NOT NULL,
        UsageLimit INT,
        UsedCount INT DEFAULT 0,
        IsActive BIT DEFAULT 1,

        CHECK (DiscountType IN ('Percentage', 'Fixed')),
        CHECK (DiscountValue > 0),
        CHECK (EndDate > StartDate)
    );
END;
GO

IF OBJECT_ID('dbo.OrderCoupons', 'U') IS NULL
BEGIN
    CREATE TABLE OrderCoupons (
        OrderCouponID INT IDENTITY(1,1) PRIMARY KEY,
        OrderID INT NOT NULL,
        CouponID INT NOT NULL,
        DiscountAmount DECIMAL(18,2) NOT NULL,

        FOREIGN KEY (OrderID)
        REFERENCES Orders(OrderID),

        FOREIGN KEY (CouponID)
        REFERENCES Coupons(CouponID),

        CHECK (DiscountAmount >= 0),

        UNIQUE (OrderID, CouponID)
    );
END;
GO
--THANH TOÁN
IF OBJECT_ID('dbo.Payments', 'U') IS NULL
BEGIN
    CREATE TABLE Payments (
        PaymentID INT IDENTITY(1,1) PRIMARY KEY,
        OrderID INT NOT NULL,
        PaymentMethod VARCHAR(30) NOT NULL,
        TransactionCode VARCHAR(100),
        Amount DECIMAL(18,2) NOT NULL,
        PaymentStatus VARCHAR(30) DEFAULT 'Pending',
        PaidAt DATETIME2 NULL,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),

        FOREIGN KEY (OrderID)
        REFERENCES Orders(OrderID),

        CHECK (Amount >= 0)
    );
END;
GO
--VẬN CHUYỂN
IF OBJECT_ID('dbo.Shipments', 'U') IS NULL
BEGIN
    CREATE TABLE Shipments (
        ShipmentID INT IDENTITY(1,1) PRIMARY KEY,
        OrderID INT NOT NULL,
        CarrierName NVARCHAR(100),
        TrackingNumber VARCHAR(100),
        ShippingFee DECIMAL(18,2) DEFAULT 0,
        ShipmentStatus VARCHAR(30) DEFAULT 'Pending',
        ShippedAt DATETIME2 NULL,
        DeliveredAt DATETIME2 NULL,

        FOREIGN KEY (OrderID)
        REFERENCES Orders(OrderID),

        CHECK (ShippingFee >= 0)
    );
END;
GO
--DANH SÁCH YÊU THÍCH
IF OBJECT_ID('dbo.Wishlists', 'U') IS NULL
BEGIN
    CREATE TABLE Wishlists (
        WishlistID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL UNIQUE,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),

        FOREIGN KEY (UserID)
        REFERENCES Users(UserID)
    );
END;
GO

IF OBJECT_ID('dbo.WishlistItems', 'U') IS NULL
BEGIN
    CREATE TABLE WishlistItems (
        WishlistItemID INT IDENTITY(1,1) PRIMARY KEY,
        WishlistID INT NOT NULL,
        ProductID INT NOT NULL,
        AddedAt DATETIME2 DEFAULT SYSDATETIME(),

        FOREIGN KEY (WishlistID)
        REFERENCES Wishlists(WishlistID),

        FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID),

        UNIQUE (WishlistID, ProductID)
    );
END;
GO
--BỔ XUNG THÔNG TIN ĐH
IF COL_LENGTH('dbo.Orders', 'UpdatedAt') IS NULL
BEGIN
    ALTER TABLE Orders
    ADD UpdatedAt DATETIME2 NULL;
END;
GO

IF COL_LENGTH('dbo.Orders', 'Note') IS NULL
BEGIN
    ALTER TABLE Orders
    ADD Note NVARCHAR(500) NULL;
END;
GO
CREATE INDEX IX_Addresses_UserID
ON Addresses(UserID);
GO
-- TẠO INDEX HỖ TRỢ TRUY VẤN
CREATE INDEX IX_Products_CategoryID
ON Products(CategoryID);

CREATE INDEX IX_ProductVariants_ProductID
ON ProductVariants(ProductID);

CREATE INDEX IX_Orders_UserID
ON Orders(UserID);

CREATE INDEX IX_Orders_OrderStatus
ON Orders(OrderStatus);

CREATE INDEX IX_ChatMessages_SessionID
ON ChatMessages(SessionID);
GO

SELECT
    TABLE_NAME AS TableName
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO
