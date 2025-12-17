import { Navigate, useLocation } from "react-router";
import useAuth from "../contexts/useAuth";


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // wait until auth state loads
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // logged in
  return children;
};

export default PrivateRoute;
