import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../contexts/useAuth";
import Swal from "sweetalert2";


const MyParcelList = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();


    // ---delete data from parcel list--

const deleteParcelMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/parcels/${id}`);
      return res.data;
    },
    onSuccess: () => {
      // Refetch parcels after deletion
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


    // ---get data from database--
    const {
        data: parcels = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["my-parcels", user?.email],
        enabled: !!user?.email, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        },
    });

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (isError) return <p className="p-6">Failed to load parcels</p>;





    return (
        <div className="p-6 w-full">

            <h2 className="text-2xl font-bold mb-4">My Parcels</h2>

            {parcels.length === 0 && <p>No parcels found</p>}

            <div className="overflow-x-auto">
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
                            <tr key={parcel._id}>
                                <td>{index + 1}</td>
                                <td>{parcel.type}</td>
                                <td>৳{parcel.totalCost}</td>

                                {/* Payment Status */}
                                <td>
                                    {parcel.paymentStatus === "paid" ? (
                                        <span className="badge badge-success">Paid</span>
                                    ) : (
                                        <span className="badge badge-warning">Unpaid</span>
                                    )}
                                </td>

                                {/* Delivery Status */}
                                <td>
                                    <span className="badge badge-info">
                                        {parcel.status || "Pending"}
                                    </span>
                                </td>

                                <td>{parcel.submissionDateTime}</td>

                                {/* Action Buttons */}
                                <td className="space-x-1">
                                    {/* View */}
                                    <button className="btn btn-xs btn-info">
                                        View
                                    </button>

                                    {/* Pay */}
                                    {parcel.paymentStatus !== "paid" && (
                                        <button className="btn btn-xs btn-success">
                                            Pay
                                        </button>
                                    )}

                                    {/* Delete */}
                                    <button
                                        className="btn btn-xs btn-error"
                                        onClick={() => handleDelete(parcel._id)}
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default MyParcelList;
