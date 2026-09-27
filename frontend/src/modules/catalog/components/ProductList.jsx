export default function ProductList({ products, isAdmin, onEdit, onDelete, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left font-medium text-slate-500 px-5 py-3">Nombre</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Precio</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Stock</th>
            <th className="text-right font-medium text-slate-500 px-5 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr
              key={p.id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors duration-150 animate-fadeIn"
              style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'backwards' }}
            >
              <td className="px-5 py-3 font-medium text-slate-800">{p.name}</td>
              <td className="px-5 py-3 text-slate-600">${p.price.toFixed(2)}</td>
              <td className="px-5 py-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors
                  ${p.stock === 0 ? 'bg-red-50 text-red-700' : p.stock < 10 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full
                    ${p.stock === 0 ? 'bg-red-500' : p.stock < 10 ? 'bg-amber-500' : 'bg-green-500'}`} />
                  {p.stock} unidades
                </span>
              </td>
              <td className="px-5 py-3 text-right space-x-2">
                {!isAdmin && (
                  <button
                    onClick={() => onAddToCart(p)}
                    disabled={p.stock === 0}
                    className="text-xs font-medium bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:active:scale-100 text-white px-3 py-1.5 rounded-lg transition-all duration-150 shadow-sm hover:shadow"
                  >
                    Agregar
                  </button>
                )}
                {isAdmin && (
                  <>
                    <button
                      onClick={() => onEdit(p)}
                      className="text-xs font-medium text-slate-600 hover:bg-slate-100 active:scale-95 border border-slate-300 px-3 py-1.5 rounded-lg transition-all duration-150"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="text-xs font-medium text-red-600 hover:bg-red-50 active:scale-95 border border-red-200 px-3 py-1.5 rounded-lg transition-all duration-150"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">No hay productos en el catálogo.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
