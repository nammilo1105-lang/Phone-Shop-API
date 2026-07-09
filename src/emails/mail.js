const nodemailer = require("nodemailer");
const config = require("config")
const ejs = require("ejs")
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: config.get("mail.mailHost"),
  port: config.get("mail.mailPort"),
  secure: config.get("mail.mailSecure"), // true for 465, false for other ports
  auth: {
    user: config.get("mail.mailUser"),
    pass: config.get("mail.mailPass"),
  },
});

// Wrap in an async IIFE so we can use await.

module.exports = async (template, payload) => {
    const html = await ejs.renderFile(template, payload) // template đường dẫn đến file, payload dữ liệu truyền vào
    const info = await transporter.sendMail({
    from: config.get("mail.mailFrom"),
    to: payload.payload.email,
    subject: payload.subject,
    // subject: "Hello ✔",
    html, // HTML body
  });
}