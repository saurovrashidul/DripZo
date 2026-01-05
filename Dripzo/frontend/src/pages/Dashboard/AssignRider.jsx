import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const queryClient = useQueryClient();

  // 🔹 Fetch parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data;
    },
  });

  // const { data: parcels = [], isLoading, refetch } = useQuery({
  //   queryKey: ["parcels"],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get("/parcels");
  //     return res.data;
  //   },
  // });


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

  // const handleAssignRider = async (rider) => {
  //   const confirm = await Swal.fire({
  //     title: "Assign Rider?",
  //     text: `${rider.name} will be assigned to ${selectedParcel.trackingID}`,
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Assign",
  //   });

  //   if (!confirm.isConfirmed) return;

  //   try {
  //     await axiosSecure.patch(
  //       `/parcels/assign-rider/${selectedParcel._id}`,
  //       { riderId: rider._id }
  //     );

  //     Swal.fire("Success", "Rider assigned successfully", "success");
  //     setSelectedParcel(null);
  //     refetch(); // 🔥 refresh parcels
  //   } catch (error) {
  //     console.log(error)
  //     Swal.fire("Error", "Failed to assign rider", "error");
  //   }
  // };



  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcelId, riderId }) => {
      const res = await axiosSecure.patch(
        `/parcels/${parcelId}/assign-rider`,
        { riderId }
      );
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire("Success", data.message, "success");
      setSelectedParcel(null);

      // 🔄 refetch parcels after assignment
      queryClient.invalidateQueries(["parcels"]);
    },
    onError: (error) => {
      console.error(error);
      Swal.fire("Error", "Failed to assign rider", "error");
    },
  });

  const handleAssignRider = (rider) => {
    assignRiderMutation.mutate({
      parcelId: selectedParcel._id,
      riderId: rider._id,
    });
  };




  if (isLoading) {
    return <p className="text-center mt-10">Loading parcels...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Assign Riders ({riders.length})</h2>

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
                      disabled={assignRiderMutation.isLoading}
                    >
                      {assignRiderMutation.isLoading ? "Assigning..." : "Assign"}
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
