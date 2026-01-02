import { Link } from "react-router";
import { FiLock } from "react-icons/fi";

const Forbidden = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4 text-red-500 text-5xl">
                    <FiLock />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    403 – Forbidden
                </h1>

                <p className="text-gray-600 mb-6">
                    You don’t have permission to access this page.
                </p>

                <div className="flex justify-center gap-3">
                    <Link to="/">
                        <button className="btn btn-primary">
                            Go Home
                        </button>
                    </Link>

                    <Link to="/login">
                        <button className="btn btn-outline">
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;
