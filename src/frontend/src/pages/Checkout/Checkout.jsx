// Vai trò tệp: Màn hình React cho khu vực Checkout; component chịu trách nhiệm tải dữ liệu, xử lý tương tác và dựng giao diện.
// Component được dùng trong cây giao diện; các import bên dưới cung cấp dữ liệu, điều hướng và kiểu hiển thị.

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  MapPin,
  CreditCard,
  Banknote,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

import './Checkout.css';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN') + 'đ';

function Checkout() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    note: ''
  });

  useEffect(() => {
    // Danh sách này được trang giỏ hàng lưu trước khi điều hướng tới checkout.
    const checkoutItems = JSON.parse(
      localStorage.getItem('shoptt_checkout') || '[]'
    );

    setItems(checkoutItems);
  }, []);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingFee = subtotal >= 500000 || subtotal === 0
    ? 0
    : 30000;

  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    // Dùng thuộc tính name của input để cập nhật đúng trường trong form.
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Không có sản phẩm để thanh toán.');
      return;
    }

    // Chuẩn hóa khoảng trắng trước khi kiểm tra số điện thoại Việt Nam.
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      alert('Số điện thoại không hợp lệ.');
      return;
    }

    // Tạo đơn hàng minh họa; dữ liệu hiện được lưu ở localStorage.
    const newOrder = {
      orderCode: 'ST' + Date.now(),
      customer: form,
      products: items,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: 'Chờ xác nhận'
    };

    // Lưu đơn hàng minh họa ở frontend
    const orders = JSON.parse(
      localStorage.getItem('shoptt_orders') || '[]'
    );

    orders.push(newOrder);

    localStorage.setItem(
      'shoptt_orders',
      JSON.stringify(orders)
    );

    // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
    const cart = JSON.parse(
      localStorage.getItem('shoptt_cart') || '[]'
    );

    const remainingCart = [...cart];

    items.forEach((checkoutItem) => {
      const index = remainingCart.findIndex(
        (cartItem) =>
          cartItem.productId === checkoutItem.productId &&
          cartItem.size === checkoutItem.size &&
          cartItem.color === checkoutItem.color &&
          cartItem.quantity >= checkoutItem.quantity
      );

      if (index !== -1) {
        remainingCart[index].quantity -= checkoutItem.quantity;

        if (remainingCart[index].quantity <= 0) {
          remainingCart.splice(index, 1);
        }
      }
    });

    localStorage.setItem(
      'shoptt_cart',
      JSON.stringify(remainingCart)
    );

    localStorage.removeItem('shoptt_checkout');

    setOrderCode(newOrder.orderCode);
    setOrderSuccess(true);
  };

  if (orderSuccess) {
    return (
      <div className="checkout-success container">

        <CheckCircle2 size={65} />

        <h1>Đặt hàng thành công!</h1>

        <p>
          Cảm ơn bạn đã mua sắm tại ShopTT.
        </p>

        <div className="success-order-code">
          Mã đơn hàng: <strong>{orderCode}</strong>
        </div>

        <p className="success-note">
          Đây là đơn hàng minh họa trên trình duyệt.
          Hệ thống chưa gửi đơn hàng đến máy chủ.
        </p>

        <div className="success-actions">
          <Link to="/products">
            Tiếp tục mua sắm
          </Link>

          <Link to="/">
            Về trang chủ
          </Link>
        </div>

      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty container">
        <ShoppingBag size={45} />

        <h2>Chưa có sản phẩm thanh toán</h2>

        <p>Vui lòng quay lại giỏ hàng để lựa chọn sản phẩm.</p>

        <Link to="/products">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <section className="checkout-banner">
        <div className="container">
          <span>SHOPTT / CHECKOUT</span>
          <h1>Thanh toán</h1>
          <p>Hoàn tất thông tin để đặt hàng.</p>
        </div>
      </section>

      <main className="container checkout-main">

        <div className="checkout-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/cart">Giỏ hàng</Link>
          <span>/</span>
          <span>Thanh toán</span>
        </div>

        <form
          className="checkout-layout"
          onSubmit={handleSubmit}
        >

          {/* CUSTOMER INFORMATION */}
          <section className="checkout-information">

            <div className="checkout-card">

              <div className="checkout-card-title">
                <MapPin size={20} />
                <h2>Thông tin nhận hàng</h2>
              </div>

              <div className="checkout-form-grid">

                <label>
                  Họ và tên *
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </label>

                <label>
                  Số điện thoại *
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </label>

                <label className="full-width">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                  />
                </label>

                <label className="full-width">
                  Địa chỉ nhận hàng *
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường, phường/xã..."
                    required
                  />
                </label>

                <label className="full-width">
                  Tỉnh / Thành phố *
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Nhập tỉnh hoặc thành phố"
                    required
                  />
                </label>

                <label className="full-width">
                  Ghi chú đơn hàng
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Ghi chú thêm cho đơn hàng..."
                    rows="3"
                  />
                </label>

              </div>

            </div>

            {/* PAYMENT */}
            <div className="checkout-card">

              <div className="checkout-card-title">
                <CreditCard size={20} />
                <h2>Phương thức thanh toán</h2>
              </div>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <Banknote size={21} />

                <div>
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <p>Thanh toán trực tiếp cho đơn vị vận chuyển.</p>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <CreditCard size={21} />

                <div>
                  <strong>Chuyển khoản ngân hàng</strong>
                  <p>Phương thức minh họa, chưa tích hợp ngân hàng.</p>
                </div>
              </label>

            </div>

          </section>

          {/* ORDER SUMMARY */}
          <aside className="checkout-summary">

            <h2>Đơn hàng của bạn</h2>

            <div className="checkout-products">

              {items.map((item, index) => (
                <div className="checkout-product" key={index}>

                  <img src={item.image} alt={item.name} />

                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      {item.size} / {item.color}
                    </p>

                    <span>Số lượng: {item.quantity}</span>
                  </div>

                  <strong>
                    {formatPrice(item.price * item.quantity)}
                  </strong>

                </div>
              ))}

            </div>

            <div className="checkout-summary-line">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="checkout-summary-line">
              <span>Vận chuyển</span>
              <span>
                {shippingFee === 0
                  ? 'Miễn phí'
                  : formatPrice(shippingFee)}
              </span>
            </div>

            <div className="checkout-total">
              <span>Tổng thanh toán</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <p className="checkout-disclaimer">
              Bằng việc đặt hàng, bạn xác nhận thông tin nhận hàng
              đã cung cấp là chính xác.
            </p>

            <button type="submit" className="place-order-button">
              Xác nhận đặt hàng
            </button>

            <Link to="/cart" className="return-cart">
              <ArrowLeft size={16} />
              Quay lại giỏ hàng
            </Link>

          </aside>

        </form>

      </main>
    </div>
  );
}

export default Checkout;
