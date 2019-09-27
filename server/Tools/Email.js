const nodemailer = require("nodemailer");

const sendEmail = async (type, email, emailHash) => {
  try {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = await nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      sendmail: true,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      }
    });
    const subject = {
      'signup': 'Hypertube - Please confirm your email',
      'reset': 'Hypertube - Password reset request',
    };
    const message = {
      'signup': `Please follow this link to confirm your account: http://localhost:3000/confirm/${emailHash}`,
      'reset': `Please follow this link to reset your password: http://localhost:3000/resetPassword/${emailHash}`,
    };
    await transporter.sendMail({
      from: '"Hypertube Team" <hello@hypertube.com>',
      to: email, 
      subject: subject[type],
      text: message[type],
    });
  } catch(err) { console.log(err); }
}

module.exports = sendEmail;
