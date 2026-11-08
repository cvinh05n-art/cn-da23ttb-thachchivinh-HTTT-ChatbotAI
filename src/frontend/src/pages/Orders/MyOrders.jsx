import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ArrowRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle
} from 'lucide-react';

import './MyOrders.css';

const formatPrice = (price) =>
  Number(price || 0).toLocaleString('vi-VN') + 'đ';

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

function getStatusIcon(status) {
  switch (status) {
    case 'Chờ xác nhận':
      return <Clock size={16} />;

    case 'Đang xử lý':
      return <Package size={16} />;

    case 'Đang giao':
      return <Truck size={16} />;

    case 'Hoàn thành':
      return <CheckCircle2 size={16} />;

    case 'Đã hủy':
      return <XCircle size={16} />;

    default:
      return <Package size={16} />;
  }
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem('shoptt_orders') || '[]'
    );

    setOrders(
      savedOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    );
  }, []);

  const filters = [
    'Tất cả',
    'Chờ xác nhận',
    'Đang xử lý',
    'Đang giao',
    'Hoàn thành',
    'Đã hủy'
  ];

  const filteredOrders =
    activeFilter === 'Tất cả'
      ? orders
      : orders.filter(
          (order) => order.status === activeFilter
        );

  return (
    <div className="my-orders-page">

      {/* BANNER */}
      <section className="orders-banner">
        <div className="container">
          <span>SHOPTT / TÀI KHOẢN</span>
          <h1>Đơn hàng của tôi</h1>
          <p>Theo dõi và quản lý các đơn hàng của bạn.</p>
        </div>
      </section>

      <main className="container orders-main">

        {/* BREADCRUMB */}
        <div className="orders-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/profile">Tài khoản</Link>
          <span>/</span>
          <span>Đơn hàng</span>
        </div>

        {/* HEADING */}
        <div className="orders-heading">
          <div>
            <h2>Lịch sử mua hàng</h2>
            <p>Bạn có {orders.length} đơn hàng.</p>
          </div>

          <Link to="/products" className="orders-shopping-link">
            Tiếp tục mua sắm
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* FILTER */}
        <div className="orders-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={
                activeFilter === filter ? 'active' : ''
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ORDER LIST */}
        {filteredOrders.length > 0 ? (

          <div className="orders-list">

            {filteredOrders.map((order) => (

              <article
                className="order-card"
                key={order.orderCode}
              >

                {/* ORDER HEADER */}
                <div className="order-card-header">

                  <div>
                    <span className="order-label">
                      MÃ ĐƠN HÀNG
                    </span>

                    <h3>{order.orderCode}</h3>
                  </div>

                  <div
                    className={`order-status ${
                      order.status === 'Hoàn thành'
                        ? 'completed'
                        : order.status === 'Đã hủy'
                        ? 'cancelled'
                        : order.status === 'Đang giao'
                        ? 'shipping'
                        : 'pending'
                    }`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>

                </div>

                {/* ORDER BODY */}
                <div className="order-card-body">

                  <div className="order-products">

                    {order.products?.slice(0, 3).map(
                      (product, index) => (

                        <div
                          className="order-product-item"
                          key={index}
                        >

                          <img
                            src={product.image}
                            alt={product.name}
                          />

                          <div>
                            <h4>{product.name}</h4>

                            <p>
                              {product.size} / {product.color}
                            </p>

                            <span>
                              Số lượng: {product.quantity}
                            </span>
                          </div>

                        </div>

                      )
                    )}

                    {order.products?.length > 3 && (
                      <p className="order-more-products">
                        Và {order.products.length - 3} sản phẩm khác
                      </p>
                    )}

                  </div>

                  <div className="order-information">

                    <div>
                      <span>Ngày đặt</span>
                      <strong>
                        {formatDate(order.createdAt)}
                      </strong>
                    </div>

                    <div>
                      <span>Người nhận</span>
                      <strong>
                        {order.customer?.fullName || 'Chưa có thông tin'}
                      </strong>
                    </div>

                    <div>
                      <span>Thanh toán</span>
                      <strong>
                        {order.paymentMethod === 'cod'
                          ? 'Thanh toán khi nhận hàng'
                          : 'Chuyển khoản ngân hàng'}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* ORDER FOOTER */}
                <div className="order-card-footer">

                  <div>
                    <span>Tổng thanh toán</span>
                    <strong>{formatPrice(order.total)}</strong>
                  </div>

                  <Link
                    to={`/orders/${order.orderCode}`}
                    className="order-detail-button"
                  >
                    Xem chi tiết
                    <ArrowRight size={16} />
                  </Link>

                </div>

              </article>

            ))}

          </div>

        ) : (

          /* EMPTY STATE */
          <div className="orders-empty">

            <div className="orders-empty-icon">
              <ShoppingBag size={38} />
            </div>

            <h3>
              {orders.length === 0
                ? 'Bạn chưa có đơn hàng nào'
                : 'Không tìm thấy đơn hàng'}
            </h3>

            <p>
              {orders.length === 0
                ? 'Những đơn hàng bạn đặt sẽ xuất hiện tại đây.'
                : 'Không có đơn hàng nào thuộc trạng thái này.'}
            </p>

            {orders.length === 0 && (
              <Link to="/products">
                Khám phá sản phẩm
              </Link>
            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default MyOrders;