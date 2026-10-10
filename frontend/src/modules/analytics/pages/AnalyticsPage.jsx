import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../../../shared/hooks/useToast';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const { showToast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getDashboardMetrics(dateRange);
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      showToast('Error al cargar datos del dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAnalytics();
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando métricas del sistema...</div>;
  }

  const { topProducts = [], revenueTrend = [], statusDistribution = [], averageTicket = {} } = data || {};

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Métricas y Analítica</h1>
          <p className="text-gray-500 text-sm">Resumen de ventas, productos más vendidos y estado de pedidos</p>
        </div>

        {/* Filtros de Fecha */}
        <form onSubmit={handleFilterSubmit} className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="border px-2 py-1 rounded text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="border px-2 py-1 rounded text-sm"
          />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
            Filtrar
          </button>
        </form>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Ticket Promedio por Pedido</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            ${Number(averageTicket?.average_ticket_per_order || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Gasto Promedio por Usuario</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            ${Number(averageTicket?.average_ticket_per_user || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Tendencia de Ingresos */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tendencia de Ingresos ($)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="daily_total" fill="#3B82F6" name="Ingreso Diario" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Distribución de Estados de Pedido */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Distribución por Estado de Pedidos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.status}: ${entry.percentage}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla: Productos Más Vendidos */}
      <div className="bg-white p-5 rounded-lg border shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Top Productos Más Vendidos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 font-semibold text-gray-600">Producto</th>
                <th className="p-3 font-semibold text-gray-600">Unidades Vendidas</th>
                <th className="p-3 font-semibold text-gray-600">Ingresos Totales</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-400">Sin datos registrados</td>
                </tr>
              ) : (
                topProducts.map((prod) => (
                  <tr key={prod.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{prod.name}</td>
                    <td className="p-3 text-gray-600">{prod.total_units} u.</td>
                    <td className="p-3 font-bold text-gray-800">${Number(prod.total_revenue).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};