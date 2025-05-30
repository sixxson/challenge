import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../page/dashboard";
import Home from "../page/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
