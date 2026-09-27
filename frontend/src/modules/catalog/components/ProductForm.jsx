import { useState, useEffect } from 'react';

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };

  const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">
        {initial ? 'Editar producto' : 'Nuevo producto'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
          <input name="description" value={form.description} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} required className={inputClass} />
        </div>
        <div className="sm:col-span-2 flex gap-2 pt-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Guardar
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="text-slate-600 hover:bg-slate-100 border border-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
