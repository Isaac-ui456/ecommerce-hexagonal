const nodemailer = require('nodemailer');
const EmailServicePort = require('../../domain/ports/EmailServicePort');

class NodemailerAdapter extends EmailServicePort {
  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 2525,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendOrderConfirmationEmail(orderData, userEmail) {
    const htmlTemplate = `
      <h2>Confirmación de Pedido #${orderData.id || 1}</h2>
      <p>¡Gracias por tu compra! Tu pedido se encuentra <strong>Pendiente de Pago</strong>.</p>
      <h3>Instrucciones de Pago:</h3>
      <p>Realiza tu transferencia a la cuenta CLABE: <strong>012180001234567890</strong> con la referencia <strong>ORD-${orderData.id || 1}</strong>.</p>
    `;

    return await this.transporter.sendMail({
      from: '"E-Commerce Hexagonal" <no-reply@ecommerce.com>',
      to: userEmail,
      subject: `Confirmación de Pedido #${orderData.id || 1} - Pendiente de Pago`,
      html: htmlTemplate,
    });
  }

  async sendAdminOrderNotification(orderData, adminEmail) {
    return await this.transporter.sendMail({
      from: '"Sistema E-Commerce" <system@ecommerce.com>',
      to: adminEmail || 'admin@ecommerce.com',
      subject: `[NUEVO PEDIDO] Orden #${orderData.id || 1} registrada`,
      html: `<p>Se ha registrado un nuevo pedido en la plataforma.</p>`,
    });
  }
}

module.exports = NodemailerAdapter;
