// Vai trò tệp: Màn hình React cho khu vực Profile; component chịu trách nhiệm tải dữ liệu, xử lý tương tác và dựng giao diện.
// Component được dùng trong cây giao diện; các import bên dưới cung cấp dữ liệu, điều hướng và kiểu hiển thị.

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  UserRound,
  MapPin,
  Package,
  LockKeyhole,
  LogOut,
  Save,
  Plus,
  Trash2,
  Star,
  ArrowLeft
} from 'lucide-react';

import './Profile.css';

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [addresses, setAddresses] = useState([]);

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    isDefault: false
  });

  const [editingAddress, setEditingAddress] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const savedUser = JSON.parse(
      localStorage.getItem('shoptt_user') || 'null'
    );

    if (!savedUser) {
      navigate('/login');
      return;
    }

    setUser(savedUser);

    setForm({
      fullName: savedUser.fullName || '',
      email: savedUser.email || '',
      phone: savedUser.phone || ''
    });

    const savedAddresses = savedUser.addresses || [];

    // Tương thích với tài khoản được tạo từ phiên bản Register trước.
    if (savedAddresses.length === 0 && (savedUser.address || savedUser.city)) {
      savedAddresses.push({
        id: Date.now(),
        fullName: savedUser.fullName || '',
        phone: savedUser.phone || '',
        address: savedUser.address || '',
        city: savedUser.city || '',
        isDefault: true
      });
    }

    setAddresses(savedAddresses);
  }, [navigate]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const updateUserStorage = (updatedUser) => {
    const users = JSON.parse(
      localStorage.getItem('shoptt_users') || '[]'
    );

    const updatedUsers = users.map((item) =>
      item.id === updatedUser.id
        ? { ...item, ...updatedUser }
        : item
    );

    localStorage.setItem(
      'shoptt_users',
      JSON.stringify(updatedUsers)
    );

    const { password, ...safeUser } = updatedUser;

    localStorage.setItem(
      'shoptt_user',
      JSON.stringify(safeUser)
    );

    setUser(safeUser);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!user) return;

    const users = JSON.parse(
      localStorage.getItem('shoptt_users') || '[]'
    );

    const emailExists = users.some(
      (item) =>
        item.id !== user.id &&
        item.email.toLowerCase() === form.email.toLowerCase()
    );

    if (emailExists) {
      showMessage('Email này đã được tài khoản khác sử dụng.');
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      showMessage('Số điện thoại không hợp lệ.');
      return;
    }

    const updatedUser = {
      ...user,
      ...form,
      addresses
    };

    updateUserStorage(updatedUser);
    showMessage('Cập nhật thông tin thành công!');
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: form.fullName,
      phone: form.phone,
      address: '',
      city: '',
      isDefault: addresses.length === 0
    });

    setEditingAddress(null);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    if (!phoneRegex.test(addressForm.phone.replace(/\s/g, ''))) {
      showMessage('Số điện thoại nhận hàng không hợp lệ.');
      return;
    }

    let updatedAddresses;

    if (editingAddress !== null) {
      updatedAddresses = addresses.map((item) =>
        item.id === editingAddress
          ? { ...item, ...addressForm }
          : item
      );
    } else {
      updatedAddresses = [
        ...addresses,
        {
          ...addressForm,
          id: Date.now()
        }
      ];
    }

    if (addressForm.isDefault) {
      updatedAddresses = updatedAddresses.map((item) => ({
        ...item,
        isDefault: item.id === (
          editingAddress ?? updatedAddresses[updatedAddresses.length - 1].id
        )
      }));
    }

    setAddresses(updatedAddresses);

    updateUserStorage({
      ...user,
      addresses: updatedAddresses
    });

    resetAddressForm();
    showMessage('Đã lưu địa chỉ giao hàng!');
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      isDefault: address.isDefault
    });

    setEditingAddress(address.id);
  };

  const handleDeleteAddress = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      return;
    }

    const updatedAddresses = addresses.filter(
      (item) => item.id !== id
    );

    if (
      updatedAddresses.length > 0 &&
      !updatedAddresses.some((item) => item.isDefault)
    ) {
      updatedAddresses[0].isDefault = true;
    }

    setAddresses(updatedAddresses);

    updateUserStorage({
      ...user,
      addresses: updatedAddresses
    });

    showMessage('Đã xóa địa chỉ!');
  };

  const handleSetDefault = (id) => {
    const updatedAddresses = addresses.map((item) => ({
      ...item,
      isDefault: item.id === id
    }));

    setAddresses(updatedAddresses);

    updateUserStorage({
      ...user,
      addresses: updatedAddresses
    });

    showMessage('Đã cập nhật địa chỉ mặc định!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(
      localStorage.getItem('shoptt_users') || '[]'
    );

    const currentUser = users.find(
      (item) => item.id === user.id
    );

    if (!currentUser || currentUser.password !== passwordForm.currentPassword) {
      showMessage('Mật khẩu hiện tại không chính xác.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showMessage('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    const updatedUser = {
      ...user,
      password: passwordForm.newPassword
    };

    const updatedUsers = users.map((item) =>
      item.id === user.id ? updatedUser : item
    );

    localStorage.setItem(
      'shoptt_users',
      JSON.stringify(updatedUsers)
    );

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    showMessage('Đổi mật khẩu thành công!');
  };

  const handleLogout = () => {
    if (!window.confirm('Bạn có chắc muốn đăng xuất?')) {
      return;
    }

    localStorage.removeItem('shoptt_user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="profile-page">

      <section className="profile-banner">
        <div className="container">
          <span>SHOPTT / MY ACCOUNT</span>
          <h1>Tài khoản của tôi</h1>
          <p>Quản lý thông tin và trải nghiệm mua sắm của bạn.</p>
        </div>
      </section>

      <main className="container profile-main">

        <div className="profile-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <span>Tài khoản</span>
        </div>

        <div className="profile-layout">

          <aside className="profile-sidebar">

            <div className="profile-user">
              <div className="profile-avatar">
                <UserRound size={28} />
              </div>

              <h3>{user.fullName}</h3>
              <p>{user.email}</p>
            </div>

            <nav className="profile-nav">

              <button
                className={activeTab === 'personal' ? 'active' : ''}
                onClick={() => setActiveTab('personal')}
              >
                <UserRound size={18} />
                Thông tin cá nhân
              </button>

              <button
                className={activeTab === 'addresses' ? 'active' : ''}
                onClick={() => setActiveTab('addresses')}
              >
                <MapPin size={18} />
                Địa chỉ giao hàng
              </button>

              <Link to="/orders" className="profile-order-link">
                 <Package size={18} />
                     Đơn hàng của tôi
            </Link>

              <button
                className={activeTab === 'password' ? 'active' : ''}
                onClick={() => setActiveTab('password')}
              >
                <LockKeyhole size={18} />
                Đổi mật khẩu
              </button>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Đăng xuất
              </button>

            </nav>

          </aside>

          <section className="profile-content">

            {message && (
              <div className="profile-message">
                {message}
              </div>
            )}

            {activeTab === 'personal' && (
              <div className="profile-card">

                <div className="profile-card-heading">
                  <h2>Thông tin cá nhân</h2>
                  <p>Cập nhật thông tin tài khoản của bạn.</p>
                </div>

                <form onSubmit={handleProfileSubmit}>

                  <div className="profile-form-grid">

                    <label>
                      Họ và tên
                      <input
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        required
                      />
                    </label>

                    <label>
                      Số điện thoại
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        required
                      />
                    </label>

                    <label className="profile-full-width">
                      Email
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </label>

                  </div>

                  <button type="submit" className="profile-save">
                    <Save size={17} />
                    Lưu thay đổi
                  </button>

                </form>

              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="profile-card">

                <div className="profile-card-heading">
                  <h2>Địa chỉ giao hàng</h2>
                  <p>Quản lý các địa chỉ nhận hàng của bạn.</p>
                </div>

                <div className="address-list">

                  {addresses.map((address) => (
                    <div className="address-item" key={address.id}>

                      <div className="address-item-info">

                        <div className="address-item-heading">
                          <strong>{address.fullName}</strong>

                          {address.isDefault && (
                            <span className="default-address">
                              <Star size={12} />
                              Mặc định
                            </span>
                          )}
                        </div>

                        <p>{address.phone}</p>
                        <p>{address.address}, {address.city}</p>

                      </div>

                      <div className="address-item-actions">

                        <button
                          onClick={() => handleEditAddress(address)}
                        >
                          Sửa
                        </button>

                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Đặt mặc định
                          </button>
                        )}

                        <button
                          className="delete-address"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </div>
                  ))}

                  {addresses.length === 0 && (
                    <p className="empty-address">
                      Bạn chưa lưu địa chỉ giao hàng nào.
                    </p>
                  )}

                </div>

                <div className="address-form">

                  <h3>
                    {editingAddress !== null
                      ? 'Chỉnh sửa địa chỉ'
                      : 'Thêm địa chỉ mới'}
                  </h3>

                  <form onSubmit={handleAddressSubmit}>

                    <div className="profile-form-grid">

                      <label>
                        Họ và tên người nhận
                        <input
                          value={addressForm.fullName}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              fullName: e.target.value
                            })
                          }
                          required
                        />
                      </label>

                      <label>
                        Số điện thoại
                        <input
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value
                            })
                          }
                          required
                        />
                      </label>

                      <label className="profile-full-width">
                        Địa chỉ
                        <input
                          value={addressForm.address}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              address: e.target.value
                            })
                          }
                          placeholder="Số nhà, tên đường, phường/xã..."
                          required
                        />
                      </label>

                      <label className="profile-full-width">
                        Tỉnh / Thành phố
                        <input
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value
                            })
                          }
                          required
                        />
                      </label>

                    </div>

                    <label className="default-checkbox">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            isDefault: e.target.checked
                          })
                        }
                      />
                      Đặt làm địa chỉ mặc định
                    </label>

                    <div className="address-form-actions">

                      <button type="submit" className="profile-save">
                        <Save size={16} />
                        Lưu địa chỉ
                      </button>

                      <button
                        type="button"
                        className="address-cancel"
                        onClick={resetAddressForm}
                      >
                        Hủy
                      </button>

                    </div>

                  </form>

                </div>

                <button
                  className="add-address-button"
                  onClick={() => {
                    resetAddressForm();

                    document.querySelector('.address-form')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                >
                  <Plus size={17} />
                  Thêm địa chỉ mới
                </button>

              </div>
            )}

            {activeTab === 'password' && (
              <div className="profile-card">

                <div className="profile-card-heading">
                  <h2>Đổi mật khẩu</h2>
                  <p>Đặt mật khẩu mới để bảo vệ tài khoản.</p>
                </div>

                <form
                  className="password-change-form"
                  onSubmit={handlePasswordSubmit}
                >

                  <label>
                    Mật khẩu hiện tại
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Mật khẩu mới
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Xác nhận mật khẩu mới
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value
                        })
                      }
                      required
                    />
                  </label>

                  <button type="submit" className="profile-save">
                    <LockKeyhole size={17} />
                    Cập nhật mật khẩu
                  </button>

                </form>

              </div>
            )}

            <Link to="/" className="profile-back">
              <ArrowLeft size={16} />
              Quay lại trang chủ
            </Link>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Profile;