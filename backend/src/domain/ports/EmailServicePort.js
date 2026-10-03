class EmailServicePort {
  async sendOrderConfirmationEmail(orderData, userEmail) {
    throw new Error('Método sendOrderConfirmationEmail() no implementado.');
  }

  async sendAdminOrderNotification(orderData, adminEmail) {
    throw new Error('Método sendAdminOrderNotification() no implementado.');
  }
}

module.exports = EmailServicePort;
