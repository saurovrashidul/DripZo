import { useQuery } from "@tanstack/react-query";
import useAuth from "../contexts/useAuth";
import useAxiosSecure from "./useAxiosSecure";


const useRider = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isRider, isLoading } = useQuery({
    queryKey: ["isRider", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      // 🔹 Backend route should return { rider: true/false } or { isRider: true/false }
      const res = await axiosSecure.get(`/riders/check/${user.email}`);
      return res.data?.rider; // change this based on backend response
    },
  });

  return [isRider, isLoading];
};

export default useRider;
