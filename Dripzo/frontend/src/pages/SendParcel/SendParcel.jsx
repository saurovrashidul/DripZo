import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../contexts/useAuth"
const SendParcel = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const warehouseData = useLoaderData();
  const axiosSecure = useAxiosSecure()
  const { user } = useAuth()

  const [districts, setDistricts] = useState([]);
  const [senderDistrict, setSenderDistrict] = useState(null);
  const [receiverDistrict, setReceiverDistrict] = useState(null);

  useEffect(() => {
    const uniqueDistricts = [...new Set(warehouseData.map(item => item.district))];
    setDistricts(uniqueDistricts);
  }, [warehouseData]);

  const handleSenderDistrictChange = (e) => {
    const districtName = e.target.value;
    const districtData = warehouseData.find(item => item.district === districtName);
    setSenderDistrict(districtData || null);
    setValue("senderServiceCenter", "");
  };

  const handleReceiverDistrictChange = (e) => {
    const districtName = e.target.value;
    const districtData = warehouseData.find(item => item.district === districtName);
    setReceiverDistrict(districtData || null);
    setValue("receiverServiceCenter", "");
  };

  const onSubmit = (data) => {
    console.log(data)
    const trackingID = "TRK-" + Date.now();
    const submissionDateTime = new Date().toLocaleString();

    const { type, weight, senderRegion, receiverRegion } = data;
    const parcelWeight = Number(weight);
    const withinCity = senderRegion === receiverRegion;

    let baseCost = 0;
    let extraCost = 0;

    if (type === "document") {
      baseCost = withinCity ? 60 : 80;
    } else {
      baseCost = withinCity ? 110 : 150;
      if (parcelWeight > 3) {
        extraCost += (parcelWeight - 3) * 40;
        if (!withinCity) extraCost += 40;
      }
    }

    const totalCost = baseCost + extraCost;

    const extraReason = [];
    if (type === "non-document" && parcelWeight > 3) {
      extraReason.push(`৳40 × ${parcelWeight - 3}kg (over 3kg)`);
    }
    if (!withinCity && type === "non-document") {
      extraReason.push("৳40 for outside city");
    }
    const userEmail = user?.email;

    Swal.fire({
      title: "Parcel Cost Breakdown",
      html: `
    <table style="width:100%; text-align:left; border-collapse:collapse;">
      <tr><th>Parcel Type</th><td>${type}</td></tr>
      <tr><th>Weight</th><td>${weight} kg</td></tr>
      <tr><th>From</th><td>${senderRegion}</td></tr>
      <tr><th>To</th><td>${receiverRegion}</td></tr>
      <tr><th>Within City</th><td>${withinCity ? "Yes" : "No"}</td></tr>
      <tr><th>Base Cost</th><td>৳${baseCost}</td></tr>
      <tr><th>Extra Charges</th><td>৳${extraCost}</td></tr>
      <tr><th>Reason</th><td>${extraReason.length ? extraReason.join(", ") : "-"}</td></tr>
      <tr><th>Total Cost</th><td><b>৳${totalCost}</b></td></tr>
    </table>
  `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm & Proceed",
      cancelButtonText: "Go Back"
    }).then(async (result) => {  // <-- added async here
      if (result.isConfirmed) {
        console.log("Parcel Submitted:", {
          trackingID,
          submissionDateTime,
          userEmail: userEmail,
          ...data
        });

        // ✅ Axios POST to backend
        try {
          const response = await axiosSecure.post("/parcels", {
            trackingID,
            submissionDateTime,
            ...data,
            userEmail: userEmail,
            totalCost
          });
          console.log("Backend Response:", response.data);
        } catch (error) {
          console.error("Error submitting parcel:", error);
          Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: "Something went wrong. Please try again."
          });
          return; // stop the next Swal
        }

        Swal.fire({
          icon: "success",
          title: "Parcel Submitted Successfully",
          html: `
        <p><strong>Tracking ID:</strong> ${trackingID}</p>
        <p><strong>Submitted At:</strong> ${submissionDateTime}</p>
      `
        });
        reset();
      }
    });

  };

  const errorText = "text-red-500 text-sm";

  return (

    // <div className="max-w-3xl mx-auto p-4 border rounded shadow mt-3 mb-3">
    //   <h1 className="text-2xl font-bold mb-2">Parcel Delivery Form</h1>

    //   <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

    //     {/* Parcel Info */}
    //     <div>
    //       <h2 className="font-semibold mb-2">Parcel Info</h2>

    //       <select {...register("type", { required: "Parcel type required" })} className="border p-2 w-full">
    //         <option value="">Select Type</option>
    //         <option value="document">Document</option>
    //         <option value="non-document">Non-document</option>
    //       </select>
    //       {errors.type && <p className={errorText}>{errors.type.message}</p>}

    //       <input {...register("title", { required: "Title required" })} className="border p-2 w-full mt-2" placeholder="Describe Your Parcel" />
    //       {errors.title && <p className={errorText}>{errors.title.message}</p>}

    //       <input type="number" {...register("weight", { required: "Weight required" })} className="border p-2 w-full mt-2" placeholder="Weight (kg)" />
    //       {errors.weight && <p className={errorText}>{errors.weight.message}</p>}
    //     </div>

    //     {/* Sender Info */}
    //     <div>
    //       <h2 className="font-semibold mb-2">Sender Info</h2>

    //       <input {...register("senderName", { required: "Name required" })} className="border p-2 w-full" placeholder="Name" />
    //       {errors.senderName && <p className={errorText}>{errors.senderName.message}</p>}

    //       <input
    //         type="tel"
    //         autoComplete="tel"
    //         inputMode="numeric"
    //         {...register("senderContact", { required: "Contact required" })} className="border p-2 w-full mt-2" placeholder="Contact" />
    //       {errors.senderContact && <p className={errorText}>{errors.senderContact.message}</p>}

    //       <select {...register("senderRegion", { required: "District required" })} onChange={handleSenderDistrictChange} className="border p-2 w-full mt-2">
    //         <option value="">Select District</option>
    //         {districts.map((d, i) => <option key={i}>{d}</option>)}
    //       </select>
    //       {errors.senderRegion && <p className={errorText}>{errors.senderRegion.message}</p>}

    //       <select {...register("senderServiceCenter", { required: "Service center required" })} className="border p-2 w-full mt-2">
    //         <option value="">Select Service Center</option>
    //         {senderDistrict?.covered_area.map((a, i) => <option key={i}>{a}</option>)}
    //       </select>
    //       {errors.senderServiceCenter && <p className={errorText}>{errors.senderServiceCenter.message}</p>}

    //       <textarea
    //         {...register("pickupInstruction", { required: "Pickup instruction required" })}
    //         placeholder="Pickup Instruction"
    //         className="border p-2 w-full mt-2"
    //         rows={3}
    //       />
    //       {errors.pickupInstruction && <p className={errorText}>{errors.pickupInstruction.message}</p>}
    //     </div>

    //     {/* Receiver Info */}
    //     <div>
    //       <h2 className="font-semibold mb-2">Receiver Info</h2>

    //       <input
    //         type="text"
    //         autoComplete="name"
    //         {...register("receiverName", { required: "Name required" })}
    //         className="border p-2 w-full"
    //         placeholder="Receiver Name"
    //       />
    //       {errors.receiverName && <p className={errorText}>{errors.receiverName.message}</p>}

    //       <input
    //         type="tel"
    //         autoComplete="tel"
    //         inputMode="numeric"
    //         {...register("receiverContact", { required: "Contact required" })}
    //         className="border p-2 w-full mt-2"
    //         placeholder="Receiver Contact Number"
    //       />
    //       {errors.receiverContact && <p className={errorText}>{errors.receiverContact.message}</p>}


    //       <select {...register("receiverRegion", { required: "District required" })} onChange={handleReceiverDistrictChange} className="border p-2 w-full mt-2">
    //         <option value="">Select District</option>
    //         {districts.map((d, i) => <option key={i}>{d}</option>)}
    //       </select>
    //       {errors.receiverRegion && <p className={errorText}>{errors.receiverRegion.message}</p>}

    //       <select {...register("receiverServiceCenter", { required: "Service center required" })} className="border p-2 w-full mt-2">
    //         <option value="">Select Service Center</option>
    //         {receiverDistrict?.covered_area.map((a, i) => <option key={i}>{a}</option>)}
    //       </select>
    //       {errors.receiverServiceCenter && <p className={errorText}>{errors.receiverServiceCenter.message}</p>}

    //       <textarea
    //         {...register("deliveryInstruction", { required: "Delivery instruction required" })}
    //         placeholder="Delivery Instruction"
    //         className="border p-2 w-full mt-2"
    //         rows={3}
    //       />
    //       {errors.deliveryInstruction && <p className={errorText}>{errors.deliveryInstruction.message}</p>}
    //     </div>

    //     <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
    //       Submit
    //     </button>

    //   </form>
    // </div>


    <div className="max-w-4xl mx-auto p-4 md:p-6 border rounded-2xl shadow-lg mt-6 mb-6 bg-gradient-to-b from-white to-blue-50">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center text-primary">
        Parcel Delivery Form
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ---------- Parcel Info ---------- */}
        <div className="bg-white p-4 rounded-lg shadow-inner border-l-4 border-blue-400">
          <h2 className="font-semibold text-lg mb-2 text-blue-700">Parcel Info</h2>

          <select
            {...register("type", { required: "Parcel type required" })}
            className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          >
            <option value="">Select Type</option>
            <option value="document">Document</option>
            <option value="non-document">Non-document</option>
          </select>
          {errors.type && <p className={errorText}>{errors.type.message}</p>}

          <input
            {...register("title", { required: "Title required" })}
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            placeholder="Describe Your Parcel"
          />
          {errors.title && <p className={errorText}>{errors.title.message}</p>}

          <input
            type="number"
            {...register("weight", { required: "Weight required" })}
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            placeholder="Weight (kg)"
          />
          {errors.weight && <p className={errorText}>{errors.weight.message}</p>}
        </div>

        {/* ---------- Sender Info ---------- */}
        <div className="bg-white p-4 rounded-lg shadow-inner border-l-4 border-green-400">
          <h2 className="font-semibold text-lg mb-2 text-green-700">Sender Info</h2>

          <input
            {...register("senderName", { required: "Name required" })}
            className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="Name"
          />
          {errors.senderName && <p className={errorText}>{errors.senderName.message}</p>}

          <input
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            {...register("senderContact", { required: "Contact required" })}
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="Contact"
          />
          {errors.senderContact && <p className={errorText}>{errors.senderContact.message}</p>}

          <select
            {...register("senderRegion", { required: "District required" })}
            onChange={handleSenderDistrictChange}
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-green-200 focus:border-green-400"
          >
            <option value="">Select District</option>
            {districts.map((d, i) => (
              <option key={i}>{d}</option>
            ))}
          </select>
          {errors.senderRegion && <p className={errorText}>{errors.senderRegion.message}</p>}

          <select
            {...register("senderServiceCenter", { required: "Service center required" })}
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-green-200 focus:border-green-400"
          >
            <option value="">Select Service Center</option>
            {senderDistrict?.covered_area.map((a, i) => <option key={i}>{a}</option>)}
          </select>
          {errors.senderServiceCenter && <p className={errorText}>{errors.senderServiceCenter.message}</p>}

          <textarea
            {...register("pickupInstruction", { required: "Pickup instruction required" })}
            placeholder="Pickup Instruction"
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-green-200 focus:border-green-400"
            rows={3}
          />
          {errors.pickupInstruction && <p className={errorText}>{errors.pickupInstruction.message}</p>}
        </div>

        {/* ---------- Receiver Info ---------- */}
        <div className="bg-white p-4 rounded-lg shadow-inner border-l-4 border-purple-400">
          <h2 className="font-semibold text-lg mb-2 text-purple-700">Receiver Info</h2>

          <input
            type="text"
            autoComplete="name"
            {...register("receiverName", { required: "Name required" })}
            className="border rounded-md p-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
            placeholder="Receiver Name"
          />
          {errors.receiverName && <p className={errorText}>{errors.receiverName.message}</p>}

          <input
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            {...register("receiverContact", { required: "Contact required" })}
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
            placeholder="Receiver Contact Number"
          />
          {errors.receiverContact && <p className={errorText}>{errors.receiverContact.message}</p>}

          <select
            {...register("receiverRegion", { required: "District required" })}
            onChange={handleReceiverDistrictChange}
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
          >
            <option value="">Select District</option>
            {districts.map((d, i) => (
              <option key={i}>{d}</option>
            ))}
          </select>
          {errors.receiverRegion && <p className={errorText}>{errors.receiverRegion.message}</p>}

          <select
            {...register("receiverServiceCenter", { required: "Service center required" })}
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
          >
            <option value="">Select Service Center</option>
            {receiverDistrict?.covered_area.map((a, i) => <option key={i}>{a}</option>)}
          </select>
          {errors.receiverServiceCenter && <p className={errorText}>{errors.receiverServiceCenter.message}</p>}

          <textarea
            {...register("deliveryInstruction", { required: "Delivery instruction required" })}
            placeholder="Delivery Instruction"
            className="border rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
            rows={3}
          />
          {errors.deliveryInstruction && <p className={errorText}>{errors.deliveryInstruction.message}</p>}
        </div>

        {/* ---------- Submit Button ---------- */}
        <button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-full w-full shadow-lg transition-all duration-200">
          Submit
        </button>
      </form>
    </div>





  );
};

export default SendParcel;
