// Vai trò tệp: Thành phần gốc của giao diện, thiết lập cấu trúc ứng dụng và điều hướng giữa các trang.
// Component được dùng trong cây giao diện; các import bên dưới cung cấp dữ liệu, điều hướng và kiểu hiển thị.

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import Profile from './pages/Profile/Profile';
import Wishlist from './pages/Wishlist/Wishlist';

import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';

import MyOrders from './pages/Orders/MyOrders';
import OrderDetail from './pages/Orders/OrderDetail';

import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ProductList from './pages/Admin/Products/ProductList';
import ProductForm from './pages/Admin/Products/ProductForm';

function App() {
  return (
    <BrowserRouter>
      {/* Khai báo các URL của cửa hàng và khu vực quản trị. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:orderCode" element={<OrderDetail />} />

        {/* Các trang con quản trị được hiển thị bên trong AdminLayout. */}
        <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        </Route>

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
