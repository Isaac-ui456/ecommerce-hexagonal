'use strict';

class DomainError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class NotFoundError extends DomainError {
  constructor(entity, id) {
    super(`${entity} no encontrado (id: ${id})`, 404);
  }
}

class ConflictError extends DomainError {
  constructor(message) {
    super(message, 409);
  }
}

class ValidationError extends DomainError {
  constructor(message) {
    super(message, 422);
  }
}

class AuthenticationError extends DomainError {
  constructor(message = 'Credenciales inválidas') {
    super(message, 401);
  }
}

class AuthorizationError extends DomainError {
  constructor(message = 'No autorizado') {
    super(message, 403);
  }
}

module.exports = { DomainError, NotFoundError, ConflictError, ValidationError, AuthenticationError, AuthorizationError };
