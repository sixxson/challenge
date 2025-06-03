"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useNavigate } from "react-router-dom";

const normalizePhone = (input) => {
  let val = input.trim();
  if (val.startsWith("+84")) val = val.replace("+84", "84");
  if (val.startsWith("0")) val = "84" + val.slice(1);
  return val;
};

export default function VerifyOtp() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(phone);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: normalizedPhone }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setShowOtpInput(true);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(phone);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: normalizedPhone, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        localStorage.setItem("otpVerified", "true");
        localStorage.setItem("phone", normalizedPhone);
        navigate("/"); 
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}
      className="space-y-4 w-full max-w-sm mx-auto mt-20"
    >
      {!showOtpInput ? (
        <>
          <label className="block font-medium">Số điện thoại:</label>
          <Input
            type="tel"
            placeholder="VD: 0901234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi mã OTP"}
          </Button>
        </>
      ) : (
        <>
          <label className="block font-medium">Nhập mã OTP:</label>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="w-full justify-center"
            containerClassName="gap-2"
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang xác thực..." : "Xác nhận OTP"}
          </Button>
        </>
      )}
    </form>
  );
}
