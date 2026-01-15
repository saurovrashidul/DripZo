import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import useAuth from "../contexts/useAuth";
import { useEffect} from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";


const ServeAsRider = () => {
    const { user } = useAuth();
    const warehouses = useLoaderData();
    const axiosSecure = useAxiosSecure()



    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.displayName || "",
            email: user?.email || "",
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.displayName || "",
                email: user.email || "",
            });
        }
    }, [user, reset]);


    ;



    const districtValue = watch("district");

    const serviceCenters =
        warehouses?.find((item) => item.district === districtValue)
            ?.covered_area || [];

    // const onSubmit = (data) => {
    //     console.log("Rider Application Data:", data);
    //     // send data to backend
    //     reset();
    // };

    const onSubmit = async (data) => {
        try {
            const response = await axiosSecure.post("/riders", data);

            if (response.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Application Submitted",
                    text: "Your rider application is under review",
                });
                reset();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: error?.response?.data?.message || "You cannot submit multiple applications",
            });
        }
    };



    return (
        // <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
        //     <h2 className="text-2xl font-bold mb-6 text-center">
        //         Serve as a Rider
        //     </h2>

        //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        //         {/* Name */}
        //         <input
        //             type="text"
        //             placeholder="Full Name"
        //             className="input input-bordered w-full"
        //             {...register("name", { required: "Name is required" })}
        //         />
        //         {errors.name && (
        //             <p className="text-red-500 text-sm">{errors.name.message}</p>
        //         )}

        //         {/* Email */}
        //         <input
        //             type="email"
        //             placeholder="Email Address"
        //             className="input input-bordered w-full"
        //             {...register("email", { required: "Email is required" })}
        //         />
        //         {errors.email && (
        //             <p className="text-red-500 text-sm">{errors.email.message}</p>
        //         )}

        //         {/* Phone */}
        //         <input
        //             type="text"
        //             placeholder="Phone Number"
        //             className="input input-bordered w-full"
        //             {...register("phone", { required: "Phone number is required" })}
        //         />

        //         {/* NID */}
        //         <input
        //             type="text"
        //             placeholder="NID Number"
        //             className="input input-bordered w-full"
        //             {...register("nid", { required: "NID is required" })}
        //         />

        //         {/* District */}
        //         <select
        //             className="select select-bordered w-full"
        //             {...register("district", { required: "District is required" })}
        //         >
        //             <option value="">Select District</option>
        //             {warehouses?.map((item) => (
        //                 <option key={item.district} value={item.district}>
        //                     {item.district}
        //                 </option>
        //             ))}
        //         </select>

        //         {/* Service Center */}
        //         <select
        //             className="select select-bordered w-full"
        //             disabled={!districtValue}
        //             {...register("serviceCenter", {
        //                 required: "Service center is required",
        //             })}
        //         >
        //             <option value="">Select Service Center</option>
        //             {serviceCenters.map((center) => (
        //                 <option key={center} value={center}>
        //                     {center}
        //                 </option>
        //             ))}
        //         </select>

        //         {/* Vehicle Type */}
        //         <select
        //             className="select select-bordered w-full"
        //             {...register("vehicleType", {
        //                 required: "Vehicle type is required",
        //             })}
        //         >
        //             <option value="">Select Vehicle Type</option>
        //             <option value="bike">Bike (Low-weight documents)</option>
        //             <option value="pickup">Pickup (Heavy documents)</option>
        //             <option value="other">Other</option>
        //         </select>

        //         {/* Vehicle Number */}
        //         <input
        //             type="text"
        //             placeholder="Vehicle Number"
        //             className="input input-bordered w-full"
        //             {...register("vehicleNumber", {
        //                 required: "Vehicle number is required",
        //             })}
        //         />

        //         {/* Registration Number */}
        //         <input
        //             type="text"
        //             placeholder="Vehicle Registration Number"
        //             className="input input-bordered w-full"
        //             {...register("registrationNumber", {
        //                 required: "Registration number is required",
        //             })}
        //         />

        //         {/* Address */}
        //         <textarea
        //             placeholder="Present Address"
        //             className="textarea textarea-bordered w-full"
        //             {...register("address", { required: "Address is required" })}
        //         ></textarea>

        //         {/* Agreement */}
        //         <label className="flex items-center gap-2">
        //             <input
        //                 type="checkbox"
        //                 className="checkbox"
        //                 {...register("agreement", {
        //                     required: "You must agree to continue",
        //                 })}
        //             />
        //             <span>I agree to the terms & conditions</span>
        //         </label>
        //         {errors.agreement && (
        //             <p className="text-red-500 text-sm">
        //                 {errors.agreement.message}
        //             </p>
        //         )}

        //         <button type="submit" className="btn btn-primary w-full">
        //             Submit Rider Application
        //         </button>




        //     </form>
        // </div>


<div className="max-w-3xl mx-auto p-6 md:p-8 bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl">
  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-700">
    Serve as a Rider
  </h2>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">

    {/* Name */}
    <input
      type="text"
      placeholder="Full Name"
      className="input input-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      {...register("name", { required: "Name is required" })}
    />
    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

    {/* Email */}
    <input
      type="email"
      placeholder="Email Address"
      className="input input-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      {...register("email", { required: "Email is required" })}
    />
    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

    {/* Phone */}
    <input
      type="text"
      placeholder="Phone Number"
      className="input input-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      {...register("phone", { required: "Phone number is required" })}
    />
    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

    {/* NID */}
    <input
      type="text"
      placeholder="NID Number"
      className="input input-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      {...register("nid", { required: "NID is required" })}
    />
    {errors.nid && <p className="text-red-500 text-sm">{errors.nid.message}</p>}

    {/* District */}
    <select
      className="select select-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      {...register("district", { required: "District is required" })}
    >
      <option value="">Select District</option>
      {warehouses?.map((item) => (
        <option key={item.district} value={item.district}>
          {item.district}
        </option>
      ))}
    </select>
    {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}

    {/* Service Center */}
    <select
      className="select select-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      disabled={!districtValue}
      {...register("serviceCenter", { required: "Service center is required" })}
    >
      <option value="">Select Service Center</option>
      {serviceCenters.map((center) => (
        <option key={center} value={center}>
          {center}
        </option>
      ))}
    </select>
    {errors.serviceCenter && <p className="text-red-500 text-sm">{errors.serviceCenter.message}</p>}

    {/* Vehicle Type */}
    <select
      className="select select-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      {...register("vehicleType", { required: "Vehicle type is required" })}
    >
      <option value="">Select Vehicle Type</option>
      <option value="bike">Bike (Low-weight documents)</option>
      <option value="pickup">Pickup (Heavy documents)</option>
      <option value="other">Other</option>
    </select>
    {errors.vehicleType && <p className="text-red-500 text-sm">{errors.vehicleType.message}</p>}

    {/* Vehicle Number */}
    <input
      type="text"
      placeholder="Vehicle Number"
      className="input input-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      {...register("vehicleNumber", { required: "Vehicle number is required" })}
    />
    {errors.vehicleNumber && <p className="text-red-500 text-sm">{errors.vehicleNumber.message}</p>}

    {/* Registration Number */}
    <input
      type="text"
      placeholder="Vehicle Registration Number"
      className="input input-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      {...register("registrationNumber", { required: "Registration number is required" })}
    />
    {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber.message}</p>}

    {/* Address */}
    <textarea
      placeholder="Present Address"
      className="textarea textarea-bordered w-full focus:ring-2 focus:ring-blue-400 transition-all"
      {...register("address", { required: "Address is required" })}
      rows={3}
    ></textarea>
    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}

    {/* Agreement */}
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        className="checkbox checkbox-primary"
        {...register("agreement", { required: "You must agree to continue" })}
      />
      <span>I agree to the terms & conditions</span>
    </label>
    {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement.message}</p>}

    {/* Submit Button */}
    <button
      type="submit"
      className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg"
    >
      Submit Rider Application
    </button>
  </form>
</div>



    );
};

export default ServeAsRider;
