'use strict';

const { AuthenticationError, AuthorizationError } = require('../../../../../domain/errors/DomainErrors');

/** Middleware de entrada: valida el JWT del header Authorization. */
function authenticate(tokenService) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(new AuthenticationError('Token no proporcionado'));
    }
    try {
      req.auth = tokenService.verify(token); // { sub, role }
      next();
    } catch (err) {
      next(new AuthenticationError('Token inválido o expirado'));
    }
  };
}

/** Middleware de autorización por rol (p.ej. solo admin gestiona catálogo). */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(new AuthorizationError('No tiene permisos suficientes'));
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
