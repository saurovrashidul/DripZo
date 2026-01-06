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
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Payment</h2>

            <div className="border p-4 rounded">
                <p><strong>Email:</strong> {parcel?.userEmail}</p>
                <p><strong>Amount:</strong> ৳{parcel?.totalCost}</p>

            </div>


            <button
                onClick={handlePayment}
                className="btn btn-success mt-4"
            // disabled={parcel?.paymentStatus === "paid"}
            >
                Click For Payment
            </button>

        </div>
    );
};

export default Payment;
