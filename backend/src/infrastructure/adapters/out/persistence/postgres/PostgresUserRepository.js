'use strict';

const { UserRepositoryPort } = require('../../../../../application/ports/out/UserRepositoryPort');
const { User } = require('../../../../../domain/entities/User');

function rowToUser(row) {
  if (!row) return null;
  return new User({
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
  });
}

class PostgresUserRepository extends UserRepositoryPort {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async save(user) {
    const { rows } = await this.pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user.username, user.email, user.passwordHash, user.role]
    );
    return rowToUser(rows[0]);
  }

  async findById(id) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rowToUser(rows[0]);
  }

  async findByEmail(email) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rowToUser(rows[0]);
  }

  async findByUsername(username) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rowToUser(rows[0]);
  }

  async findAll({ limit = 20, offset = 0 } = {}) {
    const { rows } = await this.pool.query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return rows.map(rowToUser);
  }

  async update(id, patch) {
    const fields = [];
    const values = [];
    let i = 1;

    if (patch.username) { fields.push(`username = $${i++}`); values.push(patch.username); }
    if (patch.email) { fields.push(`email = $${i++}`); values.push(patch.email); }
    if (patch.role) { fields.push(`role = $${i++}`); values.push(patch.role); }
    if (patch.passwordHash) { fields.push(`password_hash = $${i++}`); values.push(patch.passwordHash); }

    values.push(id);
    const { rows } = await this.pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return rowToUser(rows[0]);
  }

  async delete(id) {
    await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return true;
  }
}

module.exports = { PostgresUserRepository };
