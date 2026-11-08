import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2
} from 'lucide-react';

import './ProductForm.css';

const STORAGE_KEY = 'shoptt_admin_products';

const categories = [
  'Áo nam',
  'Quần nam',
  'Áo nữ',
  'Quần nữ',
  'Váy nữ',
  'Áo khoác',
  'Phụ kiện'
];

const brands = [
  'ShopTT',
  'Local Brand',
  'Basic Wear',
  'Minimal Style'
];

const initialForm = {
  name: '',
  code: '',
  category: '',
  brand: '',
  description: '',
  price: '',
  originalPrice: '',
  image: '',
  status: 'Đang bán',
  variants: [
    {
      size: 'M',
      color: 'Đen',
      stock: 0
    }
  ]
};

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(() => {
    if (!id) return initialForm;

    const products = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );

    const product = products.find(
      (item) => String(item.id) === String(id)
    );

    return product
      ? {
          ...initialForm,
          ...product,
          variants: product.variants?.length
            ? product.variants
            : initialForm.variants
        }
      : initialForm;
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: 'M',
          color: 'Đen',
          stock: 0
        }
      ]
    }));
  };

  const updateVariant = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index
          ? { ...variant, [field]: value }
          : variant
      )
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên sản phẩm.';
    }

    if (!form.code.trim()) {
      newErrors.code = 'Vui lòng nhập mã sản phẩm.';
    }

    if (!form.category) {
      newErrors.category = 'Vui lòng chọn danh mục.';
    }

    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = 'Giá bán phải lớn hơn 0.';
    }

    if (
      form.originalPrice &&
      Number(form.originalPrice) < Number(form.price)
    ) {
      newErrors.originalPrice =
        'Giá gốc không được thấp hơn giá bán.';
    }

    if (!form.variants.length) {
      newErrors.variants = 'Sản phẩm cần ít nhất một biến thể.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const products = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );

    const totalStock = form.variants.reduce(
      (total, variant) => total + Number(variant.stock || 0),
      0
    );

    const productData = {
      ...form,
      id: id ? Number(id) : Date.now(),
      code: form.code.trim(),
      name: form.name.trim(),
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || 0),
      stock: totalStock,
      status:
        form.status === 'Ngừng bán'
          ? 'Ngừng bán'
          : totalStock === 0
          ? 'Hết hàng'
          : 'Đang bán'
    };

    let updatedProducts;

    if (id) {
      updatedProducts = products.map((product) =>
        String(product.id) === String(id)
          ? productData
          : product
      );
    } else {
      const duplicateCode = products.some(
        (product) =>
          product.code.toLowerCase() ===
          productData.code.toLowerCase()
      );

      if (duplicateCode) {
        setErrors({
          code: 'Mã sản phẩm đã tồn tại.'
        });
        return;
      }

      updatedProducts = [...products, productData];
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );

    alert(
      id
        ? 'Cập nhật sản phẩm thành công!'
        : 'Thêm sản phẩm thành công!'
    );

    navigate('/admin/products');
  };

  return (
    <div className="product-form-page">

      <div className="product-form-heading">
        <div>
          <button
            className="form-back-btn"
            onClick={() => navigate('/admin/products')}
          >
            <ArrowLeft size={17} />
            Quay lại danh sách
          </button>

          <h1>{id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>

          <p>
            {id
              ? 'Cập nhật thông tin sản phẩm trong hệ thống.'
              : 'Nhập thông tin để tạo sản phẩm mới.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="product-form-layout">

          {/* THÔNG TIN CƠ BẢN */}

          <div className="product-form-main">

            <section className="form-section">
              <div className="form-section-heading">
                <h3>Thông tin cơ bản</h3>
                <p>Thông tin nhận diện sản phẩm.</p>
              </div>

              <div className="form-grid">

                <div className="form-group full-width">
                  <label>Tên sản phẩm <span>*</span></label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập tên sản phẩm..."
                  />
                  {errors.name && <small>{errors.name}</small>}
                </div>

                <div className="form-group">
                  <label>Mã sản phẩm <span>*</span></label>
                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="VD: SP007"
                  />
                  {errors.code && <small>{errors.code}</small>}
                </div>

                <div className="form-group">
                  <label>Thương hiệu</label>
                  <select
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Danh mục <span>*</span></label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <small>{errors.category}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Đang bán">Đang bán</option>
                    <option value="Ngừng bán">Ngừng bán</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Mô tả sản phẩm</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả sản phẩm..."
                    rows="5"
                  />
                </div>

              </div>
            </section>

            {/* GIÁ BÁN */}

            <section className="form-section">
              <div className="form-section-heading">
                <h3>Thông tin giá bán</h3>
                <p>Thiết lập giá bán cho sản phẩm.</p>
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label>Giá bán (VNĐ) <span>*</span></label>
                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="VD: 250000"
                  />
                  {errors.price && <small>{errors.price}</small>}
                </div>

                <div className="form-group">
                  <label>Giá gốc (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    name="originalPrice"
                    value={form.originalPrice}
                    onChange={handleChange}
                    placeholder="VD: 350000"
                  />
                  {errors.originalPrice && (
                    <small>{errors.originalPrice}</small>
                  )}
                </div>

              </div>
            </section>

            {/* BIẾN THỂ */}

            <section className="form-section">
              <div className="form-section-heading form-variant-heading">
                <div>
                  <h3>Biến thể sản phẩm</h3>
                  <p>Quản lý kích thước, màu sắc và tồn kho.</p>
                </div>

                <button
                  type="button"
                  className="variant-add-btn"
                  onClick={addVariant}
                >
                  <Plus size={16} />
                  Thêm biến thể
                </button>
              </div>

              {errors.variants && <small>{errors.variants}</small>}

              <div className="variant-list">

                {form.variants.map((variant, index) => (
                  <div className="variant-row" key={index}>

                    <div className="form-group">
                      <label>Kích thước</label>
                      <select
                        value={variant.size}
                        onChange={(e) =>
                          updateVariant(index, 'size', e.target.value)
                        }
                      >
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(
                          (size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Màu sắc</label>
                      <select
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(index, 'color', e.target.value)
                        }
                      >
                        {[
                          'Đen',
                          'Trắng',
                          'Be',
                          'Nâu',
                          'Xám',
                          'Xanh',
                          'Đỏ'
                        ].map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Số lượng tồn</label>
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            'stock',
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="variant-remove-btn"
                      onClick={() => removeVariant(index)}
                      title="Xóa biến thể"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                ))}

              </div>
            </section>

          </div>

          {/* HÌNH ẢNH */}

          <aside className="product-form-sidebar">

            <section className="form-section">
              <div className="form-section-heading">
                <h3>Hình ảnh sản phẩm</h3>
                <p>Ảnh đại diện sản phẩm.</p>
              </div>

              <label className="product-image-upload">

                {form.image ? (
                  <div className="product-image-preview">
                    <img src={form.image} alt="Preview" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setForm((prev) => ({
                          ...prev,
                          image: ''
                        }));
                      }}
                    >
                      <X size={17} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={27} />
                    <strong>Tải ảnh lên</strong>
                    <span>PNG, JPG hoặc WEBP</span>
                    <span>Tối đa 5MB</span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />

              </label>
            </section>

            <section className="form-section">
              <div className="form-section-heading">
                <h3>Tóm tắt tồn kho</h3>
              </div>

              <div className="stock-summary">
                <span>Tổng số lượng</span>
                <strong>
                  {form.variants.reduce(
                    (total, variant) =>
                      total + Number(variant.stock || 0),
                    0
                  )}
                </strong>
              </div>
            </section>

          </aside>

        </div>

        {/* ACTIONS */}

        <div className="product-form-actions">

          <button
            type="button"
            className="form-cancel-btn"
            onClick={() => navigate('/admin/products')}
          >
            Hủy
          </button>

          <button type="submit" className="form-save-btn">
            <Save size={17} />
            {id ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </button>

        </div>

      </form>

    </div>
  );
}

export default ProductForm;