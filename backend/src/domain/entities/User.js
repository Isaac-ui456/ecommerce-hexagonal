'use strict';

const ROLES = Object.freeze({ ADMIN: 'admin', CUSTOMER: 'customer' });

/**
 * Entidad de dominio pura. No conoce Express, PostgreSQL ni bcrypt.
 * La contraseña en texto plano NUNCA se almacena en esta entidad:
 * solo su hash (passwordHash), generado por el adaptador de seguridad
 * antes de construir el objeto.
 */
class User {
  constructor({ id = null, username, email, passwordHash, role = ROLES.CUSTOMER, createdAt = new Date() }) {
    if (!username || username.trim().length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Email inválido');
    }
    if (!passwordHash) {
      throw new Error('El usuario requiere una contraseña ya cifrada (passwordHash)');
    }
    if (!Object.values(ROLES).includes(role)) {
      throw new Error(`Rol inválido: ${role}`);
    }

    this.id = id;
    this.username = username.trim();
    this.email = email.trim().toLowerCase();
    this.passwordHash = passwordHash;
    this.role = role;
    this.createdAt = createdAt;
  }

  isAdmin() {
    return this.role === ROLES.ADMIN;
  }

  /** Representación segura: JAMÁS incluye passwordHash. Se usa en toda respuesta HTTP. */
  toSafeObject() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}

module.exports = { User, ROLES };
