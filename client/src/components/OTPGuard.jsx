import { Navigate } from "react-router-dom";

const OTPGuard = ({ children }) => {
  const isOtpVerified = localStorage.getItem("otpVerified") === "true";

  if (!isOtpVerified) {
    return <Navigate to="/verify-otp" replace />;
  }

  return children;
};

export default OTPGuard;
