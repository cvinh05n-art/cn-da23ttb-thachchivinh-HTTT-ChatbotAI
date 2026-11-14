// Vai trò tệp: Màn hình React cho khu vực Admin; component chịu trách nhiệm tải dữ liệu, xử lý tương tác và dựng giao diện.
// Component được dùng trong cây giao diện; các import bên dưới cung cấp dữ liệu, điều hướng và kiểu hiển thị.

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  Clock
} from 'lucide-react';

import './Dashboard.css';

function Dashboard() {

  const statistics = [
    {
      title: 'Tổng doanh thu',
      value: '125.500.000đ',
      change: '+12.5%',
      icon: <DollarSign size={22} />,
      color: 'brown'
    },
    {
      title: 'Tổng đơn hàng',
      value: '248',
      change: '+8.2%',
      icon: <ShoppingBag size={22} />,
      color: 'blue'
    },
    {
      title: 'Khách hàng',
      value: '186',
      change: '+15.3%',
      icon: <Users size={22} />,
      color: 'green'
    },
    {
      title: 'Sản phẩm',
      value: '56',
      change: '+4.5%',
      icon: <Package size={22} />,
      color: 'orange'
    }
  ];

  const recentOrders = [
    {
      code: '#ST001',
      customer: 'Nguyễn Văn A',
      date: '08/11/2026',
      total: '1.250.000đ',
      status: 'Chờ xác nhận'
    },
    {
      code: '#ST002',
      customer: 'Trần Thị B',
      date: '08/11/2026',
      total: '850.000đ',
      status: 'Đang giao'
    },
    {
      code: '#ST003',
      customer: 'Lê Văn C',
      date: '07/11/2026',
      total: '2.100.000đ',
      status: 'Hoàn thành'
    },
    {
      code: '#ST004',
      customer: 'Phạm Thị D',
      date: '07/11/2026',
      total: '650.000đ',
      status: 'Đã hủy'
    }
  ];

  const topProducts = [
    {
      name: 'Áo thun Basic',
      category: 'Áo nam',
      sold: 85
    },
    {
      name: 'Quần Jeans Classic',
      category: 'Quần nam',
      sold: 62
    },
    {
      name: 'Áo sơ mi Minimal',
      category: 'Áo nữ',
      sold: 48
    },
    {
      name: 'Váy Linen',
      category: 'Váy nữ',
      sold: 35
    }
  ];

  return (
    <div className="dashboard">

      {/* PAGE TITLE */}

      <div className="dashboard-heading">
        <div>
          <h1>Tổng quan</h1>
          <p>Chào mừng quay trở lại với hệ thống ShopTT.</p>
        </div>

        <div className="dashboard-date">
          <Clock size={16} />
          <span>Tháng 11, 2026</span>
        </div>
      </div>

      {/* STATISTICS */}

      <div className="dashboard-stats">

        {statistics.map((item, index) => (
          <div className="stat-card" key={index}>

            <div className="stat-top">
              <span>{item.title}</span>

              <div className={`stat-icon ${item.color}`}>
                {item.icon}
              </div>
            </div>

            <h2>{item.value}</h2>

            <div className="stat-change">
              <TrendingUp size={14} />
              <span>{item.change}</span>
              <small>so với tháng trước</small>
            </div>

          </div>
        ))}

      </div>

      {/* CHART PLACEHOLDER */}

      <div className="dashboard-chart-section">

        <div className="section-heading">
          <div>
            <h3>Doanh thu tổng quan</h3>
            <p>Thống kê doanh thu trong năm</p>
          </div>

          <select defaultValue="2026">
            <option value="2026">Năm 2026</option>
            <option value="2025">Năm 2025</option>
          </select>
        </div>

        <div className="chart-placeholder">
          <div className="chart-bars">
            {[45, 65, 50, 80, 60, 90, 70, 55, 85, 65, 95, 75].map(
              (height, index) => (
                <div className="chart-column" key={index}>
                  <div
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  />
                  <span>{`T${index + 1}`}</span>
                </div>
              )
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION */}

      <div className="dashboard-bottom">

        {/* RECENT ORDERS */}

        <div className="dashboard-panel">

          <div className="section-heading">
            <div>
              <h3>Đơn hàng gần đây</h3>
              <p>Các đơn hàng mới nhất</p>
            </div>

            <a href="/admin/orders">Xem tất cả</a>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.code}>
                    <td>{order.code}</td>
                    <td>{order.customer}</td>
                    <td>{order.total}</td>
                    <td>
                      <span
                        className={`order-status ${
                          order.status === 'Chờ xác nhận'
                            ? 'pending'
                            : order.status === 'Đang giao'
                            ? 'shipping'
                            : order.status === 'Hoàn thành'
                            ? 'completed'
                            : 'cancelled'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

        {/* TOP PRODUCTS */}

        <div className="dashboard-panel">

          <div className="section-heading">
            <div>
              <h3>Sản phẩm bán chạy</h3>
              <p>Sản phẩm có lượt bán cao</p>
            </div>

            <ArrowUpRight size={19} />
          </div>

          <div className="top-product-list">

            {topProducts.map((product, index) => (
              <div className="top-product-item" key={index}>

                <div className="top-product-number">
                  {index + 1}
                </div>

                <div className="top-product-info">
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </div>

                <div className="top-product-sold">
                  {product.sold} đã bán
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      <div className="dashboard-note">
        <strong>Lưu ý:</strong> Các số liệu hiện tại là dữ liệu minh họa
        để hoàn thiện giao diện. Dashboard sẽ được kết nối SQL Server
        ở giai đoạn tích hợp Backend.
      </div>

    </div>
  );
}

export default Dashboard;