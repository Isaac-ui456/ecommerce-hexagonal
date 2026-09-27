import { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import OrderList from '../components/OrderList';
import { useAuth } from '../../auth/services/authContext';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.myOrders(user.id).then(setOrders).catch(() => setOrders([]));
  }, [user.id]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mis pedidos</h1>
        <p className="text-sm text-slate-500 mt-1">Historial de tus compras</p>
      </div>
      <OrderList orders={orders} />
    </div>
  );
}
