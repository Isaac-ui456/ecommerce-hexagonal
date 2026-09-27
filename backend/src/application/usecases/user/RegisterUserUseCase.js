'use strict';

const { User } = require('../../../domain/entities/User');
const { PasswordPolicy } = require('../../../domain/services/PasswordPolicy');
const { ConflictError, ValidationError } = require('../../../domain/errors/DomainErrors');

class RegisterUserUseCase {
  /**
   * @param {import('../../ports/out/UserRepositoryPort').UserRepositoryPort} userRepository
   * @param {import('../../ports/out/PasswordHasherPort').PasswordHasherPort} passwordHasher
   */
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ username, email, password, role }) {
    try {
      PasswordPolicy.assertValid(password);
    } catch (err) {
      throw new ValidationError(err.message);
    }

    const existingByEmail = await this.userRepository.findByEmail(email?.trim().toLowerCase());
    if (existingByEmail) throw new ConflictError('El email ya está registrado');

    const existingByUsername = await this.userRepository.findByUsername(username?.trim());
    if (existingByUsername) throw new ConflictError('El nombre de usuario ya está en uso');

    // La contraseña en texto plano NUNCA se persiste: se cifra aquí, en el borde
    // entre dominio y el puerto de salida, antes de construir la entidad.
    const passwordHash = await this.passwordHasher.hash(password);

    const user = new User({ username, email, passwordHash, role });
    const saved = await this.userRepository.save(user);
    return saved.toSafeObject();
  }
}

module.exports = { RegisterUserUseCase };
