'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'ecommerce_app',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ecommerce',
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Error inesperado en el pool de PostgreSQL', err);
});

module.exports = { pool };
