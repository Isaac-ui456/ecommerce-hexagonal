import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form);
      navigate('/catalog');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-scaleIn">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Iniciar sesión</h2>
        <p className="text-sm text-slate-500 mb-6">Ingresa tus credenciales para continuar</p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-fadeIn">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-medium rounded-lg py-2.5 transition-all duration-150 shadow-sm hover:shadow flex items-center justify-center gap-2"
          >
            {submitting && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500 text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
