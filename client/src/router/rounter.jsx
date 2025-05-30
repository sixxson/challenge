import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../page/dashboard";
import Home from "../page/home";
import VerifyOtp from "../components/verify-otp";
import OTPGuard from "../components/OTPGuard"; // thêm guard

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <OTPGuard>
            <Home />
          </OTPGuard>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <OTPGuard>
            <Dashboard />
          </OTPGuard>
        ),
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
    ],
  },
]);

export default router;
