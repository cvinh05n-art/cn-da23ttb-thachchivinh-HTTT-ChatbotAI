import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import './Wishlist.css';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(
      localStorage.getItem('shoptt_wishlist') || '[]'
    );

    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== productId
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      'shoptt_wishlist',
      JSON.stringify(updatedWishlist)
    );
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('vi-VN') + 'đ';
    }

    return price;
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-banner">
        <div className="container">
          <span>SHOPTT / TÀI KHOẢN</span>
          <h1>Danh sách yêu thích</h1>
          <p>Lưu giữ những sản phẩm bạn yêu thích.</p>
        </div>
      </div>

      <main className="container wishlist-container">
        <div className="wishlist-heading">
          <div>
            <h2>Sản phẩm yêu thích</h2>
            <p>{wishlist.length} sản phẩm</p>
          </div>

          <Link to="/products" className="wishlist-continue">
            Tiếp tục mua sắm <ArrowRight size={17} />
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <Heart size={36} />
            </div>

            <h3>Danh sách yêu thích đang trống</h3>

            <p>
              Hãy khám phá ShopTT và lưu lại những sản phẩm
              bạn yêu thích nhé!
            </p>

            <Link to="/products" className="wishlist-shop-button">
              <ShoppingBag size={18} />
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div className="wishlist-card" key={product.id}>
                <Link
                  to={`/products/${product.id}`}
                  className="wishlist-image"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </Link>

                <div className="wishlist-card-info">
                  <div>
                    <span>{product.category || 'ShopTT Collection'}</span>

                    <Link to={`/products/${product.id}`}>
                      <h3>{product.name}</h3>
                    </Link>

                    <p>{formatPrice(product.price)}</p>
                  </div>

                  <button
                    className="wishlist-remove"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Xóa khỏi yêu thích"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Wishlist;