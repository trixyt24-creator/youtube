import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendMail = async (to, otp, value) => {
  if (value === "reset") {
    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: to,
      subject: "Reset Your Password 🔑",
      html: `<p>Use this OTP to reset your password: <b>${otp}</b>.<br>This OTP will expire in 5 minutes.</p>`, // HTML body
    });
  }
  else if (value === "verify") {
    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: to,
      subject: "Verify Your Email 📬",
      html: `<p>Use this OTP to verify your email: <b>${otp}</b>.<br>This OTP will expire in 5 minutes.</p>`, // HTML body
    });
  }
};

export default sendMail;
