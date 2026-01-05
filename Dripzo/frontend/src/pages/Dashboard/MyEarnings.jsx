import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../contexts/useAuth";

// ✅ EarningCard component inside the same file
const EarningCard = ({ title, amount, highlight }) => (
  <div
    className={`card shadow-lg p-4 ${
      highlight ? "bg-green-100" : "bg-base-100"
    }`}
  >
        <div className="flex flex-col h-32">
      {/* Top half: Title */}
      <div className="flex-1 flex items-center justify-center">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {/* Bottom half: Amount */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-2xl font-bold text-green-600">৳ {amount}</p>
      </div>
    </div>
  </div>
);

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["riderEarnings", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/earnings-summary?email=${user.email}`
      );
      return res.data;
    },
  });

  // ✅ Loading state
  if (loading || isLoading) {
    return <p className="text-center mt-10">Loading earnings...</p>;
  }

  // ✅ Error state
  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load earnings
      </p>
    );
  }

  // ✅ If data is empty
  if (!data) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No earnings data available
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        My Earnings Summary
      </h2>

      {/* ✅ Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <EarningCard title="Today" amount={data.today} />
        <EarningCard title="This Week" amount={data.week} />
        <EarningCard title="This Month" amount={data.month} />
        <EarningCard title="This Year" amount={data.year} />
        <EarningCard title="Total" amount={data.total} highlight />
      </div>
    </div>
  );
};

export default MyEarnings;
