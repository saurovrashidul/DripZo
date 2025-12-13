import React from "react";
import { useForm } from "react-hook-form";

const SendParcel = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data); // For now, just log the data
  };

  return (
    <div className="max-w-3xl  mx-auto p-2 border rounded shadow">
      <h1 className="text-2xl font-bold mb-2">Parcel Delivery Form</h1>
      <p className="mb-4 text-gray-600">Fill in the details for pickup and delivery</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parcel Info */}
        <div>
          <h2 className="font-semibold mb-2">Parcel Info</h2>
          <div className="space-y-2">
            <select {...register("type")} className="border p-2 w-full">
              <option value="">Select Type</option>
              <option value="document">Document</option>
              <option value="non-document">Non-document</option>
            </select>

            <input type="text" {...register("title")} placeholder="Title" className="border p-2 w-full" />
            <input type="number" {...register("weight")} placeholder="Weight (kg)" className="border p-2 w-full" />
          </div>
        </div>

        {/* Sender Info */}
        <div>
          <h2 className="font-semibold mb-2">Sender Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" {...register("senderName")} placeholder="Name" className="border p-2 w-full" />
            <input type="text" {...register("senderContact")} placeholder="Contact" className="border p-2 w-full" />
            <select {...register("senderRegion")} className="border p-2 w-full">
              <option value="">Select Region</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
            </select>
            <select {...register("senderServiceCenter")} className="border p-2 w-full">
              <option value="">Select Service Center</option>
              <option value="Center1">Center1</option>
              <option value="Center2">Center2</option>
            </select>
            <input type="text" {...register("senderAddress")} placeholder="Address" className="border p-2 w-full col-span-2" />
            <input type="text" {...register("pickupInstruction")} placeholder="Pickup Instruction" className="border p-2 w-full col-span-2" />
          </div>
        </div>

        {/* Receiver Info */}
        <div>
          <h2 className="font-semibold mb-2">Receiver Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" {...register("receiverName")} placeholder="Name" className="border p-2 w-full" />
            <input type="text" {...register("receiverContact")} placeholder="Contact" className="border p-2 w-full" />
            <select {...register("receiverRegion")} className="border p-2 w-full">
              <option value="">Select Region</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
            </select>
            <select {...register("receiverServiceCenter")} className="border p-2 w-full">
              <option value="">Select Service Center</option>
              <option value="Center1">Center1</option>
              <option value="Center2">Center2</option>
            </select>
            <input type="text" {...register("receiverAddress")} placeholder="Address" className="border p-2 w-full col-span-2" />
            <input type="text" {...register("deliveryInstruction")} placeholder="Delivery Instruction" className="border p-2 w-full col-span-2" />
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SendParcel;
