import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaMotorcycle } from "react-icons/fa";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const queryClient = useQueryClient();

  // 🔹 Fetch parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assignable-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/assignable");
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
      queryClient.invalidateQueries(["assignable-parcels"]);
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


 <div className="p-4 md:p-6 max-w-7xl mx-auto">
  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary">
    Assign Riders ({riders.length})
  </h2>

  {/* ---------- Table for Tablet & PC ---------- */}
  <div className="hidden md:block border rounded-lg shadow-lg">
    <table className="table table-zebra table-compact w-full">
      <thead className="bg-primary text-white">
        <tr>
          <th className="whitespace-nowrap">Tracking ID</th>
          <th className="whitespace-nowrap">Type</th>
          <th className="whitespace-nowrap">Sender Region</th>
          <th className="whitespace-nowrap">Receiver Region</th>
          <th className="whitespace-nowrap">Cost</th>
          <th className="whitespace-nowrap">Submission Date</th>
          <th className="whitespace-nowrap text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {parcels.map((parcel) => (
          <tr key={parcel._id} className="hover:bg-gray-50 transition-all">
            <td className="font-medium">{parcel.trackingID}</td>
            <td>{parcel.type}</td>
            <td>{parcel.senderRegion}</td>
            <td>{parcel.receiverRegion}</td>
            <td className="text-green-600 font-semibold">৳{parcel.totalCost}</td>
            <td>{parcel.submissionDateTime}</td>
            <td className="flex justify-center">
              <button
                className="btn btn-sm btn-primary flex items-center gap-1"
                onClick={() => setSelectedParcel(parcel)}
              >
                <FaMotorcycle className="w-4 h-4" /> Assign
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* ---------- Card Style for Mobile ---------- */}
  <div className="flex flex-col space-y-4 md:hidden">
    {parcels.map((parcel) => (
      <div
        key={parcel._id}
        className="border rounded-lg shadow-lg p-4 bg-gradient-to-r from-blue-50 to-white space-y-2"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-lg">{parcel.trackingID}</span>
          <span className="badge badge-info">{parcel.type}</span>
        </div>
        <p><strong>Sender:</strong> {parcel.senderRegion}</p>
        <p><strong>Receiver:</strong> {parcel.receiverRegion}</p>
        <p className="text-green-700 font-semibold"><strong>Cost:</strong> ৳{parcel.totalCost}</p>
        <p><strong>Submitted:</strong> {parcel.submissionDateTime}</p>
        <button
          className="btn btn-sm btn-primary w-full flex justify-center items-center gap-2"
          onClick={() => setSelectedParcel(parcel)}
        >
          <FaMotorcycle className="w-4 h-4" /> Assign Rider
        </button>
      </div>
    ))}
  </div>

  {/* ---------- Modal ---------- */}
  {selectedParcel && (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 md:w-2/3 max-w-lg mx-auto my-auto ">
        <h3 className="font-bold text-xl md:text-2xl mb-4 text-center text-primary">
          Assign Rider for {selectedParcel.trackingID}
        </h3>

        {matchedRiders.length === 0 ? (
          <p className="text-red-500 text-center font-semibold">
            No approved rider available in this district
          </p>
        ) : (
          <div className="space-y-3">
            {matchedRiders.map((rider) => (
              <div
                key={rider._id}
                className="p-3 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-white to-blue-50"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-blue-700">{rider.name}</p>
                  <p className="text-sm text-gray-600">{rider.phone}</p>
                  <p className="text-sm text-gray-600">{rider.vehicleNumber}</p>
                </div>
                <button
                  className="btn btn-success btn-sm mt-2 sm:mt-0"
                  onClick={() => handleAssignRider(rider)}
                  disabled={assignRiderMutation.isLoading}
                >
                  {assignRiderMutation.isLoading ? "Assigning..." : "Assign"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="modal-action mt-4">
          <button
            className="btn w-full md:w-auto bg-red-500 hover:bg-red-600 text-white"
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
