import { Navigate } from "react-router";
import useAuth from "../contexts/useAuth";
import useRider from "../hooks/useRider";


const RiderRoute = ({ children }) => {
  const { loading } = useAuth(); // check auth loading
  const [isRider, isRiderLoading] = useRider(); // custom hook to check rider status

  // 🔹 Show loader while checking auth/rider status
  if (loading || isRiderLoading) {
    return (
      <div className="flex justify-center min-h-screen items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 🔹 If not a rider, redirect to forbidden page
  if (!isRider) {
    return <Navigate to="/forbidden" replace />;
  }

  // 🔹 Otherwise render the children
  return children;
};

export default RiderRoute;
