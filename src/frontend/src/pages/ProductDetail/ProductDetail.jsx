// Vai trò tệp: Màn hình React cho khu vực ProductDetail; component chịu trách nhiệm tải dữ liệu, xử lý tương tác và dựng giao diện.
// Component được dùng trong cây giao diện; các import bên dưới cung cấp dữ liệu, điều hướng và kiểu hiển thị.

import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Minus, Plus, Truck, ShieldCheck, RotateCcw, ChevronRight, Check } from 'lucide-react';
import api from '../../services/api';
import './ProductDetail.css';

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100"><rect width="100%" height="100%" fill="#eeeae4"/><text x="50%" y="48%" text-anchor="middle" font-family="Arial" font-size="42" fill="#82715f">SHOPTT</text><text x="50%" y="54%" text-anchor="middle" font-family="Arial" font-size="25" fill="#82715f">Chưa có hình ảnh</text></svg>'
);
const formatPrice = (price) => Number(price || 0).toLocaleString('vi-VN') + 'đ';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProduct(null);
    setError('');
    api.get(`/products/${id}`)
      .then(({ data }) => {
        if (active && data?.success && data.data) setProduct(data.data);
        else if (active) setError('Không tìm thấy sản phẩm.');
      })
      .catch((err) => {
        console.error('Lỗi tải chi tiết sản phẩm:', err);
        if (active) setError(err.response?.data?.message || 'Không thể tải thông tin sản phẩm.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const images = useMemo(() => {
    const list = (product?.Images || []).map((x) => x.ImageURL).filter(Boolean);
    return list.length ? list : [FALLBACK_IMAGE];
  }, [product]);
  const variants = product?.Variants || [];
  const sizes = [...new Map(variants.filter(v => v.Size).map(v => [v.Size.SizeID, v.Size])).values()];
  const colors = [...new Map(variants.filter(v => v.Color).map(v => [v.Color.ColorID, v.Color])).values()];
  const selectedVariant = variants.find(v =>
    (!sizes.length || v.Size?.SizeID === selectedSize) &&
    (!colors.length || v.Color?.ColorID === selectedColor)
  );
  const price = selectedVariant?.Price ?? product?.BasePrice ?? 0;

  useEffect(() => {
    if (!product) return;
    const saved = JSON.parse(localStorage.getItem('shoptt_wishlist') || '[]');
    setFavorite(saved.some(item => Number(item.id) === Number(product.ProductID)));
  }, [product]);

  const notify = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(''), 2800);
  };

  const toggleFavorite = () => {
    const saved = JSON.parse(localStorage.getItem('shoptt_wishlist') || '[]');
    const exists = saved.some(item => Number(item.id) === Number(product.ProductID));
    const updated = exists
      ? saved.filter(item => Number(item.id) !== Number(product.ProductID))
      : [...saved, { id: product.ProductID, name: product.ProductName, category: product.Category?.CategoryName || '', price: Number(product.BasePrice), image: images[0] }];
    localStorage.setItem('shoptt_wishlist', JSON.stringify(updated));
    setFavorite(!exists);
    notify(exists ? 'Đã xóa khỏi danh sách yêu thích.' : 'Đã thêm vào danh sách yêu thích!');
  };

  const addToCart = () => {
    if (sizes.length && !selectedSize) return notify('Vui lòng chọn kích thước.');
    if (colors.length && !selectedColor) return notify('Vui lòng chọn màu sắc.');
    if (variants.length && !selectedVariant) return notify('Biến thể này hiện không khả dụng.');
    const cartItem = {
      productId: product.ProductID,
      variantId: selectedVariant?.VariantID ?? null,
      name: product.ProductName,
      price: Number(price),
      image: images[0],
      size: selectedVariant?.Size?.SizeName || 'Mặc định',
      color: selectedVariant?.Color?.ColorName || 'Mặc định',
      quantity
    };
    const cart = JSON.parse(localStorage.getItem('shoptt_cart') || '[]');
    const found = cart.find(item => item.productId === cartItem.productId && item.variantId === cartItem.variantId && item.size === cartItem.size && item.color === cartItem.color);
    if (found) found.quantity += quantity;
    else cart.push(cartItem);
    localStorage.setItem('shoptt_cart', JSON.stringify(cart));
    notify('Đã thêm sản phẩm vào giỏ hàng!');
  };

  if (loading) return <div className="product-not-found"><p>Đang tải thông tin sản phẩm...</p></div>;
  if (error || !product) return <div className="product-not-found"><h2>{error || 'Không tìm thấy sản phẩm'}</h2><Link to="/products">Quay lại danh sách sản phẩm</Link></div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/products" className="back-to-products"><ArrowLeft size={16} /><span>Quay lại danh sách sản phẩm</span></Link>
        <div className="detail-breadcrumb"><Link to="/">Trang chủ</Link><ChevronRight size={14}/><Link to="/products">Sản phẩm</Link><ChevronRight size={14}/><span>{product.ProductName}</span></div>
      </div>
      <section className="container detail-container">
        <div className="detail-gallery">
          <div className="detail-main-image"><img src={images[selectedImage] || FALLBACK_IMAGE} alt={product.ProductName} onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}/></div>
          {images.length > 1 && <div className="detail-thumbnails">{images.map((image, index) => <button key={index} className={selectedImage === index ? 'active' : ''} onClick={() => setSelectedImage(index)}><img src={image} alt={`${product.ProductName} ${index + 1}`} /></button>)}</div>}
        </div>
        <div className="detail-information">
          <span className="detail-category">{product.Category?.CategoryName || 'Sản phẩm'}</span>
          <h1>{product.ProductName}</h1>
          {product.Brand?.BrandName && <p>{product.Brand.BrandName}</p>}
          <div className="detail-price">{formatPrice(price)}</div>
          <div className="detail-divider" />
          <div className="detail-description"><h3>Mô tả sản phẩm</h3><p>{product.Description || product.ShortDescription || 'Thông tin mô tả đang được cập nhật.'}</p></div>
          {colors.length > 0 && <div className="detail-option"><div className="option-title"><h3>Màu sắc</h3><span>{colors.find(c => c.ColorID === selectedColor)?.ColorName || 'Chưa chọn'}</span></div><div className="color-list">{colors.map(color => <button key={color.ColorID} title={color.ColorName} aria-label={color.ColorName} className={selectedColor === color.ColorID ? 'active' : ''} style={{backgroundColor: color.ColorCode || '#ccc'}} onClick={() => setSelectedColor(color.ColorID)}>{selectedColor === color.ColorID && <Check size={16}/>}</button>)}</div></div>}
          {sizes.length > 0 && <div className="detail-option"><div className="option-title"><h3>Kích thước</h3></div><div className="size-list">{sizes.map(size => <button key={size.SizeID} className={selectedSize === size.SizeID ? 'active' : ''} onClick={() => setSelectedSize(size.SizeID)}>{size.SizeName}</button>)}</div></div>}
          {variants.length === 0 && <p className="detail-description">Sản phẩm chưa khai báo biến thể kích thước/màu sắc.</p>}
          <div className="detail-option"><h3>Số lượng</h3><div className="quantity-control"><button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={15}/></button><span>{quantity}</span><button onClick={() => setQuantity(q => q + 1)}><Plus size={15}/></button></div></div>
          <div className="detail-actions"><button className="add-cart-button" onClick={addToCart}><ShoppingBag size={19}/>Thêm vào giỏ hàng</button><button className={`detail-favorite ${favorite ? 'active' : ''}`} onClick={toggleFavorite} aria-label="Yêu thích"><Heart size={20} fill={favorite ? 'currentColor' : 'none'}/></button></div>
          {notification && <div className="detail-notification">{notification}</div>}
          <div className="detail-benefits"><div><Truck size={20}/><span>Giao hàng toàn quốc</span></div><div><ShieldCheck size={20}/><span>Cam kết chất lượng</span></div><div><RotateCcw size={20}/><span>Hỗ trợ đổi trả</span></div></div>
        </div>
      </section>
      <section className="detail-extra"><div className="container"><h2>Thông tin sản phẩm</h2><p>{product.Description || product.ShortDescription || 'Thông tin mô tả đang được cập nhật.'}</p></div></section>
    </div>
  );
}