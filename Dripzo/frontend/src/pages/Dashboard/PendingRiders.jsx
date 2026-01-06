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
    // <div className="p-6">
    //   <h2 className="text-2xl text-center font-bold mb-4">Pending Riders ({riders.length})</h2>

    //   {riders.length === 0 ? (
    //     <p>No pending riders</p>
    //   ) : (


    //     <div className="overflow-x-auto">
    //       <table className="table table-zebra w-full">
    //         <thead>
    //           <tr>
    //             <th>Name</th>
    //             <th>Email</th>
    //             <th>Status</th>
    //             <th>Applied On</th>
    //             <th className="text-center">Action</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {riders.map((rider) => (
    //             <tr key={rider._id}>
    //               <td>{rider.name}</td>
    //               <td>{rider.email}</td>
    //               <td className="capitalize">{rider.status}</td>
    //               <td>
    //                 {new Date(rider.createdAt).toLocaleDateString()}
    //               </td>
    //               <td className="space-x-2">
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
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>

    //   )}

    //   {/* -------- Modal -------- */}
    //   {selectedRider && (
    //     <dialog className="modal modal-open">
    //       <div className="modal-box">
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

    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl text-center font-bold mb-4">
        Pending Riders ({riders.length})
      </h2>

      {riders.length === 0 ? (
        <p className="text-center text-gray-500">No pending riders</p>
      ) : (
        <>
          {/* ================= MOBILE (< md) ================= */}
          <div className="space-y-4 md:hidden">
            {riders.map((rider) => (
              <div key={rider._id} className="card bg-base-100 shadow">
                <div className="card-body p-4 space-y-2">
                  <p><span className="font-semibold">Name:</span> {rider.name}</p>
                  <p className="break-all">
                    <span className="font-semibold">Email:</span> {rider.email}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="badge badge-outline capitalize">
                      {rider.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Applied: {new Date(rider.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setSelectedRider(rider)}
                    >
                      Details
                    </button>

                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleStatusChange(rider._id, "approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleStatusChange(rider._id, "rejected")}
                    >
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
              <div
                key={rider._id}
                className="bg-base-100 rounded-lg shadow p-4 grid grid-cols-2 gap-y-2"
              >
                <div className="font-semibold">Name</div>
                <div>{rider.name}</div>

                <div className="font-semibold">Email</div>
                <div className="break-all">{rider.email}</div>

                <div className="font-semibold">Status</div>
                <div className="capitalize">{rider.status}</div>

                <div className="font-semibold">Applied On</div>
                <div className="text-sm">
                  {new Date(rider.createdAt).toLocaleDateString()}
                </div>

                <div className="col-span-2 flex flex-wrap gap-2 pt-3">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedRider(rider)}
                  >
                    Details
                  </button>

                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleStatusChange(rider._id, "approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleStatusChange(rider._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= DESKTOP (≥ lg) ================= */}
          <div className="hidden lg:block">
            <table className="table table-zebra w-full">
              <thead>
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
                  <tr key={rider._id}>
                    <td>{rider.name}</td>
                    <td className="break-all">{rider.email}</td>
                    <td className="capitalize">{rider.status}</td>
                    <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
                    <td className="space-x-2 text-center">
                      <button
                        className="btn btn-xs btn-info"
                        onClick={() => setSelectedRider(rider)}
                      >
                        Details
                      </button>

                      <button
                        className="btn btn-xs btn-success"
                        onClick={() =>
                          handleStatusChange(rider._id, "approved")
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-xs btn-error"
                        onClick={() =>
                          handleStatusChange(rider._id, "rejected")
                        }
                      >
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

      {/* modal */}

      {selectedRider && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg mb-3">Rider Details</h3>

            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedRider.name}</p>
              <p><strong>Email:</strong> {selectedRider.email}</p>
              <p><strong>Phone:</strong> {selectedRider.phone}</p>
              <p><strong>NID:</strong> {selectedRider.nid}</p>
              <p><strong>District:</strong> {selectedRider.district}</p>
              <p><strong>Service Center:</strong> {selectedRider.serviceCenter}</p>
              <p><strong>Vehicle Type:</strong> {selectedRider.vehicleType}</p>
              <p><strong>Vehicle Number:</strong> {selectedRider.vehicleNumber}</p>
              <p><strong>Registration Number:</strong> {selectedRider.registrationNumber}</p>
              <p><strong>Address:</strong> {selectedRider.address}</p>
              <p><strong>Status:</strong> {selectedRider.status}</p>
            </div>

            <div className="modal-action">
              <button
                className="btn"
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
