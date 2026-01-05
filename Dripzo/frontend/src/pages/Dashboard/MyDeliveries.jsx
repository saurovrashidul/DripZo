import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../contexts/useAuth";


const MyDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();


  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myDeliveredParcels", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/delivered?email=${user.email}`
      );
      return res.data;
    },
  });



  const calculateEarning = (parcel) => {
    const sameRegion = parcel.senderRegion === parcel.receiverRegion;
    const rate = sameRegion ? 0.2 : 0.45;
    return Math.round(parcel.totalCost * rate);
  };

  const handleCashOut = async (parcelId, earningAmount) => {
    try {
      await axiosSecure.patch(`/parcels/cash-out/${parcelId}`, {
        earningAmount,
      });

      // 🔄 refresh deliveries list
      queryClient.invalidateQueries(["myDeliveredParcels"]);
    } catch (error) {
      console.error(error);
      alert("Cash out failed");
    }
  };


  if (loading || isLoading) {
    return <p className="text-center mt-10">Loading deliveries...</p>;
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load deliveries
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        My Completed Deliveries
        <span className="ml-2 badge badge-success">{parcels.length}</span>
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500">
          No completed deliveries yet
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Parcel</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Delivered At</th>
                <th>Cost</th>
                <th>Earning</th>
                <th className="text-center">Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            {/* <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.trackingID}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.senderRegion}</td>
                  <td>{parcel.receiverRegion}</td>
                  <td>৳ {parcel.totalCost}</td>
                  <td>
                    {parcel.deliveredAt
                      ? new Date(parcel.deliveredAt).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    <span className="badge badge-success capitalize">
                      delivered
                    </span>
                  </td>
                </tr>
              ))}
            </tbody> */}

            <tbody>
              {parcels.map((parcel) => {
                const earning = calculateEarning(parcel);
                const isCashedOut =
                  parcel.assignedRider?.riderPayment === "cashed out";

                return (
                  <tr key={parcel._id}>
                    <td>{parcel.trackingID}</td>
                    <td>{parcel.title}</td>
                    <td>{parcel.senderRegion}</td>
                    <td>{parcel.receiverRegion}</td>
                    <td>
                      {parcel.deliveredAt
                        ? new Date(parcel.deliveredAt).toLocaleString()
                        : "—"}
                    </td>
                    <td>৳ {parcel.totalCost}</td>


                    {/* ✅ EARNING */}
                    <td className="font-semibold text-green-600">
                      ৳ {earning}
                    </td>
                    <td>
                      <span className="badge badge-success capitalize">
                        delivered
                      </span>
                    </td>

                    {/* ✅ ACTION */}
                    <td className="text-center">
                      {isCashedOut ? (
                        <button
                          disabled
                          className="btn btn-sm btn-success text-black text-[12px] cursor-not-allowed opacity-80"
                        >
                          Cashed Out
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCashOut(parcel._id, earning)}
                          className="btn btn-sm btn-primary"
                        >
                          Cash Out
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>



          </table>
        </div>
      )}
    </div>
  );
};

export default MyDeliveries;
