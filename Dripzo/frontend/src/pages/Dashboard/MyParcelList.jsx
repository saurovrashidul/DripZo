import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../contexts/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";


const MyParcelList = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();



    // ---delete data from parcel list--

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


        <div className="p-3 md:p-6 w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">My Parcels</h2>

            {parcels.length === 0 && <p>No parcels found</p>}

            {/* ✅ Mobile View (Cards) */}
            <div className="grid gap-4 md:hidden">
                {parcels.map((parcel) => (
                    <div
                        key={parcel._id}
                        className="card bg-base-100 shadow-md border"
                    >
                        <div className="card-body p-4 space-y-2">
                            <p><strong>Type:</strong> {parcel.type}</p>
                            <p><strong>Cost:</strong> ৳{parcel.totalCost}</p>

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
                                <span className="badge badge-info">
                                    {parcel.status || "Pending"}
                                </span>
                            </p>

                            <p className="text-sm text-gray-500">
                                {parcel.submissionDateTime}
                            </p>

                            <div className="flex gap-2 flex-wrap">
                                <button className="btn btn-xs btn-info">View</button>

                                {parcel.paymentStatus !== "paid" && (
                                    <button
                                        className="btn btn-xs btn-success"
                                        onClick={() => navigate(`/dashboard/payment/${parcel._id}`)}
                                    >
                                        Pay
                                    </button>

                                )}

                                <button
                                    className="btn btn-xs btn-error"
                                    onClick={() => handleDelete(parcel._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Desktop / Tablet View (Table) */}
            <div className="overflow-x-auto hidden md:block">
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

                                <td>
                                    {parcel.paymentStatus === "paid" ? (
                                        <span className="badge badge-success">Paid</span>
                                    ) : (
                                        <span className="badge badge-warning">Unpaid</span>
                                    )}
                                </td>

                                <td>
                                    <span className="badge badge-info">
                                        {parcel.status || "Pending"}
                                    </span>
                                </td>

                                <td>{parcel.submissionDateTime}</td>

                                <td className="space-x-1">
                                    <button className="btn btn-xs btn-info">View</button>

                                    {/* {parcel.paymentStatus !== "paid" && (
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() => navigate(`/dashboard/payment/${parcel._id}`)}
                                        >
                                            Pay
                                        </button>

                                    )} */}

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
                                        {parcel.paymentStatus === "paid" ? "Paid" : "Pay"}
                                    </button>


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
