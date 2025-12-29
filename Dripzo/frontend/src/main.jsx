import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from './layout/RootLayout';
import Home from './pages/Home/Home';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import AuthProvider from './contexts/AuthProvider';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SendParcel from './pages/SendParcel/SendParcel';
import ServiceLocations from './pages/ServiceLocations';
import Dashboard from './pages/Dashboard/Dashboard';
import MyParcelList from './pages/Dashboard/MyParcelList';
import PrivateRoute from './route/PrivateRoute';
import Payment from './pages/Dashboard/Payment';
import PaymentSuccess from './pages/Dashboard/PaymentSuccess';
import PaymentFail from './pages/Dashboard/PaymentFail';
import PaymentHistory from './pages/Dashboard/PaymentHistory';
import ServeAsRider from './pages/ServeAsRider';
import PendingRiders from './pages/Dashboard/PendingRiders';
import ActiveRiders from './pages/Dashboard/ActiveRiders';







const router = createBrowserRouter([

  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      {
        path: "/servicelocations",
        Component: ServiceLocations,
        loader: async () => {
          const res = await fetch("/data/warehouses.json");
          return res.json();
        }
      },
      {
        path: "/sendparcel",
        element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>,
        loader: async () => {
          const res = await fetch("/data/warehouses.json");
          return res.json();
        }
      },
      {
        path: "serve-as-rider",
        element: <PrivateRoute><ServeAsRider></ServeAsRider></PrivateRoute>,
        loader: async () => {
          const res = await fetch("/data/warehouses.json");
          return res.json();
        }

      },
    ],
  },

  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children: [
      {
        path: "myparcel",
        element: <MyParcelList></MyParcelList>
      },
      {
        path: "payment/:id",
        element: <Payment></Payment>
      },
      {
        path: "payment-success",
        element: <PaymentSuccess></PaymentSuccess>
      },
      {
        path: "payment-fail",
        element: <PaymentFail></PaymentFail>
      },
      {
        path: "payment-history",
        element: <PaymentHistory></PaymentHistory>
      },
      {
        path: "pending-riders",
        element: <PendingRiders></PendingRiders>
      },
      {
        path: "active-riders",
        element: <ActiveRiders />
      }

    ]
  },




  {
    path: "/login",
    Component: Login
  },

  {
    path: "/register",
    Component: Register
  },



]);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='font-urbanist w-11/12 mx-auto'>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </div>
  </StrictMode>,
)
