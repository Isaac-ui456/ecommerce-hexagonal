'use strict';

class Product {
  constructor({ id = null, name, description = '', price, stock, createdAt = new Date(), updatedAt = new Date() }) {
    if (!name || name.trim().length < 2) {
      throw new Error('El nombre del producto debe tener al menos 2 caracteres');
    }
    if (typeof price !== 'number' || price < 0) {
      throw new Error('El precio debe ser un número mayor o igual a 0');
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('El stock debe ser un entero mayor o igual a 0');
    }

    this.id = id;
    this.name = name.trim();
    this.description = description.trim();
    this.price = price;
    this.stock = stock;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  hasStockFor(quantity) {
    return this.stock >= quantity;
  }

  decreaseStock(quantity) {
    if (!this.hasStockFor(quantity)) {
      throw new Error(`Stock insuficiente para "${this.name}". Disponible: ${this.stock}, solicitado: ${quantity}`);
    }
    this.stock -= quantity;
    this.updatedAt = new Date();
  }

  increaseStock(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('La cantidad a reponer debe ser un entero positivo');
    }
    this.stock += quantity;
    this.updatedAt = new Date();
  }
}

module.exports = { Product };
