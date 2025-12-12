import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from './layout/RootLayout';
import Home from './pages/Home/Home';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import AuthProvider from './contexts/AuthProvider';
import ServiceLocations from './pages/serviceLocations';
import PrivateRoute from './route/PrivateRoute';
import SendParcel from './pages/SendParcel/SendParcel';






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
        element: <SendParcel></SendParcel>
      }
    ],
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



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='font-urbanist w-11/12 mx-auto'>
      <AuthProvider>
        <RouterProvider router={router} />,
      </AuthProvider>

    </div>
  </StrictMode>,
)
