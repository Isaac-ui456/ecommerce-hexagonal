const statusStyles = {
  pending: { label: 'Pendiente', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  paid: { label: 'Pagado', dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
  cancelled: { label: 'Cancelado', dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  shipped: { label: 'Enviado', dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
};

export default function OrderList({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 px-5 py-10 text-center text-slate-400 text-sm animate-fadeIn">
        No hay pedidos aún.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => {
        const status = statusStyles[order.status] || statusStyles.pending;
        const total = order.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

        return (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 transition-shadow duration-150 hover:shadow-md animate-fadeIn"
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-slate-400">Pedido</p>
                <p className="text-sm font-mono text-slate-600">{order.id}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>

            <ul className="divide-y divide-slate-100 border-t border-slate-100">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between py-2 text-sm">
                  <span className="text-slate-700">{item.productName} <span className="text-slate-400">x{item.quantity}</span></span>
                  <span className="text-slate-600">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between pt-3 mt-1 border-t border-slate-100">
              <span className="text-sm font-medium text-slate-500">Total</span>
              <span className="text-sm font-semibold text-slate-800">${total.toFixed(2)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
