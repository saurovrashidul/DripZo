import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../contexts/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router";
import { FaEye, FaTrash, FaMoneyBillWave } from "react-icons/fa";


const MyParcelList = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedParcel, setSelectedParcel] = useState(null);

  // ---delete parcel mutation
  const deleteParcelMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/parcels/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-parcels", user?.email] });
    },
  });

  const handleDelete = async (parcelId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteParcelMutation.mutateAsync(parcelId);
        Swal.fire("Deleted!", "Your parcel has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete parcel.", error);
      }
    }
  };

  // ---fetch parcels
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="p-6 text-center">Loading...</p>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load parcels</p>;

  return (
    // <div className="p-4 md:p-6">
    //   <h2 className="text-2xl font-bold text-center mb-4">My Parcels ({parcels.length})</h2>

    //   {parcels.length === 0 ? (
    //     <p className="text-center text-gray-500">No parcels found</p>
    //   ) : (
    //     <div className="overflow-x-auto">
    //       <table className="table table-zebra w-full">
    //         <thead>
    //           <tr>
    //             <th>#</th>
    //             <th>Type</th>
    //             <th>Cost</th>
    //             <th>Payment</th>
    //             <th>Status</th>
    //             <th>Date</th>
    //             <th>Actions</th>
    //           </tr>
    //         </thead>

    //         <tbody>
    //           {parcels.map((parcel, index) => (
    //             <tr key={parcel._id}>
    //               <td>{index + 1}</td>
    //               <td>{parcel.type}</td>
    //               <td>৳{parcel.totalCost}</td>
    //               <td>
    //                 {parcel.paymentStatus === "paid" ? (
    //                   <span className="badge badge-success">Paid</span>
    //                 ) : (
    //                   <span className="badge badge-warning">Unpaid</span>
    //                 )}
    //               </td>
    //               <td>
    //                 <span className="badge badge-info">{parcel.deliveryStatus}</span>
    //               </td>
    //               <td>{parcel.submissionDateTime}</td>
    //               <td className="space-x-1">
    //                 {/* ✅ View Button */}
    //                 <button
    //                   className="btn btn-xs btn-info"
    //                   onClick={() => setSelectedParcel(parcel)}
    //                 >
    //                   View
    //                 </button>

    //                 {/* Pay Button */}
    //                 <button
    //                   className={`btn btn-xs ${parcel.paymentStatus === "paid"
    //                     ? "btn-disabled btn-success"
    //                     : "btn-success"
    //                     }`}
    //                   disabled={parcel.paymentStatus === "paid"}
    //                   onClick={() => {
    //                     if (parcel.paymentStatus !== "paid") {
    //                       navigate(`/dashboard/payment/${parcel._id}`);
    //                     }
    //                   }}
    //                 >
    //                   {parcel.paymentStatus === "paid" ? "Paid" : "Pay"}
    //                 </button>

    //                 {/* Delete Button */}
    //                 <button
    //                   className="btn btn-xs btn-error"
    //                   onClick={() => handleDelete(parcel._id)}
    //                 >
    //                   Delete
    //                 </button>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>





    //   )}

    //   {/* ---------- Modal ---------- */}
    //   {selectedParcel && (
    //     <dialog className="modal modal-open">
    //       <div className="modal-box max-w-lg">
    //         <h3 className="font-bold text-lg mb-3">Parcel Details</h3>

    //         {/* <div className="space-y-2 text-sm">
    //           <p><strong>Type:</strong> {selectedParcel.type}</p>
    //           <p><strong>Total Cost:</strong> ৳{selectedParcel.totalCost}</p>
    //           <p><strong>Payment Status:</strong> {selectedParcel.paymentStatus}</p>
    //           <p><strong>Status:</strong> {selectedParcel.deliveryStatus}</p>
    //           <p><strong>Submitted On:</strong> {selectedParcel.submissionDateTime}</p>
    //         </div> */}



    //         <div className="space-y-2 text-sm border p-4 rounded shadow-sm bg-white">
    //           <p><strong>Tracking ID:</strong> {selectedParcel.trackingID}</p>
    //           <p><strong>Type:</strong> {selectedParcel.type}</p>
    //           <p><strong>Weight:</strong> {selectedParcel.weight} kg</p>
    //           <p><strong>Total Cost:</strong> ৳{selectedParcel.totalCost}</p>
    //           <p><strong>Status:</strong> {selectedParcel.deliveryStatus}</p>
    //           <p><strong>Submitted On:</strong> {selectedParcel.submissionDateTime}</p>

    //           <hr className="my-2" />

    //           <h4 className="font-semibold">Sender Details:</h4>
    //           <p><strong>Name:</strong> {selectedParcel.senderName}</p>
    //           <p><strong>Contact:</strong> {selectedParcel.senderContact}</p>
    //           <p><strong>Region:</strong> {selectedParcel.senderRegion}</p>
    //           <p><strong>Service Center:</strong> {selectedParcel.senderServiceCenter}</p>
    //           <p><strong>Pickup Instructions:</strong> {selectedParcel.pickupInstruction}</p>

    //           <hr className="my-2" />

    //           <h4 className="font-semibold">Receiver Details:</h4>
    //           <p><strong>Name:</strong> {selectedParcel.receiverName}</p>
    //           <p><strong>Contact:</strong> {selectedParcel.receiverContact}</p>
    //           <p><strong>Region:</strong> {selectedParcel.receiverRegion}</p>
    //           <p><strong>Service Center:</strong> {selectedParcel.receiverServiceCenter}</p>
    //           <p><strong>Delivery Instructions:</strong> {selectedParcel.deliveryInstruction}</p>

    //           <hr className="my-2" />

    //           <p><strong>User Email:</strong> {selectedParcel.userEmail}</p>
    //         </div>




    //         <div className="modal-action">
    //           <button className="btn" onClick={() => setSelectedParcel(null)}>
    //             Close
    //           </button>
    //         </div>
    //       </div>
    //     </dialog>
    //   )}
    // </div>

    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        My Parcels ({parcels.length})
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500">No parcels found</p>
      ) : (
        <>
          {/* ---------- Table for Tablet & PC ---------- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Cost</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {parcels.map((parcel, index) => (
                  <tr key={parcel._id} className="align-top">
                    <td>{index + 1}</td>
                    <td>{parcel.type}</td>
                    <td>৳{parcel.totalCost}</td>
                    <td>
                      {parcel.paymentStatus === "paid" ? (
                        <span className="badge badge-success">Paid</span>
                      ) : (
                        <span className="badge badge-warning">Unpaid</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-info max-w-[120px] truncate block">
                        {parcel.deliveryStatus}
                      </span>

                    </td>
                    <td>{parcel.submissionDateTime}</td>
                    <td className="flex flex-wrap gap-1 justify-start md:justify-end">
                      <button
                        className="btn btn-xs btn-info"
                        onClick={() => setSelectedParcel(parcel)}
                      >
                        <FaEye className="w-4 h-4" /> {/* View */}
                      </button>
                      <button
                        className={`btn btn-xs ${parcel.paymentStatus === "paid"
                          ? "btn-disabled btn-success"
                          : "btn-success"
                          }`}
                        disabled={parcel.paymentStatus === "paid"}
                        onClick={() => {
                          if (parcel.paymentStatus !== "paid") {
                            navigate(`/dashboard/payment/${parcel._id}`);
                          }
                        }}
                      >
                        {parcel.paymentStatus === "paid" ? "Paid" : <FaMoneyBillWave className="w-4 h-4" />}
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDelete(parcel._id)}
                      >
                        <FaTrash className="w-4 h-4" /> {/* Delete */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------- Card Style for Mobile ---------- */}
          <div className="flex flex-col space-y-4 md:hidden">
            {parcels.map((parcel, index) => (
              <div
                key={parcel._id}
                className="border rounded-lg shadow p-4 space-y-2 bg-white"
              >
                <p>
                  <strong>#{index + 1}</strong>
                </p>
                <p>
                  <strong>Type:</strong> {parcel.type}
                </p>
                <p>
                  <strong>Cost:</strong> ৳{parcel.totalCost}
                </p>
                <p>
                  <strong>Payment:</strong>{" "}
                  {parcel.paymentStatus === "paid" ? (
                    <span className="badge badge-success">Paid</span>
                  ) : (
                    <span className="badge badge-warning">Unpaid</span>
                  )}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="badge badge-info">{parcel.deliveryStatus}</span>
                </p>
                <p>
                  <strong>Date:</strong> {parcel.submissionDateTime}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    className="btn btn-xs btn-info flex-1"
                    onClick={() => setSelectedParcel(parcel)}
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    className={`btn btn-xs flex-1 ${parcel.paymentStatus === "paid"
                      ? "btn-disabled btn-success"
                      : "btn-success"
                      }`}
                    disabled={parcel.paymentStatus === "paid"}
                    onClick={() => {
                      if (parcel.paymentStatus !== "paid") {
                        navigate(`/dashboard/payment/${parcel._id}`);
                      }
                    }}
                  >
                    {parcel.paymentStatus === "paid" ? "Paid" : <FaMoneyBillWave className="w-4 h-4" />}
                  </button>
                  <button
                    className="btn btn-xs btn-error flex-1"
                    onClick={() => handleDelete(parcel._id)}
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------- Modal ---------- */}
      {selectedParcel && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-full md:max-w-lg w-full">
            <h3 className="font-bold text-lg mb-3">Parcel Details</h3>

            <div className="space-y-2 text-sm border p-4 rounded shadow-sm bg-white">
              <p>
                <strong>Tracking ID:</strong> {selectedParcel.trackingID}
              </p>
              <p>
                <strong>Type:</strong> {selectedParcel.type}
              </p>
              <p>
                <strong>Weight:</strong> {selectedParcel.weight} kg
              </p>
              <p>
                <strong>Total Cost:</strong> ৳{selectedParcel.totalCost}
              </p>
              <p>
                <strong>Status:</strong> {selectedParcel.deliveryStatus}
              </p>
              <p>
                <strong>Submitted On:</strong> {selectedParcel.submissionDateTime}
              </p>

              <hr className="my-2" />

              <h4 className="font-semibold">Sender Details:</h4>
              <p>
                <strong>Name:</strong> {selectedParcel.senderName}
              </p>
              <p>
                <strong>Contact:</strong> {selectedParcel.senderContact}
              </p>
              <p>
                <strong>Region:</strong> {selectedParcel.senderRegion}
              </p>
              <p>
                <strong>Service Center:</strong> {selectedParcel.senderServiceCenter}
              </p>
              <p>
                <strong>Pickup Instructions:</strong> {selectedParcel.pickupInstruction}
              </p>

              <hr className="my-2" />

              <h4 className="font-semibold">Receiver Details:</h4>
              <p>
                <strong>Name:</strong> {selectedParcel.receiverName}
              </p>
              <p>
                <strong>Contact:</strong> {selectedParcel.receiverContact}
              </p>
              <p>
                <strong>Region:</strong> {selectedParcel.receiverRegion}
              </p>
              <p>
                <strong>Service Center:</strong> {selectedParcel.receiverServiceCenter}
              </p>
              <p>
                <strong>Delivery Instructions:</strong> {selectedParcel.deliveryInstruction}
              </p>

              <hr className="my-2" />

              <p>
                <strong>User Email:</strong> {selectedParcel.userEmail}
              </p>
            </div>

            <div className="modal-action">
              <button
                className="btn w-full md:w-auto"
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

export default MyParcelList;
