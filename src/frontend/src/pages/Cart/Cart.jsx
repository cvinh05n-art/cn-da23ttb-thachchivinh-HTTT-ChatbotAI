import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingCart
} from 'lucide-react';

import './Cart.css';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN') + 'đ';

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // Khôi phục giỏ hàng từ trình duyệt và mặc định chọn tất cả sản phẩm.
    const savedCart = JSON.parse(
      localStorage.getItem('shoptt_cart') || '[]'
    );

    setCartItems(savedCart);

    setSelectedItems(
      savedCart.map((item, index) => `${item.productId}-${item.size}-${item.color}-${index}`)
    );
  }, []);

  const saveCart = (items) => {
    // Cập nhật giao diện đồng thời lưu thay đổi để giữ giỏ hàng sau khi tải lại.
    setCartItems(items);

    localStorage.setItem(
      'shoptt_cart',
      JSON.stringify(items)
    );
  };

  const getItemKey = (item, index) =>
    `${item.productId}-${item.size}-${item.color}-${index}`;

  const updateQuantity = (index, amount) => {
    const updated = [...cartItems];

    updated[index].quantity = Math.max(
      1,
      updated[index].quantity + amount
    );

    saveCart(updated);
  };

  const removeItem = (index) => {
    const updated = cartItems.filter(
      (_, itemIndex) => itemIndex !== index
    );

    saveCart(updated);

    setSelectedItems(
      updated.map((item, itemIndex) => getItemKey(item, itemIndex))
    );
  };

  const toggleItem = (key) => {
    setSelectedItems((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        cartItems.map((item, index) => getItemKey(item, index))
      );
    }
  };

  const selectedProducts = cartItems.filter(
    (item, index) =>
      selectedItems.includes(getItemKey(item, index))
  );

  const subtotal = selectedProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingFee = subtotal >= 500000 || subtotal === 0
    ? 0
    : 30000;

  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm.');
      return;
    }

    // Chỉ chuyển những mặt hàng đã chọn sang bước thanh toán.
    localStorage.setItem(
      'shoptt_checkout',
      JSON.stringify(selectedProducts)
    );

    navigate('/checkout');
  };

  return (
    <div className="cart-page">

      {/* BANNER */}
      <section className="cart-banner">
        <div className="container">
          <span>SHOPTT / SHOPPING CART</span>
          <h1>Giỏ hàng của bạn</h1>
          <p>Kiểm tra lại những sản phẩm bạn đã lựa chọn.</p>
        </div>
      </section>

      <main className="container cart-main">

        <div className="cart-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <span>Giỏ hàng</span>
        </div>

        {cartItems.length === 0 ? (

          <div className="cart-empty">
            <ShoppingBag size={55} />

            <h2>Giỏ hàng đang trống</h2>

            <p>
              Có vẻ bạn chưa thêm sản phẩm nào vào giỏ hàng.
            </p>

            <Link to="/products" className="cart-continue-button">
              Tiếp tục mua sắm <ArrowRight size={17} />
            </Link>
          </div>

        ) : (

          <div className="cart-layout">

            {/* CART LIST */}
            <section className="cart-list-section">

              <div className="cart-list-header">
                <label>
                  <input
                    type="checkbox"
                    checked={
                      cartItems.length > 0 &&
                      selectedItems.length === cartItems.length
                    }
                    onChange={toggleAll}
                  />
                  Chọn tất cả ({cartItems.length} sản phẩm)
                </label>

                <span>Sản phẩm</span>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
              </div>

              {cartItems.map((item, index) => {
                const key = getItemKey(item, index);

                return (
                  <article className="cart-item" key={key}>

                    <input
                      type="checkbox"
                      checked={selectedItems.includes(key)}
                      onChange={() => toggleItem(key)}
                    />

                    <div className="cart-product">
                      <img src={item.image} alt={item.name} />

                      <div>
                        <h3>{item.name}</h3>
                        <p>Màu: {item.color}</p>
                        <p>Kích thước: {item.size}</p>
                      </div>
                    </div>

                    <span className="cart-unit-price">
                      {formatPrice(item.price)}
                    </span>

                    <div className="cart-quantity">
                      <button
                        onClick={() => updateQuantity(index, -1)}
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(index, 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="cart-item-total">
                      <strong>
                        {formatPrice(item.price * item.quantity)}
                      </strong>

                      <button
                        onClick={() => removeItem(index)}
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                  </article>
                );
              })}

              <Link to="/products" className="back-shopping">
                <ArrowLeft size={17} />
                Tiếp tục mua sắm
              </Link>

            </section>

            {/* ORDER SUMMARY */}
            <aside className="cart-summary">

              <h2>Tóm tắt đơn hàng</h2>

              <div className="summary-line">
                <span>Sản phẩm đã chọn</span>
                <span>{selectedProducts.length}</span>
              </div>

              <div className="summary-line">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-line">
                <span>Phí vận chuyển</span>
                <span>
                  {shippingFee === 0
                    ? 'Miễn phí'
                    : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Tổng cộng</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <p className="shipping-note">
                {subtotal >= 500000
                  ? 'Bạn đã được miễn phí vận chuyển!'
                  : 'Miễn phí vận chuyển cho đơn từ 500.000đ.'}
              </p>

              <button
                className="checkout-button"
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
                <ArrowRight size={18} />
              </button>

            </aside>

          </div>

        )}

      </main>
    </div>
  );
}

export default Cart;
