import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OrdersListPage from './pages/OrdersListPage.jsx';
import OrderCreatePage from './pages/OrderCreatePage.jsx';
import OrderEditPage from './pages/OrderEditPage.jsx';
import OrderSummaryPage from './pages/OrderSummaryPage.jsx';
import BoxInventoryPage from './pages/BoxInventoryPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/orders" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppLayout />}>
        <Route path="/orders" element={<OrdersListPage />} />
        <Route path="/orders/new" element={<OrderCreatePage />} />
        <Route path="/orders/:id/edit" element={<OrderEditPage />} />
        <Route path="/orders/:id" element={<OrderSummaryPage />} />
        <Route path="/boxes" element={<BoxInventoryPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/orders" replace />} />
    </Routes>
  );
}
