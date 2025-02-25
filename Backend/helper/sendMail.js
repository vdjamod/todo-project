import nodemailer from 'nodemailer';

// Send Mail Function
const sendMail = async (to, subject, text) => {
  try {
    const transporter = await nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "vipuljamod122@gmail.com", // Your Gmail address
        pass: "olbwvhzjrncrnkqf", // Your 16-character App Password (No Spaces)
      },
    });

    const mailOptions = {
      from: "vipuljamod122@gmail.com",
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.log("Error sending email:", error);
    return false;
  }
};

export default sendMail;