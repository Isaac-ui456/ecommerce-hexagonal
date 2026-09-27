'use strict';
const { NotFoundError } = require('../../../domain/errors/DomainErrors');

class GetUserUseCase {
  constructor(userRepository) { this.userRepository = userRepository; }

  async execute(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('Usuario', id);
    return user.toSafeObject();
  }
}

module.exports = { GetUserUseCase };
