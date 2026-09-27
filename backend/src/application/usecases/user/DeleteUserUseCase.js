'use strict';
const { NotFoundError } = require('../../../domain/errors/DomainErrors');

class DeleteUserUseCase {
  constructor(userRepository) { this.userRepository = userRepository; }

  async execute(id) {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundError('Usuario', id);
    await this.userRepository.delete(id);
    return { deleted: true, id };
  }
}

module.exports = { DeleteUserUseCase };
