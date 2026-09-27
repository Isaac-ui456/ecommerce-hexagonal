'use strict';

const { AuthenticationError } = require('../../../domain/errors/DomainErrors');

class AuthenticateUserUseCase {
  /**
   * @param {import('../../ports/out/UserRepositoryPort').UserRepositoryPort} userRepository
   * @param {import('../../ports/out/PasswordHasherPort').PasswordHasherPort} passwordHasher
   * @param {import('../../ports/out/TokenServicePort').TokenServicePort} tokenService
   */
  constructor(userRepository, passwordHasher, tokenService) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email?.trim().toLowerCase());
    // Mensaje genérico deliberado: no revela si falló el email o la contraseña.
    if (!user) throw new AuthenticationError();

    const isValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isValid) throw new AuthenticationError();

    const token = this.tokenService.sign({ sub: user.id, role: user.role });
    return { token, user: user.toSafeObject() };
  }
}

module.exports = { AuthenticateUserUseCase };
