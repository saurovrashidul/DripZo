import { Navigate } from "react-router";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../contexts/useAuth";



const AdminRoute = ({ children }) => {
  const { loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();

  if (loading || isAdminLoading) {
    return (
      <div className="flex justify-center min-h-screen items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default AdminRoute;
