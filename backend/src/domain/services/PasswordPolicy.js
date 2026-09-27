'use strict';

/**
 * Regla de negocio pura sobre la fortaleza de la contraseña en texto plano,
 * ANTES de que sea enviada al puerto de cifrado (PasswordHasher).
 * No importa bcrypt aquí: el dominio no debe conocer el algoritmo de hashing.
 */
class PasswordPolicy {
  static MIN_LENGTH = 8;

  static validate(plainPassword) {
    const errors = [];
    if (!plainPassword || typeof plainPassword !== 'string') {
      errors.push('La contraseña es obligatoria');
      return errors;
    }
    if (plainPassword.length < PasswordPolicy.MIN_LENGTH) {
      errors.push(`La contraseña debe tener al menos ${PasswordPolicy.MIN_LENGTH} caracteres`);
    }
    if (!/[A-Z]/.test(plainPassword)) errors.push('Debe incluir al menos una letra mayúscula');
    if (!/[a-z]/.test(plainPassword)) errors.push('Debe incluir al menos una letra minúscula');
    if (!/[0-9]/.test(plainPassword)) errors.push('Debe incluir al menos un número');

    return errors;
  }

  static assertValid(plainPassword) {
    const errors = PasswordPolicy.validate(plainPassword);
    if (errors.length > 0) {
      const err = new Error(errors.join('; '));
      err.name = 'WeakPasswordError';
      throw err;
    }
  }
}

module.exports = { PasswordPolicy };
