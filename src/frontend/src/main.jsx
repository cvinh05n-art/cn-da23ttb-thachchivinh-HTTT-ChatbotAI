// Vai trò tệp: Điểm vào React: gắn ứng dụng vào phần tử DOM và nạp stylesheet nền.
// Component được dùng trong cây giao diện; các import bên dưới cung cấp dữ liệu, điều hướng và kiểu hiển thị.

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);