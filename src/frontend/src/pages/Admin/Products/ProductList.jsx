import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Package
} from 'lucide-react';

import './ProductList.css';

function ProductList() {
  const navigate = useNavigate();
  const initialProducts = [
    {
      id: 1,
      code: 'SP001',
      name: 'Áo thun Basic Cotton',
      category: 'Áo nam',
      price: 250000,
      stock: 45,
      status: 'Đang bán',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'
    },
    {
      id: 2,
      code: 'SP002',
      name: 'Quần Jeans Classic',
      category: 'Quần nam',
      price: 450000,
      stock: 28,
      status: 'Đang bán',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200'
    },
    {
      id: 3,
      code: 'SP003',
      name: 'Áo sơ mi Minimal',
      category: 'Áo nữ',
      price: 350000,
      stock: 12,
      status: 'Đang bán',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=200'
    },
    {
      id: 4,
      code: 'SP004',
      name: 'Váy Linen',
      category: 'Váy nữ',
      price: 520000,
      stock: 0,
      status: 'Hết hàng',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200'
    },
    {
      id: 5,
      code: 'SP005',
      name: 'Áo khoác Cardigan',
      category: 'Áo khoác',
      price: 620000,
      stock: 18,
      status: 'Đang bán',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200'
    },
    {
      id: 6,
      code: 'SP006',
      name: 'Quần Short Casual',
      category: 'Quần nam',
      price: 290000,
      stock: 0,
      status: 'Ngừng bán',
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200'
    }
  ];

  const [products, setProducts] = useState(() => {
  const saved = localStorage.getItem('shoptt_admin_products');

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(
    'shoptt_admin_products',
    JSON.stringify(initialProducts)
  );

  return initialProducts;
});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      categoryFilter === 'all' || product.category === categoryFilter;

    const matchStatus =
      statusFilter === 'all' || product.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa sản phẩm này?'
    );

   if (confirmDelete) {
  const updatedProducts = products.filter(
    (product) => product.id !== id
  );

  setProducts(updatedProducts);

  localStorage.setItem(
    'shoptt_admin_products',
    JSON.stringify(updatedProducts)
  );
}
  };

  return (
    <div className="admin-products">

      <div className="product-page-heading">
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>Quản lý danh sách và thông tin sản phẩm của cửa hàng.</p>
        </div>

        <Link to="/admin/products/add" className="product-add-btn">
          <Plus size={18} />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="product-summary">
        <div className="product-summary-card">
          <div className="product-summary-icon">
            <Package size={21} />
          </div>
          <div>
            <span>Tổng sản phẩm</span>
            <h3>{products.length}</h3>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="product-summary-icon available">
            <Package size={21} />
          </div>
          <div>
            <span>Đang kinh doanh</span>
            <h3>{products.filter(p => p.status === 'Đang bán').length}</h3>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="product-summary-icon out-stock">
            <Package size={21} />
          </div>
          <div>
            <span>Hết hàng</span>
            <h3>{products.filter(p => p.status === 'Hết hàng').length}</h3>
          </div>
        </div>
      </div>

      <div className="product-list-container">

        <div className="product-list-toolbar">

          <div className="product-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="product-filters">
            <div className="product-filter-item">
              <Filter size={16} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Tất cả danh mục</option>
                <option value="Áo nam">Áo nam</option>
                <option value="Quần nam">Quần nam</option>
                <option value="Áo nữ">Áo nữ</option>
                <option value="Váy nữ">Váy nữ</option>
                <option value="Áo khoác">Áo khoác</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang bán">Đang bán</option>
              <option value="Hết hàng">Hết hàng</option>
              <option value="Ngừng bán">Ngừng bán</option>
            </select>
          </div>

        </div>

        <div className="product-table-heading">
          <h3>Danh sách sản phẩm</h3>
          <span>{filteredProducts.length} sản phẩm</span>
        </div>

        <div className="product-table-wrapper">
          <table className="product-admin-table">
            <thead>
              <tr>
                <th>SẢN PHẨM</th>
                <th>MÃ SẢN PHẨM</th>
                <th>DANH MỤC</th>
                <th>GIÁ BÁN</th>
                <th>TỒN KHO</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-table-info">
                        <img src={product.image} alt={product.name} />
                        <strong>{product.name}</strong>
                      </div>
                    </td>

                    <td>{product.code}</td>
                    <td>{product.category}</td>
                    <td className="product-price">
                      {formatPrice(product.price)}
                    </td>
                    <td>{product.stock}</td>

                    <td>
                      <span
                        className={`product-status ${
                          product.status === 'Đang bán'
                            ? 'selling'
                            : product.status === 'Hết hàng'
                            ? 'out'
                            : 'stopped'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td>
                      <div className="product-actions">
                        <button title="Xem chi tiết">
                          <Eye size={17} />
                        </button>

                        <button title="Chỉnh sửa"
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                    >
  <Edit size={17} />
</button>

                        <button
                          title="Xóa sản phẩm"
                          className="delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="product-empty">
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

export default ProductList;