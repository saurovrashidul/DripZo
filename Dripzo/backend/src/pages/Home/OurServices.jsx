import React from 'react';

const OurServices = () => {


    const services = [
        {
            title: "Fast Delivery",
            description: "We ensure your parcels reach their destination quickly and safely.",
            icon: "🚀",
        },
        {
            title: "Secure Handling",
            description: "All packages are handled with care to ensure complete safety.",
            icon: "🔒",
        },
        {
            title: "24/7 Support",
            description: "Our team is available round the clock to help you anytime.",
            icon: "📞",
        },
        {
            title: "Multiple Payment Options",
            description: "Pay conveniently using card, mobile banking, or cash on delivery.",
            icon: "💳",
        },
        {
            title: "Eco-Friendly",
            description: "We are committed to using sustainable delivery methods.",
            icon: "🌱",
        },
        {
            title: "Real-Time Notifications",
            description: "Get updates about your orders instantly via email or app notifications.",
            icon: "📬",
        },
    ];




    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300 text-center"
                        >
                            <div className="text-4xl mb-4">{service.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default OurServices;