'use strict';

const jwt = require('jsonwebtoken');
const { TokenServicePort } = require('../../../../application/ports/out/TokenServicePort');

class JwtTokenService extends TokenServicePort {
  constructor(secret, expiresIn = '2h') {
    super();
    if (!secret) throw new Error('JWT secret no configurado (JWT_SECRET)');
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = { JwtTokenService };
