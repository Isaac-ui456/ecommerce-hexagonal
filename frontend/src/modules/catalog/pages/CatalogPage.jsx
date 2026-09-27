import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../../auth/services/authContext';
import { orderService } from '../../orders/services/orderService';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';

export default function CatalogPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const isAdmin = user?.role === 'admin';

  const loadProducts = async () => {
    setProducts(await productService.list());
  };

  useEffect(() => {
    setLoading(true);
    loadProducts().finally(() => setLoading(false));
  }, []);

  const handleSave = async (data) => {
    try {
      if (editing) await productService.update(editing.id, data);
      else await productService.create(data);
      setShowForm(false);
      setEditing(null);
      await loadProducts();
      showToast(editing ? 'Producto actualizado' : 'Producto creado', 'success');
    } catch (err) {
      showToast(err.message || 'No se pudo guardar el producto', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.remove(id);
      await loadProducts();
      showToast('Producto eliminado', 'success');
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar el producto', 'error');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await orderService.create({ lines: [{ productId: product.id, quantity: 1 }] });
      showToast(`Pedido creado para "${product.name}"`, 'success');
      await loadProducts();
    } catch (err) {
      showToast(err.message || 'No se pudo crear el pedido', 'error');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fadeIn">
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Catálogo de productos</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin ? 'Gestión de inventario y precios' : 'Explora los productos disponibles'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-150 shadow-sm hover:shadow"
          >
            + Nuevo producto
          </button>
        )}
      </div>

      {showForm && (
        <div className="animate-scaleIn">
          <ProductForm initial={editing} onSubmit={handleSave} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 px-5 py-16 flex justify-center">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <ProductList
          products={products}
          isAdmin={isAdmin}
          onEdit={(p) => { setEditing(p); setShowForm(true); }}
          onDelete={handleDelete}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
