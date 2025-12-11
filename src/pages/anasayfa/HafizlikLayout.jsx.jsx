import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTopButton from '../../components/common/ScrollToTopButton';

// Bu bileşen, /hafizlik altındaki tüm sayfalar için
// ortak olan ScrollToTopButton'u ve alt sayfa içeriğini (Outlet) yönetir.
const HafizlikLayout = () => {
  return (
    <div className="relative">
      <Outlet />
      <ScrollToTopButton />
    </div>
  );
};

export default HafizlikLayout;