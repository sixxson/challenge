const express = require("express");
const router = express.Router();
const { CreateNewAccessCode, ValidateAccessCode } = require("../controllers/otpController");

router.post("/send-otp", CreateNewAccessCode);
router.post("/verify-otp", ValidateAccessCode);

module.exports = router;
