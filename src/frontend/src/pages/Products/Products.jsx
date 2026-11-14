import { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

import './Products.css';

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + 'đ';
}

function Products() {
  const [products, setProducts] = useState([]);
  const categories = useMemo(() => ['Tất cả', ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get('/products')
      .then(({ data }) => {
        if (!mounted) return;
        const rows = Array.isArray(data?.data) ? data.data : [];
        const mapped = rows
          .filter((p) => String(p.Status || '').toLowerCase() === 'active')
          .map((p) => ({
            id: p.ProductID,
            name: p.ProductName,
            category: p.CategoryName || 'Khác',
            price: Number(p.BasePrice || 0),
            image: p.ImageURL || 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect width="100%" height="100%" fill="#eeeae4"/><text x="50%" y="48%" text-anchor="middle" font-family="Arial" font-size="28" fill="#82715f">SHOPTT</text><text x="50%" y="54%" text-anchor="middle" font-family="Arial" font-size="18" fill="#82715f">Chưa có hình ảnh</text></svg>'),
            date: p.CreatedAt || new Date().toISOString()
          }));
        setProducts(mapped);
      })
      .catch((error) => {
        console.error('Không tải được sản phẩm:', error);
        if (mounted) setLoadError('Không thể tải sản phẩm từ máy chủ.');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [sort, setSort] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(() => {
  const wishlist = JSON.parse(
    localStorage.getItem('shoptt_wishlist') || '[]'
  );

  return wishlist.map((item) => item.id);
});

  const productsPerPage = 8;

  // Tính danh sách theo từ khóa, danh mục, khoảng giá và cách sắp xếp.
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Tìm kiếm
    if (search.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Lọc danh mục
    if (category !== 'Tất cả') {
      result = result.filter(
        (product) => product.category === category
      );
    }

    // Lọc giá
    if (priceRange === 'under300') {
      result = result.filter((product) => product.price < 300000);
    } else if (priceRange === '300to500') {
      result = result.filter(
        (product) => product.price >= 300000 && product.price <= 500000
      );
    } else if (priceRange === '500to700') {
      result = result.filter(
        (product) => product.price > 500000 && product.price <= 700000
      );
    } else if (priceRange === 'over700') {
      result = result.filter((product) => product.price > 700000);
    }

    // Sắp xếp
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      result.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }

    return result;
  }, [products, search, category, priceRange, sort]);

  // Phân trang
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  // Chỉ lấy nhóm sản phẩm thuộc trang hiện tại để phân trang.
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Thay đổi danh mục
  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  // Thêm / bỏ yêu thích
  const toggleFavorite = (id) => {
  const wishlist = JSON.parse(
    localStorage.getItem('shoptt_wishlist') || '[]'
  );

  const exists = wishlist.some(
    (item) => item.id === id
  );

  let updatedWishlist;

  if (exists) {
    updatedWishlist = wishlist.filter(
      (item) => item.id !== id
    );
  } else {
    const product = products.find(
      (item) => item.id === id
    );

    if (!product) return;

    updatedWishlist = [
      ...wishlist,
      {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image
      }
    ];
  }

  localStorage.setItem(
    'shoptt_wishlist',
    JSON.stringify(updatedWishlist)
  );

  setFavorites(
    updatedWishlist.map((item) => item.id)
  );
};

  // Xóa bộ lọc
  const resetFilters = () => {
    setSearch('');
    setCategory('Tất cả');
    setPriceRange('all');
    setSort('default');
    setCurrentPage(1);
  };

  return (
    <div className="products-page">

      {/* PAGE BANNER */}
      <section className="products-banner">
        <div className="container">
          <span>SHOPTT COLLECTION</span>
          <h1>Tất cả sản phẩm</h1>
          <p>
            Khám phá những thiết kế dành riêng cho phong cách của bạn.
          </p>
        </div>
      </section>

      <main className="container products-main">

        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <a href="/">Trang chủ</a>
          <span>/</span>
          <span>Sản phẩm</span>
        </div>

        {/* SEARCH */}
        <div className="products-toolbar">

          <div className="product-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            {search && (
              <button onClick={() => setSearch('')}>
                <X size={17} />
              </button>
            )}
          </div>

          <div className="product-sort">
            <SlidersHorizontal size={18} />

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="default">Mặc định</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>

            <ChevronDown size={15} />
          </div>

        </div>

        <div className="products-layout">

          {/* SIDEBAR */}
          <aside className="products-sidebar">

            <div className="sidebar-heading">
              <h3>Bộ lọc</h3>

              <button onClick={resetFilters}>
                Xóa tất cả
              </button>
            </div>

            {/* CATEGORY */}
            <div className="filter-group">
              <h4>Danh mục</h4>

              {categories.map((item) => (
                <button
                  key={item}
                  className={`category-option ${
                    category === item ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryChange(item)}
                >
                  <span>{item}</span>
                  {category === item && <span>✓</span>}
                </button>
              ))}
            </div>

            {/* PRICE */}
            <div className="filter-group">
              <h4>Khoảng giá</h4>

              {[
                { value: 'all', label: 'Tất cả mức giá' },
                { value: 'under300', label: 'Dưới 300.000đ' },
                { value: '300to500', label: '300.000đ - 500.000đ' },
                { value: '500to700', label: '500.000đ - 700.000đ' },
                { value: 'over700', label: 'Trên 700.000đ' }
              ].map((item) => (
                <label className="price-option" key={item.value}>
                  <input
                    type="radio"
                    name="price"
                    value={item.value}
                    checked={priceRange === item.value}
                    onChange={(e) => {
                      setPriceRange(e.target.value);
                      setCurrentPage(1);
                    }}
                  />

                  <span>{item.label}</span>
                </label>
              ))}
            </div>

          </aside>

          {/* PRODUCT CONTENT */}
          <section className="products-content">

            <div className="products-result">
              <p>
                Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
              </p>

              <span>
                {category !== 'Tất cả' ? category : 'Tất cả danh mục'}
              </span>
            </div>

            {loading ? (
              <div className="empty-products"><p>Đang tải sản phẩm...</p></div>
            ) : loadError && products.length === 0 ? (
              <div className="empty-products"><p>{loadError}</p></div>
            ) : displayedProducts.length > 0 ? (
              <div className="products-grid">

                {displayedProducts.map((product) => (
                  <article
                    className="shop-product-card"
                    key={product.id}
                     onClick={() => {
                     window.location.href = `/products/${product.id}`;
  }}
>

                    <div className="shop-product-image">
                      <img
                        src={product.image}
                        alt={product.name}
                      />

                      <span className="shop-product-badge">
                        NEW
                      </span>

                      <button
                        className={`shop-favorite ${
                          favorites.includes(product.id) ? 'liked' : ''
                        }`}
                        onClick={() => toggleFavorite(product.id)}
                        aria-label="Thêm vào yêu thích"
                      >
                        <Heart
                          size={19}
                          fill={
                            favorites.includes(product.id)
                              ? 'currentColor'
                              : 'none'
                          }
                        />
                      </button>

                      <button
                        className="quick-add"
                        onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/products/${product.id}`;
                                                                    }}
>
                        <ShoppingBag size={16} />
                         Xem sản phẩm
                        </button>
                    </div>

                    <div className="shop-product-info">
                      <span>{product.category}</span>

                      <h3>{product.name}</h3>

                      <p>{formatPrice(product.price)}</p>
                    </div>

                  </article>
                ))}

              </div>
            ) : (
              <div className="empty-products">
                <Search size={40} />

                <h3>Không tìm thấy sản phẩm</h3>

                <p>
                  Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.
                </p>

                <button onClick={resetFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="pagination">

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={currentPage === page ? 'active' : ''}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <ChevronRight size={18} />
                </button>

              </div>
            )}

          </section>

        </div>
      </main>

    </div>
  );
}

export default Products;
