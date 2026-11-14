// Vai trò tệp: Màn hình React cho khu vực Admin; component chịu trách nhiệm tải dữ liệu, xử lý tương tác và dựng giao diện.
// Component được dùng trong cây giao diện; các import bên dưới cung cấp dữ liệu, điều hướng và kiểu hiển thị.

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  UserCog,
  Store,
  LogOut,
  Menu,
  Bell
} from 'lucide-react';

import { useState } from 'react';
import './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      title: 'Tổng quan',
      path: '/admin',
      icon: <LayoutDashboard size={19} />
    },
    {
      title: 'Sản phẩm',
      path: '/admin/products',
      icon: <Package size={19} />
    },
    {
      title: 'Danh mục',
      path: '/admin/categories',
      icon: <Tags size={19} />
    },
    {
      title: 'Đơn hàng',
      path: '/admin/orders',
      icon: <ShoppingBag size={19} />
    },
    {
      title: 'Khách hàng',
      path: '/admin/customers',
      icon: <Users size={19} />
    },
    {
      title: 'Tài khoản quản trị',
      path: '/admin/accounts',
      icon: <UserCog size={19} />
    }
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      'Bạn có chắc chắn muốn đăng xuất?'
    );

    if (confirmLogout) {
      navigate('/login');
    }
  };

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>

        <div className="admin-logo">
          <Store size={25} />
          <span>ShopTT <small>ADMIN</small></span>
        </div>

        <div className="admin-menu-label">
          QUẢN LÝ HỆ THỐNG
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            className="admin-nav-link logout-link"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Đăng xuất</span>
          </button>

          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Quản trị viên</small>
            </div>
          </div>
        </div>

      </aside>

      {/* Main content */}
      <main className="admin-main">

        <header className="admin-header">

          <button
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={22} />
          </button>

          <div className="admin-header-title">
            <h2>Quản trị hệ thống</h2>
            <p>Quản lý và theo dõi hoạt động ShopTT</p>
          </div>

          <div className="admin-header-actions">
            <button className="admin-notification">
              <Bell size={20} />
            </button>

            <div className="admin-header-avatar">
              A
            </div>
          </div>

        </header>

        <div className="admin-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;