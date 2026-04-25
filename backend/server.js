const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from backend/.env.
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || SMTP_USER;

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false }));

app.use(cors());

const frontendDir = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendDir));

const transporter = nodemailer.createTransport({
 service: "gmail",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!SMTP_USER || !SMTP_PASS || !CONTACT_RECEIVER) {
    return res.status(500).json({
      error: "Email service is not configured. Set SMTP_USER, SMTP_PASS and CONTACT_RECEIVER in .env."
    });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    const subject = `New portfolio message from ${name}`;

    await transporter.sendMail({
      from: SMTP_FROM,
      to: CONTACT_RECEIVER,
      replyTo: email,
      subject,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Portfolio Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `
    });

    return res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: `Failed to send message. ${error.message}` });
  }
});

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
