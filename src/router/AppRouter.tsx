import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LiveTrackingPage from "../pages/LiveTrackingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LiveTrackingPage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;