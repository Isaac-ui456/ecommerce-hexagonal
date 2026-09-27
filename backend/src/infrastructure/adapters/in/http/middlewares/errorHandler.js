'use strict';

const { DomainError } = require('../../../../../domain/errors/DomainErrors');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof DomainError) {
    return res.status(err.statusCode).json({ error: err.name, message: err.message });
  }
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ error: 'InternalServerError', message: 'Error interno del servidor' });
}

module.exports = { errorHandler };
