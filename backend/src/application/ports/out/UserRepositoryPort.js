'use strict';

/**
 * Puerto de salida (interfaz). La capa de aplicación depende de esta
 * abstracción, no de PostgreSQL. Los métodos deben ser implementados
 * por un adaptador en infrastructure/adapters/out/persistence/*.
 */
class UserRepositoryPort {
  async save(user) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async findByUsername(username) { throw new Error('Not implemented'); }
  async findAll({ limit, offset } = {}) { throw new Error('Not implemented'); }
  async update(id, partialUser) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}

module.exports = { UserRepositoryPort };
