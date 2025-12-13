import React from "react";
import image from"../../assets/images/banner/banner1.png"
const Banner = () => {
    return (
        <section className="w-full bg-base-100">
            <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-4 py-12 md:py-24 gap-8">

                {/* Left: Headline / Text */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold  mb-4">
                       Dripzo - Fast & Reliable Rides & Parcel Delivery
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6">
                        Book rides instantly, track your parcels, and experience a seamless delivery service.
                    </p>
                  
                </div>

                {/* Right: Image */}
                <div className="flex-1">
                    <img
                        src={image}
                        alt="image"
                        className="w-full h-full rounded-lg "
                    />
                </div>
            </div>
        </section>
    );
};

export default Banner;
