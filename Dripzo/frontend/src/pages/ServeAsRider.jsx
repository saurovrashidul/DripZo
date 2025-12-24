import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
// import { useState } from "react";

const ServeAsRider = () => {
    const warehouses = useLoaderData(); // from route loader
    // const [selectedDistrict, setSelectedDistrict] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const districtValue = watch("district");

    const serviceCenters =
        warehouses?.find((item) => item.district === districtValue)
            ?.covered_area || [];

    const onSubmit = (data) => {
        console.log("Rider Application Data:", data);
        // send data to backend
        reset();
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Serve as a Rider
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Name */}
                <input
                    type="text"
                    placeholder="Full Name"
                    className="input input-bordered w-full"
                    {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email Address"
                    className="input input-bordered w-full"
                    {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}

                {/* Phone */}
                <input
                    type="text"
                    placeholder="Phone Number"
                    className="input input-bordered w-full"
                    {...register("phone", { required: "Phone number is required" })}
                />

                {/* NID */}
                <input
                    type="text"
                    placeholder="NID Number"
                    className="input input-bordered w-full"
                    {...register("nid", { required: "NID is required" })}
                />

                {/* District */}
                <select
                    className="select select-bordered w-full"
                    {...register("district", { required: "District is required" })}
                >
                    <option value="">Select District</option>
                    {warehouses?.map((item) => (
                        <option key={item.district} value={item.district}>
                            {item.district}
                        </option>
                    ))}
                </select>

                {/* Service Center */}
                <select
                    className="select select-bordered w-full"
                    disabled={!districtValue}
                    {...register("serviceCenter", {
                        required: "Service center is required",
                    })}
                >
                    <option value="">Select Service Center</option>
                    {serviceCenters.map((center) => (
                        <option key={center} value={center}>
                            {center}
                        </option>
                    ))}
                </select>

                {/* Vehicle Type */}
                <select
                    className="select select-bordered w-full"
                    {...register("vehicleType", {
                        required: "Vehicle type is required",
                    })}
                >
                    <option value="">Select Vehicle Type</option>
                    <option value="bike">Bike (Low-weight documents)</option>
                    <option value="pickup">Pickup (Heavy documents)</option>
                    <option value="other">Other</option>
                </select>

                {/* Vehicle Number */}
                <input
                    type="text"
                    placeholder="Vehicle Number"
                    className="input input-bordered w-full"
                    {...register("vehicleNumber", {
                        required: "Vehicle number is required",
                    })}
                />

                {/* Registration Number */}
                <input
                    type="text"
                    placeholder="Vehicle Registration Number"
                    className="input input-bordered w-full"
                    {...register("registrationNumber", {
                        required: "Registration number is required",
                    })}
                />

                {/* Address */}
                <textarea
                    placeholder="Present Address"
                    className="textarea textarea-bordered w-full"
                    {...register("address", { required: "Address is required" })}
                ></textarea>

                {/* Agreement */}
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="checkbox"
                        {...register("agreement", {
                            required: "You must agree to continue",
                        })}
                    />
                    <span>I agree to the terms & conditions</span>
                </label>
                {errors.agreement && (
                    <p className="text-red-500 text-sm">
                        {errors.agreement.message}
                    </p>
                )}

                <button type="submit" className="btn btn-primary w-full">
                    Submit Rider Application
                </button>
            </form>
        </div>
    );
};

export default ServeAsRider;
