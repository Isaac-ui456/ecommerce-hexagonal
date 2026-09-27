'use strict';

class TokenServicePort {
  sign(payload) { throw new Error('Not implemented'); }
  verify(token) { throw new Error('Not implemented'); }
}

module.exports = { TokenServicePort };
