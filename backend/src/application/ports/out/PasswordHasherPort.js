'use strict';

/**
 * Puerto de salida para el cifrado de credenciales.
 * La capa de aplicación solo conoce "hash" y "compare"; el algoritmo
 * concreto (bcrypt, argon2, etc.) vive en el adaptador de infraestructura.
 */
class PasswordHasherPort {
  async hash(plainPassword) { throw new Error('Not implemented'); }
  async compare(plainPassword, passwordHash) { throw new Error('Not implemented'); }
}

module.exports = { PasswordHasherPort };
