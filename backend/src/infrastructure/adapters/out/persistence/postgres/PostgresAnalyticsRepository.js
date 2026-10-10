const AnalyticsRepositoryPort = require('../../../../../application/ports/out/AnalyticsRepositoryPort');
const pool = require('../../../../config/db');

class PostgresAnalyticsRepository extends AnalyticsRepositoryPort {
  async getTopProducts(limit = 5) {
    const query = `
      SELECT p.id, p.name, COALESCE(SUM(oi.quantity), 0) as total_units, COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id, p.name
      ORDER BY total_units DESC
      LIMIT $1;
    `;
    const { rows } = await pool.query(query, [limit]);
    return rows;
  }

  async getTotalRevenue(startDate, endDate) {
    let query = `SELECT DATE(created_at) as date, SUM(total) as daily_total FROM orders WHERE status != 'cancelled'`;
    const params = [];
    if (startDate && endDate) {
      query += ` AND created_at BETWEEN $1 AND $2`;
      params.push(startDate, endDate);
    }
    query += ` GROUP BY DATE(created_at) ORDER BY date ASC;`;
    const { rows } = await pool.query(query, params);
    return rows;
  }

  async getOrderStatusDistribution() {
    const query = `
      SELECT status, COUNT(*) as count,
             ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM orders), 0), 2) as percentage
      FROM orders GROUP BY status;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async getAverageTicket() {
    const query = `
      SELECT 
        COALESCE(AVG(total), 0) as average_ticket_per_order,
        COALESCE(SUM(total) / NULLIF(COUNT(DISTINCT user_id), 0), 0) as average_ticket_per_user
      FROM orders WHERE status != 'cancelled';
    `;
    const { rows } = await pool.query(query);
    return rows[0];
  }
}

module.exports = PostgresAnalyticsRepository;