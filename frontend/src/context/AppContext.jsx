import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createOrder, listOrders, setMockIdentityRole } from '../api/client.js';
import { isRole, ROLES } from '../lib/roles.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Temporary mock identity only - no backend authentication call yet.
  const [identity, setIdentity] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const login = (email, role = ROLES.USER) => {
    if (!isRole(role)) throw new Error(`Invalid mock role: ${role}`);
    const nextIdentity = { email, name: email.split('@')[0], role };
    setMockIdentityRole(role);
    setIdentity(nextIdentity);
  };
  const logout = () => {
    setMockIdentityRole(null);
    setIdentity(null);
  };

  const refreshOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      setOrders(await listOrders());
      setOrdersError(null);
    } catch (error) {
      setOrdersError(error);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const addOrder = async ({ items }) => {
    const created = await createOrder({ items });
    setOrders((previous) => [created, ...previous]);
    return created.OrderId;
  };

  const value = useMemo(
    () => ({
      identity,
      login,
      logout,
      orders,
      ordersError,
      loadingOrders,
      refreshOrders,
      addOrder,
    }),
    [identity, orders, ordersError, loadingOrders, refreshOrders]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
