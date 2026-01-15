import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);

  // Fetch pending riders
  const { data: riders = [], isLoading, isError } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=pending");
      return res.data;
    },
  });

  // Approve / Reject mutation
  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/riders/${id}`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      Swal.fire(
        "Success",
        `Rider ${variables.status} successfully`,
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["pendingRiders"] });
      setSelectedRider(null);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update status", "error");
    },
  });







  //   Swal.fire({
  //     title: "Are you sure?",
  //     text:
  //       status === "approved"
  //         ? "Do you want to approve this rider?"
  //         : "This will permanently delete the rider application!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
  //     cancelButtonColor: "#6b7280",
  //     confirmButtonText:
  //       status === "approved" ? "Yes, approve" : "Yes, reject",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       if (status === "approved") {
  //         mutation.mutate({ id, status });
  //       } else {
  //         deleteMutation.mutate(id); 
  //       }
  //     }
  //   });
  // };

  const handleStatusChange = (id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text:
        status === "approved"
          ? "Do you want to approve this rider?"
          : "Do you want to reject this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText:
        status === "approved" ? "Yes, approve" : "Yes, reject",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, status });
      }
    });
  };


  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load riders</p>;

  return (
   

    // <div className="p-4 md:p-6">
    //   <h2 className="text-xl md:text-2xl text-center font-bold mb-4">
    //     Pending Riders ({riders.length})
    //   </h2>

    //   {riders.length === 0 ? (
    //     <p className="text-center text-gray-500">No pending riders</p>
    //   ) : (
    //     <>
    //       {/* ================= MOBILE (< md) ================= */}
    //       <div className="space-y-4 md:hidden">
    //         {riders.map((rider) => (
    //           <div key={rider._id} className="card bg-base-100 shadow">
    //             <div className="card-body p-4 space-y-2">
    //               <p><span className="font-semibold">Name:</span> {rider.name}</p>
    //               <p className="break-all">
    //                 <span className="font-semibold">Email:</span> {rider.email}
    //               </p>
    //               <p>
    //                 <span className="font-semibold">Status:</span>{" "}
    //                 <span className="badge badge-outline capitalize">
    //                   {rider.status}
    //                 </span>
    //               </p>
    //               <p className="text-sm text-gray-500">
    //                 Applied: {new Date(rider.createdAt).toLocaleDateString()}
    //               </p>

    //               <div className="flex flex-wrap gap-2 pt-2">
    //                 <button
    //                   className="btn btn-sm btn-info"
    //                   onClick={() => setSelectedRider(rider)}
    //                 >
    //                   Details
    //                 </button>

    //                 <button
    //                   className="btn btn-sm btn-success"
    //                   onClick={() => handleStatusChange(rider._id, "approved")}
    //                 >
    //                   Approve
    //                 </button>

    //                 <button
    //                   className="btn btn-sm btn-error"
    //                   onClick={() => handleStatusChange(rider._id, "rejected")}
    //                 >
    //                   Reject
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>

    //       {/* ================= TABLET (md → lg) ================= */}
    //       <div className="hidden md:grid lg:hidden gap-4">
    //         {riders.map((rider) => (
    //           <div
    //             key={rider._id}
    //             className="bg-base-100 rounded-lg shadow p-4 grid grid-cols-2 gap-y-2"
    //           >
    //             <div className="font-semibold">Name</div>
    //             <div>{rider.name}</div>

    //             <div className="font-semibold">Email</div>
    //             <div className="break-all">{rider.email}</div>

    //             <div className="font-semibold">Status</div>
    //             <div className="capitalize">{rider.status}</div>

    //             <div className="font-semibold">Applied On</div>
    //             <div className="text-sm">
    //               {new Date(rider.createdAt).toLocaleDateString()}
    //             </div>

    //             <div className="col-span-2 flex flex-wrap gap-2 pt-3">
    //               <button
    //                 className="btn btn-sm btn-info"
    //                 onClick={() => setSelectedRider(rider)}
    //               >
    //                 Details
    //               </button>

    //               <button
    //                 className="btn btn-sm btn-success"
    //                 onClick={() => handleStatusChange(rider._id, "approved")}
    //               >
    //                 Approve
    //               </button>

    //               <button
    //                 className="btn btn-sm btn-error"
    //                 onClick={() => handleStatusChange(rider._id, "rejected")}
    //               >
    //                 Reject
    //               </button>
    //             </div>
    //           </div>
    //         ))}
    //       </div>

    //       {/* ================= DESKTOP (≥ lg) ================= */}
    //       <div className="hidden lg:block">
    //         <table className="table table-zebra w-full">
    //           <thead>
    //             <tr>
    //               <th>Name</th>
    //               <th>Email</th>
    //               <th>Status</th>
    //               <th>Applied On</th>
    //               <th className="text-center">Action</th>
    //             </tr>
    //           </thead>

    //           <tbody>
    //             {riders.map((rider) => (
    //               <tr key={rider._id}>
    //                 <td>{rider.name}</td>
    //                 <td className="break-all">{rider.email}</td>
    //                 <td className="capitalize">{rider.status}</td>
    //                 <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
    //                 <td className="space-x-2 text-center">
    //                   <button
    //                     className="btn btn-xs btn-info"
    //                     onClick={() => setSelectedRider(rider)}
    //                   >
    //                     Details
    //                   </button>

    //                   <button
    //                     className="btn btn-xs btn-success"
    //                     onClick={() =>
    //                       handleStatusChange(rider._id, "approved")
    //                     }
    //                   >
    //                     Approve
    //                   </button>

    //                   <button
    //                     className="btn btn-xs btn-error"
    //                     onClick={() =>
    //                       handleStatusChange(rider._id, "rejected")
    //                     }
    //                   >
    //                     Reject
    //                   </button>
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     </>





    //   )}

    //   {/* modal */}

    //   {selectedRider && (
    //     <dialog className="modal modal-open">
    //       <div className="modal-box max-w-lg">
    //         <h3 className="font-bold text-lg mb-3">Rider Details</h3>

    //         <div className="space-y-2 text-sm">
    //           <p><strong>Name:</strong> {selectedRider.name}</p>
    //           <p><strong>Email:</strong> {selectedRider.email}</p>
    //           <p><strong>Phone:</strong> {selectedRider.phone}</p>
    //           <p><strong>NID:</strong> {selectedRider.nid}</p>
    //           <p><strong>District:</strong> {selectedRider.district}</p>
    //           <p><strong>Service Center:</strong> {selectedRider.serviceCenter}</p>
    //           <p><strong>Vehicle Type:</strong> {selectedRider.vehicleType}</p>
    //           <p><strong>Vehicle Number:</strong> {selectedRider.vehicleNumber}</p>
    //           <p><strong>Registration Number:</strong> {selectedRider.registrationNumber}</p>
    //           <p><strong>Address:</strong> {selectedRider.address}</p>
    //           <p><strong>Status:</strong> {selectedRider.status}</p>
    //         </div>

    //         <div className="modal-action">
    //           <button
    //             className="btn"
    //             onClick={() => setSelectedRider(null)}
    //           >
    //             Close
    //           </button>
    //         </div>
    //       </div>
    //     </dialog>
    //   )}


    // </div>


<div className="p-4 md:p-6 bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-xl">
  <h2 className="text-xl md:text-2xl text-center font-bold mb-4 text-blue-700">
    Pending Riders ({riders.length})
  </h2>

  {riders.length === 0 ? (
    <p className="text-center text-gray-500 italic">No pending riders</p>
  ) : (
    <>
      {/* ================= MOBILE (< md) ================= */}
      <div className="space-y-4 md:hidden">
        {riders.map((rider) => (
          <div key={rider._id} className="card bg-gradient-to-r from-white to-blue-50 shadow-lg border-l-4 border-blue-400 hover:scale-105 transition-transform duration-200">
            <div className="card-body p-4 space-y-2">
              <p><span className="font-semibold text-blue-600">Name:</span> {rider.name}</p>
              <p className="break-all"><span className="font-semibold text-blue-600">Email:</span> {rider.email}</p>
              <p>
                <span className="font-semibold text-blue-600">Status:</span>{" "}
                <span className={`badge capitalize ${rider.status === "approved" ? "badge-success" : rider.status === "rejected" ? "badge-error" : "badge-warning"}`}>
                  {rider.status}
                </span>
              </p>
              <p className="text-sm text-gray-500">Applied: {new Date(rider.createdAt).toLocaleDateString()}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                <button className="btn btn-sm btn-info bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white" onClick={() => setSelectedRider(rider)}>
                  Details
                </button>
                <button className="btn btn-sm btn-success bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white" onClick={() => handleStatusChange(rider._id, "approved")}>
                  Approve
                </button>
                <button className="btn btn-sm btn-error bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white" onClick={() => handleStatusChange(rider._id, "rejected")}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= TABLET (md → lg) ================= */}
      <div className="hidden md:grid lg:hidden gap-4">
        {riders.map((rider) => (
          <div key={rider._id} className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-4 grid grid-cols-2 gap-y-2 hover:scale-105 transition-transform duration-200 border-l-4 border-blue-400">
            <div className="font-semibold text-blue-600">Name</div>
            <div>{rider.name}</div>

            <div className="font-semibold text-blue-600">Email</div>
            <div className="break-all">{rider.email}</div>

            <div className="font-semibold text-blue-600">Status</div>
            <div>
              <span className={`badge capitalize ${rider.status === "approved" ? "badge-success" : rider.status === "rejected" ? "badge-error" : "badge-warning"}`}>
                {rider.status}
              </span>
            </div>

            <div className="font-semibold text-blue-600">Applied On</div>
            <div className="text-sm">{new Date(rider.createdAt).toLocaleDateString()}</div>

            <div className="col-span-2 flex flex-wrap gap-2 pt-3">
              <button className="btn btn-sm btn-info bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white" onClick={() => setSelectedRider(rider)}>
                Details
              </button>
              <button className="btn btn-sm btn-success bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white" onClick={() => handleStatusChange(rider._id, "approved")}>
                Approve
              </button>
              <button className="btn btn-sm btn-error bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white" onClick={() => handleStatusChange(rider._id, "rejected")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP (≥ lg) ================= */}
      <div className="hidden lg:block overflow-hidden rounded-xl shadow-lg border border-gray-200">
        <table className="table w-full table-zebra table-auto bg-gradient-to-r from-white to-blue-50">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Applied On</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {riders.map((rider) => (
              <tr key={rider._id} className="hover:bg-blue-100 transition-colors">
                <td className="font-medium text-blue-700">{rider.name}</td>
                <td className="break-all">{rider.email}</td>
                <td>
                  <span className={`badge capitalize ${rider.status === "approved" ? "badge-success" : rider.status === "rejected" ? "badge-error" : "badge-warning"}`}>
                    {rider.status}
                  </span>
                </td>
                <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2 text-center">
                  <button className="btn btn-xs btn-info bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white" onClick={() => setSelectedRider(rider)}>
                    Details
                  </button>
                  <button className="btn btn-xs btn-success bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white" onClick={() => handleStatusChange(rider._id, "approved")}>
                    Approve
                  </button>
                  <button className="btn btn-xs btn-error bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white" onClick={() => handleStatusChange(rider._id, "rejected")}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}

  {/* ================= MODAL ================= */}
  {selectedRider && (
   <dialog className="modal modal-open">
  <div className="modal-box max-w-md w-11/12 mx-auto p-6 rounded-xl shadow-2xl bg-gradient-to-b from-white to-blue-50 border-l-4 border-blue-400">
    <h3 className="font-bold text-2xl mb-4 text-blue-700 text-center">Rider Details</h3>

    <div className="space-y-3 text-gray-700">
      <p>
        <span className="font-semibold text-blue-600">Name:</span> {selectedRider.name}
      </p>
      <p>
        <span className="font-semibold text-blue-600">Email:</span> {selectedRider.email}
      </p>
      <p>
        <span className="font-semibold text-blue-600">Phone:</span> {selectedRider.phone}
      </p>
      <p>
        <span className="font-semibold text-blue-600">NID:</span> {selectedRider.nid}
      </p>
      <p>
        <span className="font-semibold text-blue-600">District:</span>{" "}
        <span className="badge badge-info">{selectedRider.district}</span>
      </p>
      <p>
        <span className="font-semibold text-blue-600">Service Center:</span>{" "}
        <span className="badge badge-primary">{selectedRider.serviceCenter}</span>
      </p>
      <p>
        <span className="font-semibold text-blue-600">Vehicle Type:</span>{" "}
        <span className="badge badge-accent capitalize">{selectedRider.vehicleType}</span>
      </p>
      <p>
        <span className="font-semibold text-blue-600">Vehicle Number:</span>{" "}
        <span className="text-green-700 font-medium">{selectedRider.vehicleNumber}</span>
      </p>
      <p>
        <span className="font-semibold text-blue-600">Registration Number:</span>{" "}
        <span className="text-green-700 font-medium">{selectedRider.registrationNumber}</span>
      </p>
      <p>
        <span className="font-semibold text-blue-600">Address:</span>{" "}
        <span className="italic">{selectedRider.address}</span>
      </p>
      <p>
        <span className="font-semibold text-blue-600">Status:</span>{" "}
        <span className={`badge capitalize ${selectedRider.status === "approved" ? "badge-success" : selectedRider.status === "rejected" ? "badge-error" : "badge-warning"}`}>
          {selectedRider.status}
        </span>
      </p>
    </div>

    <div className="modal-action mt-4 flex justify-center">
      <button
        className="btn btn-info bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white w-full md:w-auto"
        onClick={() => setSelectedRider(null)}
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

export default PendingRiders;
