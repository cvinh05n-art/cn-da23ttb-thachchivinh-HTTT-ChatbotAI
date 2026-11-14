// Vai trò tệp: Màn hình React cho khu vực Home; component chịu trách nhiệm tải dữ liệu, xử lý tương tác và dựng giao diện.
// Component được dùng trong cây giao diện; các import bên dưới cung cấp dữ liệu, điều hướng và kiểu hiển thị.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  Heart,
  ArrowRight,
  MessageCircle,
  X,
  Send,
  Sparkles
} from 'lucide-react';

import './Home.css';


const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect width="100%" height="100%" fill="#eeeae4"/><text x="50%" y="48%" text-anchor="middle" font-family="Arial" font-size="36" fill="#82715f">SHOPTT</text><text x="50%" y="54%" text-anchor="middle" font-family="Arial" font-size="20" fill="#82715f">Chưa có hình ảnh</text></svg>'
);
const formatPrice = (price) => Number(price || 0).toLocaleString('vi-VN') + 'đ';



function Home() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    let active = true;
    api.get('/products')
      .then(({ data }) => {
        if (!active) return;
        const rows = Array.isArray(data?.data) ? data.data : [];
        setProducts(rows
          .filter((p) => String(p.Status || '').toLowerCase() === 'active')
          .slice(0, 4)
          .map((p) => ({
            id: p.ProductID,
            name: p.ProductName,
            category: p.CategoryName || 'Sản phẩm',
            price: Number(p.BasePrice || 0),
            image: p.ImageURL || FALLBACK_IMAGE,
          })));
      })
      .catch((error) => {
        console.error('Không tải được sản phẩm nổi bật:', error);
        if (active) setProductsError('Không thể tải sản phẩm. Vui lòng thử lại.');
      })
      .finally(() => { if (active) setProductsLoading(false); });
    return () => { active = false; };
  }, []);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      text: 'Xin chào! Mình là trợ lý ShopTT. Bạn đang tìm kiếm sản phẩm nào?',
      sender: 'bot'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: message, sender: 'user' },
      {
        text: 'Cảm ơn bạn! Tính năng tư vấn AI sẽ được tích hợp trong giai đoạn tiếp theo.',
        sender: 'bot'
      }
    ]);

    setMessage('');
  };

  return (
    <div className="home-page">

      {/* TOP ANNOUNCEMENT */}
      <div className="announcement">
        MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 500.000Đ
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="container header-content">

          <button className="mobile-menu">
            <Menu size={22} />
          </button>

          <a href="/" className="logo">
            Shop<span>TT.</span>
          </a>

         <nav className="navigation">
             <a href="/">Trang chủ</a>
             <a href="/products">Sản phẩm</a>
            <a href="/#products">Sản phẩm</a>
            <a href="/#about">Giới thiệu</a>
            </nav>

          <div className="header-actions">
            <button aria-label="Tìm kiếm">
              <Search size={20} />
            </button>

            <Link to="/profile" aria-label="Tài khoản">
             <UserRound size={20} />
            </Link>

            <Link to="/wishlist" aria-label="Danh sách yêu thích">
            <Heart size={20} />
            </Link>

            <a href="/cart" aria-label="Giỏ hàng">
                <ShoppingBag size={20} />
            </a>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-image"></div>

        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-subtitle">BỘ SƯU TẬP MỚI 2026</span>

            <h1>
              Đơn giản là
              <br />
              <span>phong cách.</span>
            </h1>

            <p>
              Khám phá phong cách thời trang tối giản,
              tinh tế và phù hợp với cá tính của bạn.
            </p>

            <a href="#products" className="primary-button">
              Khám phá ngay <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        <div className="container benefits-grid">
          <div>
            <span>01</span>
            <h3>Chất lượng chọn lọc</h3>
            <p>Sản phẩm được tuyển chọn kỹ lưỡng.</p>
          </div>

          <div>
            <span>02</span>
            <h3>Giao hàng toàn quốc</h3>
            <p>Đưa sản phẩm đến tận tay bạn.</p>
          </div>

          <div>
            <span>03</span>
            <h3>Thanh toán linh hoạt</h3>
            <p>Nhiều phương thức thanh toán tiện lợi.</p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section product-section" id="products">
        <div className="container">

          <div className="section-heading">
            <div>
              <h2>Sản phẩm nổi bật</h2>
              <p>Những sản phẩm được tuyển chọn dành cho bạn.</p>
            </div>

            <a href="#products" className="text-link">
              Xem tất cả <ArrowRight size={16} />
            </a>
          </div>

          {productsLoading ? (
            <p>Đang tải sản phẩm nổi bật...</p>
          ) : productsError ? (
            <p>{productsError}</p>
          ) : products.length === 0 ? (
            <p>Chưa có sản phẩm đang kinh doanh.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <Link to={`/products/${product.id}`} className="product-card" key={product.id}>
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    />
                    <span className="product-label">NEW</span>
                  </div>
                  <div className="product-info">
                    <span>{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* PROMOTION */}
      <section className="promotion" id="about">
        <div className="container promotion-content">

          <div className="promotion-text">
            <span>SHOPTT COLLECTION</span>

            <h2>
              Tìm thấy phong cách
              <br />
              của riêng bạn.
            </h2>

            <p>
              Thời trang không cần quá cầu kỳ.
              Đôi khi sự đơn giản chính là điểm nhấn.
            </p>

            <a href="#products" className="primary-button">
              Mua sắm ngay <ArrowRight size={17} />
            </a>
          </div>

          <div className="promotion-image">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900"
              alt="ShopTT Collection"
            />
          </div>

        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <div className="container">
          <h2>Đừng bỏ lỡ những điều mới mẻ</h2>

          <p>
            Theo dõi ShopTT để cập nhật bộ sưu tập và ưu đãi mới nhất.
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
            />

            <button type="submit">Đăng ký</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-content">

          <div className="footer-brand">
            <a href="/" className="logo">
              Shop<span>TT.</span>
            </a>

            <p>
              Phong cách tối giản, lựa chọn tinh tế.
              Đồng hành cùng bạn trong từng khoảnh khắc.
            </p>
          </div>

          <div>
            <h3>Khám phá</h3>
            <a href="#products">Sản phẩm</a>
            <a href="#products">Sản phẩm</a>
            <a href="#about">Giới thiệu</a>
          </div>

          <div>
            <h3>Hỗ trợ</h3>
            <a href="#footer">Chính sách mua hàng</a>
            <a href="#footer">Chính sách đổi trả</a>
            <a href="#footer">Liên hệ</a>
          </div>

          <div>
            <h3>Thông tin</h3>
            <p>Email: support@shoptt.vn</p>
            <p>Hotline: 1900 0000</p>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 ShopTT. All rights reserved.
        </div>
      </footer>

      {/* CHATBOT BUTTON */}
      <button
        className="chatbot-button"
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Mở trợ lý ShopTT"
      >
        {chatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* CHATBOT WINDOW */}
      {chatOpen && (
        <div className="chatbot-window">

          <div className="chatbot-header">
            <div>
              <Sparkles size={19} />
              <div>
                <h3>ShopTT Assistant</h3>
                <span>Trợ lý mua sắm</span>
              </div>
            </div>

            <button onClick={() => setChatOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`chat-message ${item.sender}`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button type="submit">
              <Send size={18} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

export default Home;