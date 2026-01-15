import { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const PaymentCancel = () => {
  const navigate = useNavigate();

 useEffect(() => {
    Swal.fire({
      icon: "error",
      title: "Payment cancelled",
      text: "Your payment is cancelled",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/dashboard/myparcel");
    });
  }, []);

  return null;
};

export default PaymentCancel;
