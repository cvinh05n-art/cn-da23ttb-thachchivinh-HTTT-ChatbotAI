import { useState } from 'react';
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
  Sparkles,
  ChevronRight
} from 'lucide-react';

import './Home.css';

const products = [
  {
    id: 1,
    name: 'Áo sơ mi Linen',
    category: 'Áo nữ',
    price: '450.000đ',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600'
  },
  {
    id: 2,
    name: 'Áo thun Basic',
    category: 'Áo nam',
    price: '250.000đ',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
  },
  {
    id: 3,
    name: 'Quần dài Casual',
    category: 'Quần nam',
    price: '520.000đ',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'
  },
  {
    id: 4,
    name: 'Váy Minimal',
    category: 'Váy nữ',
    price: '590.000đ',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'
  }
];

const categories = [
  {
    name: 'Áo nam',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'
  },
  {
    name: 'Áo nữ',
    image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600'
  },
  {
    name: 'Quần',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'
  },
  {
    name: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
  }
];

function Home() {
  const [chatOpen, setChatOpen] = useState(false);
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
            <a href="/#categories">Danh mục</a>
            <a href="/#about">Giới thiệu</a>
            </nav>

          <div className="header-actions">
            <button aria-label="Tìm kiếm">
              <Search size={20} />
            </button>

            <button aria-label="Tài khoản">
              <UserRound size={20} />
            </button>

            <button aria-label="Giỏ hàng">
              <ShoppingBag size={20} />
            </button>
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

      {/* CATEGORIES */}
      <section className="section" id="categories">
        <div className="container">

          <div className="section-heading">
            <div>
              <h2>Danh mục nổi bật</h2>
              <p>Khám phá những lựa chọn dành cho bạn.</p>
            </div>

            <a href="#products" className="text-link">
              Xem tất cả <ArrowRight size={16} />
            </a>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => (
              <a href="#products" className="category-card" key={index}>
                <img src={category.image} alt={category.name} />

                <div className="category-overlay">
                  <h3>{category.name}</h3>
                  <ChevronRight size={18} />
                </div>
              </a>
            ))}
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

          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>

                <div className="product-image">
                  <img src={product.image} alt={product.name} />

                  <button className="favorite-button" aria-label="Yêu thích">
                    <Heart size={19} />
                  </button>

                  <span className="product-label">NEW</span>
                </div>

                <div className="product-info">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                </div>

              </div>
            ))}
          </div>

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
            <a href="#categories">Danh mục</a>
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