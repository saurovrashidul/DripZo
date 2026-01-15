import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../contexts/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";


const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedParcel, setSelectedParcel] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);


  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["riderDeliveries", user?.email],
    enabled: !loading && !!user?.email, // ✅ correct
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/pending?email=${user.email}`
      );
      return res.data;
    },
  });





  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcelId, status }) => {
      const res = await axiosSecure.patch(
        `/parcels/${parcelId}/delivery-status`,
        { status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["riderDeliveries",user?.email],
      });
    },
  });

  const renderActionButton = (parcel) => {
    if (parcel.deliveryStatus === "assigned") {
      return (
        <button
          className="btn btn-sm btn-primary"
          onClick={() =>
            updateStatusMutation.mutate({
              parcelId: parcel._id,
              status: "enroute",
            })
          }
        >
          Collect Parcel
        </button>
      );
    }

    if (parcel.deliveryStatus === "enroute") {
      return (
        <button
          className="btn btn-sm btn-warning"
          onClick={() =>
            updateStatusMutation.mutate({
              parcelId: parcel._id,
              status: "delivered",
            })
          }
        >
        Confirm Delivery
        </button>
      );
    }

    if (parcel.deliveryStatus === "delivered") {
      return (
        <button className="btn btn-sm btn-success" >
          Completed
        </button>
      );
    }

    return null;
  };



  // ✅ FIX: prevent early "No data" flash
  if (loading) {
    return (
      <p className="text-center mt-10">Checking rider access...</p>
    );
  }

  if (isLoading) {
    return (
      <p className="text-center mt-10">Loading deliveries...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load pending deliveries
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        My Pending Deliveries
        <span className="ml-2 badge badge-primary">
          {parcels.length}
        </span>
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500">
          No pending deliveries assigned to you
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                {/* <th>Parcel</th>
                <th>Type</th> */}
                <th>Sender</th>
                <th>Receiver</th>
                <th>Cost</th>
                <th>Assigned At</th>
                <th>Status</th>
                <th className="text-center">Action</th>

              </tr>
            </thead>

            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.trackingID}</td>
                  {/* <td>{parcel.title}</td>
                  <td>{parcel.type}</td> */}
                  <td>{parcel.senderRegion}</td>
                  <td>{parcel.receiverRegion}</td>
                  <td>৳ {parcel.totalCost}</td>
                  <td>
                    {parcel.assignedAt
                      ? new Date(parcel.assignedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    <span className="badge badge-info capitalize">
                      {parcel.deliveryStatus}
                    </span>
                  </td>
                  {/* <td>{renderActionButton(parcel)}</td>*/}

                  <td className="flex gap-2">
  {renderActionButton(parcel)}

  <button
    className="btn btn-sm btn-outline"
    onClick={() => {
      setSelectedParcel(parcel);
      setIsModalOpen(true);
    }}
  >
    Details
  </button>
</td>


                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}



<input
  type="checkbox"
  className="modal-toggle"
  checked={isModalOpen}
  readOnly
/>

<div className="modal modal-middle">
  <div className="modal-box max-w-xl">

    <h3 className="font-bold text-lg text-center mb-4">
      Parcel Details
    </h3>

    {selectedParcel && (
      <div className="space-y-2 text-sm">
        <p><strong>Tracking ID:</strong> {selectedParcel.trackingID}</p>
        <p><strong>Title:</strong> {selectedParcel.title}</p>
        <p><strong>Type:</strong> {selectedParcel.type}</p>
        <p><strong>Sender Region:</strong> {selectedParcel.senderRegion}</p>
        <p><strong>Receiver Region:</strong> {selectedParcel.receiverRegion}</p>
        <p><strong>Total Cost:</strong> ৳ {selectedParcel.totalCost}</p>

        <p>
          <strong>Status:</strong>{" "}
          <span className="badge badge-info capitalize">
            {selectedParcel.deliveryStatus}
          </span>
        </p>

        <p><strong>Payment Method:</strong> {selectedParcel.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {selectedParcel.paymentStatus}</p>

        {selectedParcel.assignedAt && (
          <p>
            <strong>Assigned At:</strong>{" "}
            {new Date(selectedParcel.assignedAt).toLocaleString()}
          </p>
        )}
      </div>
    )}

    <div className="modal-action">
      <button
        className="btn"
        onClick={() => setIsModalOpen(false)}
      >
        Close
      </button>
    </div>

  </div>
</div>


    </div>
  );
};

export default PendingDeliveries;
