import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag
} from 'lucide-react';

import './OrderDetail.css';

const formatPrice = (price) =>
  Number(price || 0).toLocaleString('vi-VN') + 'đ';

const formatDate = (date) =>
  new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

function OrderDetail() {
  const { orderCode } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(
      localStorage.getItem('shoptt_orders') || '[]'
    );

    const foundOrder = orders.find(
      (item) => item.orderCode === orderCode
    );

    setOrder(foundOrder || null);
  }, [orderCode]);

  const cancelOrder = () => {
    if (!order || order.status !== 'Chờ xác nhận') return;

    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn hủy đơn hàng này không?'
    );

    if (!confirmed) return;

    const orders = JSON.parse(
      localStorage.getItem('shoptt_orders') || '[]'
    );

    const updatedOrders = orders.map((item) =>
      item.orderCode === orderCode
        ? { ...item, status: 'Đã hủy' }
        : item
    );

    localStorage.setItem(
      'shoptt_orders',
      JSON.stringify(updatedOrders)
    );

    setOrder({
      ...order,
      status: 'Đã hủy'
    });

    alert('Đơn hàng đã được hủy.');
  };

  if (!order) {
    return (
      <div className="order-detail-not-found container">
        <Package size={50} />
        <h2>Không tìm thấy đơn hàng</h2>
        <p>Đơn hàng không tồn tại hoặc đã bị xóa.</p>

        <Link to="/orders">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const customer = order.customer || {};

  const statusIcon = {
    'Chờ xác nhận': <Clock size={19} />,
    'Đang xử lý': <Package size={19} />,
    'Đang giao': <Truck size={19} />,
    'Hoàn thành': <CheckCircle2 size={19} />,
    'Đã hủy': <XCircle size={19} />
  };

  const statusClass = {
    'Chờ xác nhận': 'pending',
    'Đang xử lý': 'processing',
    'Đang giao': 'shipping',
    'Hoàn thành': 'completed',
    'Đã hủy': 'cancelled'
  };

  return (
    <div className="order-detail-page">

      {/* BANNER */}
      <section className="order-detail-banner">
        <div className="container">
          <span>SHOPTT / ĐƠN HÀNG</span>
          <h1>Chi tiết đơn hàng</h1>
          <p>Thông tin chi tiết về đơn hàng của bạn.</p>
        </div>
      </section>

      <main className="container order-detail-main">

        {/* BREADCRUMB */}
        <div className="order-detail-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/orders">Đơn hàng</Link>
          <span>/</span>
          <span>Chi tiết</span>
        </div>

        {/* ORDER TOP */}
        <div className="order-detail-top">

          <div>
            <Link to="/orders" className="order-back-link">
              <ArrowLeft size={17} />
              Quay lại đơn hàng
            </Link>

            <h2>{order.orderCode}</h2>

            <p>
              Ngày đặt hàng: {formatDate(order.createdAt)}
            </p>
          </div>

          <div
            className={`detail-status ${
              statusClass[order.status] || 'pending'
            }`}
          >
            {statusIcon[order.status] || <Package size={19} />}
            {order.status}
          </div>

        </div>

        {/* STATUS INFORMATION */}
        <section className="order-detail-card">

          <div className="detail-section-title">
            <Package size={20} />
            <h3>Trạng thái đơn hàng</h3>
          </div>

          <div className="order-status-information">
            <div className="status-information-icon">
              {statusIcon[order.status] || <Package size={22} />}
            </div>

            <div>
              <strong>{order.status}</strong>
              <p>
                {order.status === 'Chờ xác nhận'
                  ? 'Đơn hàng đang chờ cửa hàng xác nhận.'
                  : order.status === 'Đang xử lý'
                  ? 'Cửa hàng đang chuẩn bị đơn hàng.'
                  : order.status === 'Đang giao'
                  ? 'Đơn hàng đang được vận chuyển đến bạn.'
                  : order.status === 'Hoàn thành'
                  ? 'Đơn hàng đã được giao thành công.'
                  : 'Đơn hàng đã bị hủy.'}
              </p>
            </div>
          </div>

        </section>

        {/* CUSTOMER INFORMATION */}
        <section className="order-detail-card">

          <div className="detail-section-title">
            <MapPin size={20} />
            <h3>Thông tin nhận hàng</h3>
          </div>

          <div className="detail-customer-grid">

            <div>
              <span>Người nhận</span>
              <strong>{customer.fullName || 'Chưa cập nhật'}</strong>
            </div>

            <div>
              <span>Số điện thoại</span>
              <strong>{customer.phone || 'Chưa cập nhật'}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{customer.email || 'Chưa cập nhật'}</strong>
            </div>

            <div>
              <span>Địa chỉ</span>
              <strong>
                {customer.address || 'Chưa cập nhật'}
              </strong>
            </div>

            <div>
              <span>Tỉnh / Thành phố</span>
              <strong>{customer.city || 'Chưa cập nhật'}</strong>
            </div>

            {customer.note && (
              <div className="detail-customer-note">
                <span>Ghi chú</span>
                <strong>{customer.note}</strong>
              </div>
            )}

          </div>

        </section>

        {/* PRODUCT INFORMATION */}
        <section className="order-detail-card">

          <div className="detail-section-title">
            <ShoppingBag size={20} />
            <h3>Sản phẩm đã đặt</h3>
          </div>

          <div className="detail-product-list">

            {order.products?.map((product, index) => (

              <div className="detail-product" key={index}>

                <img
                  src={product.image}
                  alt={product.name}
                />

                <div className="detail-product-info">
                  <h4>{product.name}</h4>

                  <p>
                    Kích thước: {product.size || 'Không có'}
                  </p>

                  <p>
                    Màu sắc: {product.color || 'Không có'}
                  </p>

                  <p>Số lượng: {product.quantity}</p>
                </div>

                <strong>
                  {formatPrice(product.price * product.quantity)}
                </strong>

              </div>

            ))}

          </div>

        </section>

        {/* PAYMENT INFORMATION */}
        <section className="order-detail-card">

          <div className="detail-section-title">
            <CreditCard size={20} />
            <h3>Thông tin thanh toán</h3>
          </div>

          <div className="detail-payment">

            <div>
              <span>Phương thức thanh toán</span>

              <strong>
                {order.paymentMethod === 'cod'
                  ? 'Thanh toán khi nhận hàng (COD)'
                  : 'Chuyển khoản ngân hàng'}
              </strong>
            </div>

            <div>
              <span>Tạm tính</span>
              <strong>{formatPrice(order.subtotal)}</strong>
            </div>

            <div>
              <span>Phí vận chuyển</span>
              <strong>{formatPrice(order.shippingFee)}</strong>
            </div>

            <div className="detail-payment-total">
              <span>Tổng thanh toán</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>

          </div>

        </section>

        {/* ACTIONS */}
        <div className="order-detail-actions">

          {order.status === 'Chờ xác nhận' && (
            <button
              className="cancel-order-button"
              onClick={cancelOrder}
            >
              <XCircle size={17} />
              Hủy đơn hàng
            </button>
          )}

          <Link to="/orders" className="back-orders-button">
            <ArrowLeft size={17} />
            Danh sách đơn hàng
          </Link>

        </div>

      </main>

    </div>
  );
}

export default OrderDetail;