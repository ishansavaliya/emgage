import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LiveTrackingPage from '../pages/LiveTrackingPage';
import HistoryPage from '../pages/HistoryPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LiveTrackingPage />,
  },
  {
    path: '/history',
    element: <HistoryPage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;