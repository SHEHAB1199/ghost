import nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({
  to,
  subject,
  text,
  html,
}: MailOptions): Promise<void> {
  try {
    const res = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully!');
    console.log({ res });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendMail;
