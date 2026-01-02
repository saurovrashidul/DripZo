import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your payment has been completed successfully.",
            timer: 2000,
            showConfirmButton: false,
        });

        setTimeout(() => {
            navigate("/dashboard/myparcel");
        }, 2000);
    }, [navigate]);

    return null;
};

export default PaymentSuccess;

