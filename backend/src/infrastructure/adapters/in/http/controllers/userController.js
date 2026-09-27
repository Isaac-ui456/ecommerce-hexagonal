'use strict';

/**
 * Adaptador de entrada HTTP. Traduce peticiones Express en llamadas
 * a los casos de uso (puertos de entrada). No contiene reglas de negocio.
 */
class UserController {
  constructor({ registerUserUseCase, authenticateUserUseCase, getUserUseCase, listUsersUseCase, updateUserUseCase, deleteUserUseCase }) {
    this.registerUserUseCase = registerUserUseCase;
    this.authenticateUserUseCase = authenticateUserUseCase;
    this.getUserUseCase = getUserUseCase;
    this.listUsersUseCase = listUsersUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;
  }

  register = async (req, res, next) => {
    try {
      const user = await this.registerUserUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (err) { next(err); }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.authenticateUserUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.getUserUseCase.execute(req.params.id);
      res.status(200).json(user);
    } catch (err) { next(err); }
  };

  list = async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const users = await this.listUsersUseCase.execute({
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      res.status(200).json(users);
    } catch (err) { next(err); }
  };

  update = async (req, res, next) => {
    try {
      const user = await this.updateUserUseCase.execute(req.params.id, req.body);
      res.status(200).json(user);
    } catch (err) { next(err); }
  };

  remove = async (req, res, next) => {
    try {
      const result = await this.deleteUserUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (err) { next(err); }
  };
}

module.exports = { UserController };
