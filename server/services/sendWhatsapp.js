const twilio = require('twilio');
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsappNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendWhatsapp = async (to, otp) => {
  return await client.messages.create({
    body: `Mã OTP của bạn là: ${otp}`,
    from: fromWhatsappNumber,
    to: `whatsapp:${to}`, // Số điện thoại đã chuẩn hóa: 84xxxxxxxxx
  });
};

module.exports = sendWhatsapp;
