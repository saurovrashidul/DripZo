import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);

  // 🔹 Fetch parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data;
    },
  });

  // 🔹 Fetch ONLY approved riders
  const { data: riders = [] } = useQuery({
    queryKey: ["approvedRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=approved");
      return res.data;
    },
    enabled: !!selectedParcel,
  });

  // 🔹 Filter riders by district = senderRegion
  const matchedRiders = riders.filter(
    (rider) => rider.district === selectedParcel?.senderRegion
  );

  // 🔹 Assign rider handler
  const handleAssignRider = async (rider) => {
    try {
      await axiosSecure.patch(
        `/parcels/assign-rider/${selectedParcel._id}`,
        {
          riderId: rider._id,
          riderName: rider.name,
          riderPhone: rider.phone,
        }
      );

      Swal.fire("Success", "Rider assigned successfully", "success");
      setSelectedParcel(null);
    } catch (error) {
      Swal.fire("Error", "Failed to assign rider", "error");
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading parcels...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assign Rider</h2>

      {/* 🔹 Parcel Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Type</th>
              <th>Sender Region</th>
              <th>Receiver Region</th>
              <th>Cost</th>
              <th>Submission Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.trackingID}</td>
                <td>{parcel.type}</td>
                <td>{parcel.senderRegion}</td>
                <td>{parcel.receiverRegion}</td>
                <td>৳ {parcel.totalCost}</td>
                <td>{parcel.submissionDateTime}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedParcel(parcel)}
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Modal */}
      {selectedParcel && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-3">
              Assign Rider for {selectedParcel.trackingID}
            </h3>

            {matchedRiders.length === 0 ? (
              <p className="text-red-500">
                No approved rider available in this district
              </p>
            ) : (
              <div className="space-y-3">
                {matchedRiders.map((rider) => (
                  <div
                    key={rider._id}
                    className="p-3 border rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{rider.name}</p>
                      <p className="text-sm">{rider.phone}</p>
                      <p className="text-sm">{rider.vehicleNumber}</p>
                    </div>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAssignRider(rider)}
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setSelectedParcel(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AssignRider;
