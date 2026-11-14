import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

import './Auth.css';

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: ''
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

    // Tìm tài khoản đã đăng ký trong dữ liệu lưu cục bộ của trình duyệt.
    const users = JSON.parse(
      localStorage.getItem('shoptt_users') || '[]'
    );

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === form.email.toLowerCase() &&
        item.password === form.password
    );

    if (!user) {
      setError('Email hoặc mật khẩu không chính xác.');
      return;
    }

    // Không lưu mật khẩu vào phiên đăng nhập hiện tại.
    const { password, ...safeUser } = user;

    localStorage.setItem(
      'shoptt_user',
      JSON.stringify(safeUser)
    );

    navigate('/');
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-brand">
          <Link to="/">SHOPTT</Link>
          <span>FASHION STORE</span>
        </div>

        <div className="auth-heading">
          <span>WELCOME BACK</span>
          <h1>Chào mừng trở lại!</h1>
          <p>Đăng nhập để tiếp tục mua sắm cùng ShopTT.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">

          <label>
            Email

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập địa chỉ email"
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
                placeholder="Nhập mật khẩu"
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

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="auth-extra">
            <label className="remember-option">
              <input type="checkbox" />
              Ghi nhớ đăng nhập
            </label>

            <Link to="/forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" className="auth-submit">
            Đăng nhập
            <ArrowRight size={17} />
          </button>

        </form>

        <div className="auth-switch">
          Chưa có tài khoản?
          <Link to="/register"> Đăng ký ngay</Link>
        </div>

        <Link to="/" className="auth-back">
          Quay lại trang chủ
        </Link>

      </div>

    </div>
  );
}

export default Login;
