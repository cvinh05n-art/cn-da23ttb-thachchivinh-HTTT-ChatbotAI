// Vai trò tệp: Màn hình React cho khu vực Auth; component chịu trách nhiệm tải dữ liệu, xử lý tương tác và dựng giao diện.
// Component được dùng trong cây giao diện; các import bên dưới cung cấp dữ liệu, điều hướng và kiểu hiển thị.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

import './Auth.css';

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra thông tin trước khi tạo tài khoản mới.
    if (form.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ.');
      return;
    }

    // Đọc danh sách tài khoản hiện có để kiểm tra email bị trùng.
    const users = JSON.parse(
      localStorage.getItem('shoptt_users') || '[]'
    );

    const existed = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.toLowerCase()
    );

    if (existed) {
      setError('Email này đã được đăng ký.');
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: '',
      city: '',
      role: 'customer',
      createdAt: new Date().toISOString(),
      password: form.password
    };

    users.push(newUser);

    localStorage.setItem(
      'shoptt_users',
      JSON.stringify(users)
    );

    alert('Đăng ký tài khoản thành công!');

    navigate('/login');
  };

  return (
    <div className="auth-page">

      <div className="auth-container register-container">

        <div className="auth-brand">
          <Link to="/">SHOPTT</Link>
          <span>FASHION STORE</span>
        </div>

        <div className="auth-heading">
          <span>JOIN OUR COMMUNITY</span>
          <h1>Tạo tài khoản</h1>
          <p>Đăng ký để trải nghiệm mua sắm tại ShopTT.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">

          <label>
            Họ và tên

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
            Email

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </label>

          <label>
            Số điện thoại

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </label>

          <label>
            Mật khẩu

            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Tối thiểu 8 ký tự"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label>
            Xác nhận mật khẩu

            <div className="password-input">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm
                  ? <EyeOff size={18} />
                  : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button type="submit" className="auth-submit">
            Tạo tài khoản
            <ArrowRight size={17} />
          </button>

        </form>

        <div className="auth-switch">
          Đã có tài khoản?
          <Link to="/login"> Đăng nhập</Link>
        </div>

        <Link to="/" className="auth-back">
          Quay lại trang chủ
        </Link>

      </div>

    </div>
  );
}

export default Register;
