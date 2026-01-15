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

  // Use /parcels/all instead of /parcels
  // const { data: parcels = [], isLoading, isError } = useQuery({
  //   queryKey: ["my-parcels-all", user?.email],
  //   enabled: !!user?.email,
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(`/parcels/all?email=${user.email}`);
  //     return res.data;
  //   },
  // });


  if (isLoading) return <p className="p-6 text-center">Loading...</p>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load parcels</p>;

  return (





    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary">
        My Parcels ({parcels.length})
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500">No parcels found</p>
      ) : (
        <>
          {/* ---------- Table for Tablet & PC ---------- */}
          <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="table table-zebra w-full table-compact">
              <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                <tr>
                  <th className="text-center">#</th>
                  <th>Type</th>
                  <th className="text-right">Cost</th>
                  <th>Payment Status</th>
                  <th className="text-center">Delivery Status</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {parcels.map((parcel, index) => (
                  <tr
                    key={parcel._id}
                    className="hover:bg-gray-100 transition-all duration-150"
                  >
                    <td className="text-center font-medium">{index + 1}</td>
                    <td>{parcel.type}</td>
                    <td className="text-right font-semibold text-green-600">
                      ৳{parcel.totalCost}
                    </td>
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
                        className="btn btn-xs btn-info flex items-center gap-1"
                        onClick={() => setSelectedParcel(parcel)}
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        className={`btn btn-xs flex items-center gap-1 ${parcel.paymentStatus === "paid"
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
                        {parcel.paymentStatus === "paid" ? (
                          "Paid"
                        ) : (
                          <FaMoneyBillWave className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className="btn btn-xs btn-error flex items-center gap-1"
                        onClick={() => handleDelete(parcel._id)}
                      >
                        <FaTrash className="w-4 h-4" />
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
                className={`border-l-4 rounded-lg shadow-lg p-4 space-y-2 ${index % 2 === 0
                    ? "bg-blue-50 border-blue-500"
                    : "bg-pink-50 border-pink-500"
                  }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">#{index + 1}</span>
                  <span className="badge badge-success">success</span>
                </div>

                <p>
                  <strong>Type:</strong> {parcel.type}
                </p>
                <p>
                  <strong>Cost:</strong>{" "}
                  <span className="text-green-600 font-semibold">
                    ৳{parcel.totalCost}
                  </span>
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
                    className="btn btn-xs btn-info flex-1 flex items-center justify-center"
                    onClick={() => setSelectedParcel(parcel)}
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    className={`btn btn-xs flex-1 flex items-center justify-center ${parcel.paymentStatus === "paid"
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
                    className="btn btn-xs btn-error flex-1 flex items-center justify-center"
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
          <div className="modal-box max-w-full md:max-w-xl w-full bg-gradient-to-b from-white to-gray-100 shadow-lg rounded-lg">
            <h3 className="font-bold text-lg md:text-xl mb-4 text-center text-primary">
              Parcel Details
            </h3>

            <div className="space-y-3 text-sm border rounded-lg p-4 bg-white shadow-inner">
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
                <strong>Total Cost:</strong>{" "}
                <span className="text-green-600 font-semibold">
                  ৳{selectedParcel.totalCost}
                </span>
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="badge badge-info">{selectedParcel.deliveryStatus}</span>
              </p>
              <p>
                <strong>Submitted On:</strong> {selectedParcel.submissionDateTime}
              </p>

              <hr className="my-2 border-gray-300" />

              <h4 className="font-semibold text-primary">Sender Details:</h4>
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

              <hr className="my-2 border-gray-300" />

              <h4 className="font-semibold text-primary">Receiver Details:</h4>
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

              <hr className="my-2 border-gray-300" />

              <p>
                <strong>User Email:</strong> {selectedParcel.userEmail}
              </p>
            </div>

            <div className="modal-action">
              <button
                className="btn w-full md:w-auto btn-primary"
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
