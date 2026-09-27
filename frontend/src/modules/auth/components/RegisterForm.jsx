import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function RegisterForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authService.register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'No fue posible registrar el usuario');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-scaleIn">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Crear cuenta</h2>
        <p className="text-sm text-slate-500 mb-6">Regístrate para empezar a comprar</p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-fadeIn">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 animate-fadeIn">
            Cuenta creada. Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <input
              name="username" value={form.username} onChange={handleChange} required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              name="password" type="password" value={form.password} onChange={handleChange} required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-slate-400">Mínimo 8 caracteres, una mayúscula, una minúscula y un número.</p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-medium rounded-lg py-2.5 transition-all duration-150 shadow-sm hover:shadow flex items-center justify-center gap-2"
          >
            {submitting && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {submitting ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
