import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../contexts/useAuth";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load payment history</p>;

  return (



    // <div className="p-6">
    //   <h2 className="text-3xl font-bold mb-6 text-center text-primary">
    //     Payment History
    //   </h2>

    //   <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
    //     <table className="table w-full table-compact">
    //       <thead className="bg-primary text-white">
    //         <tr>
    //           <th className="text-center">#</th>
    //           <th className="text-left">Parcel ID</th>
    //           <th className="text-right">Amount</th>
    //           <th className="text-center">Status</th>
    //           <th className="text-left">Date</th>
    //         </tr>
    //       </thead>

    //       <tbody>
    //         {payments.map((payment, index) => (
    //           <tr key={payment._id} className="hover:bg-gray-50 transition-all">
    //             <td className="text-center font-medium">{index + 1}</td>
    //             <td className="text-left">{payment.parcelId}</td>
    //             <td className="text-right font-semibold text-green-600">
    //               ৳{payment.amount}
    //             </td>
    //             <td className="text-center">
    //               <span className="badge badge-success">success</span>

    //             </td>
    //             <td className="text-left">
    //               {new Date(payment.createdAt).toLocaleString()}
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>

    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-primary">
        Payment History
      </h2>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="table table-compact w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th className="text-center">#</th>
              <th className="text-left">Parcel ID</th>
              <th className="text-right">Amount</th>
              <th className="text-center">Status</th>
              <th className="text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id} className="hover:bg-gray-50 transition-all">
                <td className="text-center font-medium">{index + 1}</td>
                <td className="text-left">{payment.parcelId}</td>
                <td className="text-right font-semibold text-green-600">৳{payment.amount}</td>
                <td className="text-center">
                  <span className="badge badge-success">success</span>
                </td>
                <td>{new Date(payment.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}


      <div className="md:hidden space-y-4">
        {payments.map((payment, index) => (
          <div
            key={payment._id}
            className={`border-l-4 rounded-lg shadow-lg p-4 ${index % 2 === 0 ? "bg-blue-50 border-blue-500" : "bg-green-50 border-green-500"
              }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">#{index + 1}</span>
             
            </div>
            <p className="text-gray-800">
              <strong>Parcel ID:</strong> {payment.parcelId}
            </p>
            <p className="text-gray-800">
              <strong>Amount:</strong>{" "}
              <span className="text-green-600 font-semibold">৳{payment.amount}</span>
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}
            </p>
             <span className="badge badge-success mt-2">success</span>
          </div>
        ))}
      </div>


    </div>





  );
};

export default PaymentHistory;
