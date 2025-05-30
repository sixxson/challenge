const generateOtp = require("../utils/generateOtp");
const sendWhatsapp = require("../services/sendWhatsapp");

// Tạm lưu OTP
const otpStore = new Map();

const CreateNewAccessCode = async (req, res) => {
  let { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Thiếu số điện thoại" });
  }

  // Normalize lại server-side (phòng trường hợp client chưa làm)
  if (phoneNumber.startsWith("0")) {
    phoneNumber = "+84" + phoneNumber.slice(1);
  }

  const otp = generateOtp();
  otpStore.set(phoneNumber, otp);

  try {
    await sendWhatsapp(phoneNumber, otp);
    res.json({ message: "OTP đã gửi qua WhatsApp" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gửi OTP thất bại", error: err.message });
  }
};

const ValidateAccessCode = (req, res) => {
  const { phoneNumber, otp } = req.body;
  const savedOtp = otpStore.get(phoneNumber);

  if (!savedOtp) return res.status(400).json({ message: "Không tìm thấy OTP" });

  if (savedOtp === otp) {
    otpStore.delete(phoneNumber);
    return res.json({ message: "Xác minh thành công" });
  } else {
    return res.status(400).json({ message: "OTP không đúng" });
  }
};

module.exports = { CreateNewAccessCode, ValidateAccessCode };
