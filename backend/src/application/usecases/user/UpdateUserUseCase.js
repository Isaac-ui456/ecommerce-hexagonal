'use strict';

const { NotFoundError, ValidationError } = require('../../../domain/errors/DomainErrors');
const { PasswordPolicy } = require('../../../domain/services/PasswordPolicy');

class UpdateUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(id, { username, email, password, role }) {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundError('Usuario', id);

    const patch = {};
    if (username) patch.username = username.trim();
    if (email) patch.email = email.trim().toLowerCase();
    if (role) patch.role = role;
    if (password) {
      try {
        PasswordPolicy.assertValid(password);
      } catch (err) {
        throw new ValidationError(err.message);
      }
      patch.passwordHash = await this.passwordHasher.hash(password);
    }

    const updated = await this.userRepository.update(id, patch);
    return updated.toSafeObject();
  }
}

module.exports = { UpdateUserUseCase };
