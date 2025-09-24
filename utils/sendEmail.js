// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ host, port, user, pass, from }) => {
  // returns a send function configured
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass
    }
  });

  return async function({ to, subject, text, html }) {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });
    return info;
  };
};

module.exports = sendEmail;
