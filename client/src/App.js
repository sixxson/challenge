import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("phone");
      localStorage.removeItem("otpVerified")
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <Outlet />;
}
