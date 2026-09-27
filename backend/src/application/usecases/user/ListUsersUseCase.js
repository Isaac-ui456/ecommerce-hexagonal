'use strict';

class ListUsersUseCase {
  constructor(userRepository) { this.userRepository = userRepository; }

  async execute({ limit = 20, offset = 0 } = {}) {
    const users = await this.userRepository.findAll({ limit, offset });
    return users.map((u) => u.toSafeObject());
  }
}

module.exports = { ListUsersUseCase };
