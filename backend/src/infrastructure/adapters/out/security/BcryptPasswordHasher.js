'use strict';

const bcrypt = require('bcrypt');
const { PasswordHasherPort } = require('../../../../application/ports/out/PasswordHasherPort');

const SALT_ROUNDS = 12;

/**
 * Adaptador de salida: implementación concreta del cifrado de contraseñas
 * con bcrypt. Es el ÚNICO lugar del sistema que conoce el algoritmo de hashing.
 */
class BcryptPasswordHasher extends PasswordHasherPort {
  async hash(plainPassword) {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  }

  async compare(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}

module.exports = { BcryptPasswordHasher };
