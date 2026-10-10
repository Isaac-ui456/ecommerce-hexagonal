import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/services/authContext';

const linkBase = 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150';
const linkActive = 'bg-blue-600 text-white shadow-sm';
const linkInactive = 'text-slate-600 hover:bg-slate-100 hover:translate-x-0.5';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = [
    { to: '/catalog', label: 'Catálogo' },
    ...(user ? [{ to: '/orders', label: 'Mis pedidos' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/analytics', label: '📊 Analíticas' }] : []),
  ];

  return (
    <aside className="w-64 h-screen flex flex-col bg-white border-r border-slate-200 shrink-0">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-200">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          EC
        </div>
        <span className="font-semibold text-slate-800">E-commerce</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`${linkBase} ${location.pathname === item.to ? linkActive : linkInactive}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-200">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 text-sm">
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{user.username}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-sm text-left px-2 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors duration-150"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className={`${linkBase} ${linkInactive}`}>Iniciar sesión</Link>
        )}
      </div>
    </aside>
  );
}