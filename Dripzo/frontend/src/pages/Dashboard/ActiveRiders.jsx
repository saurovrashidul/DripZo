import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ActiveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [riders, setRiders] = useState([]);

    useEffect(() => {
        axiosSecure.get("/riders/approved")
            .then(res => {
                setRiders(res.data);
            });
    }, [axiosSecure]);

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
