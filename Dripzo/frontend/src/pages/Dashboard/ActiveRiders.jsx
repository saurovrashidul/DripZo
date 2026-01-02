import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ActiveRiders = () => {
   
    const axiosSecure = useAxiosSecure();
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // prevent state update if component unmounted
        const fetchRiders = async () => {
            try {
                const res = await axiosSecure.get("/riders/approved");
                if (isMounted) setRiders(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchRiders();

        return () => {
            isMounted = false;
        };
    }, [axiosSecure]);





    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }


    return (
        <div>
            <h2 className="text-xl text-center font-semibold mb-4">
                Active Riders ({riders.length})
            </h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riders.map(rider => (
                            <tr key={rider._id}>
                                <td>{rider.name}</td>
                                <td>{rider.email}</td>
                                <td className="text-green-600 capitalize">
                                    {rider.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveRiders;
