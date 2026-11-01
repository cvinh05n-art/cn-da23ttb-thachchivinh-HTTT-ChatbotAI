import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Check
} from 'lucide-react';

import './ProductDetail.css';

// Dữ liệu minh họa frontend
const productData = [
  {
    id: 1,
    name: 'Áo sơ mi Linen',
    category: 'Áo nữ',
    price: 450000,
    description:
      'Áo sơ mi Linen mang phong cách tối giản, thanh lịch. Chất liệu nhẹ nhàng, thoáng mát, phù hợp cho nhiều dịp sử dụng.',
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=900',
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Trắng', code: '#F5F2E9' },
      { name: 'Be', code: '#C8B69B' },
      { name: 'Nâu', code: '#80634F' }
    ]
  },
  {
    id: 2,
    name: 'Áo thun Basic',
    category: 'Áo nam',
    price: 250000,
    description:
      'Áo thun Basic với thiết kế đơn giản, dễ phối đồ và phù hợp với phong cách thường ngày.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Trắng', code: '#F5F2E9' },
      { name: 'Đen', code: '#292929' },
      { name: 'Xám', code: '#999999' }
    ]
  },
  {
    id: 3,
    name: 'Quần dài Casual',
    category: 'Quần nam',
    price: 520000,
    description:
      'Quần dài Casual có kiểu dáng hiện đại, dễ kết hợp với áo thun và áo sơ mi.',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Đen', code: '#292929' },
      { name: 'Be', code: '#C8B69B' }
    ]
  },
  {
    id: 4,
    name: 'Váy Minimal',
    category: 'Váy nữ',
    price: 590000,
    description:
      'Váy Minimal mang vẻ đẹp tinh tế, thanh lịch với kiểu dáng nhẹ nhàng và hiện đại.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Trắng', code: '#F5F2E9' },
      { name: 'Đen', code: '#292929' }
    ]
  }
];

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + 'đ';
}

function ProductDetail() {
  const { id } = useParams();

  const product = productData.find(
    (item) => item.id === Number(id)
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [notification, setNotification] = useState('');

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to="/products">Quay lại danh sách sản phẩm</Link>
      </div>
    );
  }

  const addToCart = () => {
    if (!selectedSize) {
      setNotification('Vui lòng chọn kích thước sản phẩm.');
      return;
    }

    if (!selectedColor) {
      setNotification('Vui lòng chọn màu sắc sản phẩm.');
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity
    };

    const currentCart = JSON.parse(
      localStorage.getItem('shoptt_cart') || '[]'
    );

    const existingItem = currentCart.find(
      (item) =>
        item.productId === cartItem.productId &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push(cartItem);
    }

    localStorage.setItem(
      'shoptt_cart',
      JSON.stringify(currentCart)
    );

    setNotification('Đã thêm sản phẩm vào giỏ hàng!');

    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="product-detail-page">

      {/* BREADCRUMB */}
      <div className="container">
        <div className="detail-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <ChevronRight size={14} />

          <Link to="/products">Sản phẩm</Link>
          <ChevronRight size={14} />

          <span>{product.name}</span>
        </div>
      </div>

      {/* PRODUCT INFORMATION */}
      <section className="container detail-container">

        {/* IMAGE GALLERY */}
        <div className="detail-gallery">

          <div className="detail-main-image">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
            />
          </div>

          <div className="detail-thumbnails">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={
                  selectedImage === index ? 'active' : ''
                }
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>

        </div>

        {/* PRODUCT DETAILS */}
        <div className="detail-information">

          <span className="detail-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div className="detail-price">
            {formatPrice(product.price)}
          </div>

          <div className="detail-divider"></div>

          <div className="detail-description">
            <h3>Mô tả sản phẩm</h3>
            <p>{product.description}</p>
          </div>

          {/* COLOR */}
          <div className="detail-option">
            <div className="option-title">
              <h3>Màu sắc</h3>
              <span>{selectedColor || 'Chưa chọn'}</span>
            </div>

            <div className="color-list">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  className={
                    selectedColor === color.name ? 'active' : ''
                  }
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                  onClick={() => setSelectedColor(color.name)}
                >
                  {selectedColor === color.name && (
                    <Check
                      size={16}
                      color={
                        color.name === 'Trắng' ||
                        color.name === 'Be'
                          ? '#292929'
                          : '#FFFFFF'
                      }
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div className="detail-option">
            <div className="option-title">
              <h3>Kích thước</h3>
              <button className="size-guide">
                Hướng dẫn chọn size
              </button>
            </div>

            <div className="size-list">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={
                    selectedSize === size ? 'active' : ''
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="detail-option">
            <h3>Số lượng</h3>

            <div className="quantity-control">
              <button
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
              >
                <Minus size={15} />
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((prev) => prev + 1)
                }
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="detail-actions">

            <button
              className="add-cart-button"
              onClick={addToCart}
            >
              <ShoppingBag size={19} />
              Thêm vào giỏ hàng
            </button>

            <button
              className={`detail-favorite ${
                favorite ? 'active' : ''
              }`}
              onClick={() => setFavorite(!favorite)}
            >
              <Heart
                size={20}
                fill={favorite ? 'currentColor' : 'none'}
              />
            </button>

          </div>

          {notification && (
            <div className="detail-notification">
              {notification}
            </div>
          )}

          {/* BENEFITS */}
          <div className="detail-benefits">

            <div>
              <Truck size={20} />
              <span>Giao hàng toàn quốc</span>
            </div>

            <div>
              <ShieldCheck size={20} />
              <span>Cam kết chất lượng</span>
            </div>

            <div>
              <RotateCcw size={20} />
              <span>Hỗ trợ đổi trả</span>
            </div>

          </div>

        </div>

      </section>

      {/* DESCRIPTION SECTION */}
      <section className="detail-extra">
        <div className="container">
          <h2>Thông tin sản phẩm</h2>
          <p>{product.description}</p>
        </div>
      </section>

    </div>
  );
}

export default ProductDetail;