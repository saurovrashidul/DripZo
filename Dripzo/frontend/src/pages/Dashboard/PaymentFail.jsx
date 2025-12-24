import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const PaymentFail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: "error",
      title: "Payment Failed",
      text: "Your payment was not successful. Please try again.",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/dashboard/myparcel");
    });
  }, []);

  return null;
};

export default PaymentFail;
