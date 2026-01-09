import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../contexts/useAuth"

const Payment = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: parcel, isLoading, error } = useQuery({
        queryKey: ["parcel", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return <p className="text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Failed to load parcel</p>;
    }



    // 2️⃣ Handle payment (POST to backend)
    const handlePayment = async () => {
        try {
            const paymentData = {
                parcelId: parcel._id,
                amount: parcel.totalCost,
                customerEmail: user.email,
                customerName: user.displayName || parcel.userName || "",

            };

            // Post to backend to create SSLCommerz session
            const res = await axiosSecure.post("/create-payment", paymentData);
            console.log(res, "payemnt post from server side")
            // Redirect user to SSLCommerz payment URL
            window.location.href = res.data?.gateWayPageUrl;
        } catch (err) {
            console.error("Payment initiation failed:", err);
        }
    };





    return (
        // <div className="p-6">
        //     <h2 className="text-2xl font-bold mb-4">Payment</h2>

        //     <div className="border p-4 rounded">
        //         <p><strong>Tracking Id:</strong> ৳{parcel.trackingID}</p>
        //         <p><strong>Email:</strong> {parcel?.userEmail}</p>
        //         <p><strong>Amount:</strong> ৳{parcel?.totalCost}</p>


        //     </div>


        //     <button
        //         onClick={handlePayment}
        //         className="btn btn-success mt-4"
        //     // disabled={parcel?.paymentStatus === "paid"}
        //     >
        //         Click For Payment
        //     </button>

        // </div>

        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-2xl">

                {/* Header */}
                <div className="bg-primary text-primary-content p-6 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-center">
                        Payment Summary
                    </h2>
                    <p className="text-center text-sm opacity-90 mt-1">
                        Review your parcel payment
                    </p>
                </div>

                {/* Body */}
                <div className="card-body space-y-4">

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Tracking ID</span>
                        <span className="font-semibold">{parcel?.trackingID}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium">{parcel?.userEmail}</span>
                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Total Amount</span>
                        <span className="text-3xl font-bold text-success">
                            ৳ {parcel?.totalCost}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Payment Method</span>
                        <span className="badge badge-outline badge-info">
                            SSLCommerz
                        </span>
                    </div>


                    <div className="divider"></div>

                    {/* Action */}

                    <button
                        onClick={handlePayment}
                        className="btn btn-success mt-4"
                    // disabled={parcel?.paymentStatus === "paid"}
                    >
                        Click For Payment
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        Secured & encrypted payment
                    </p>
                </div>
            </div>
        </div>



    );
};

export default Payment;
