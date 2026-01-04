import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { FiHome, FiPackage, FiCreditCard, FiUsers, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import useAdmin from '../../hooks/useAdmin';
import useRider from '../../hooks/useRider';

const Dashboard = () => {

    const [isAdmin] = useAdmin()
    const [isRider] = useRider()

    return (
        <div className="drawer  lg:drawer-open ">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
                {/* Page content here */}
                <Outlet></Outlet>
                <label htmlFor="my-drawer-3" className="btn drawer-button lg:hidden">
                    Click here to see Dashboard
                </label>

            </div>
            <div className="drawer-side bg-gray-700">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu min-h-full w-70 p-3">
                    <li className='text-white  gap-2'>
                        <NavLink to="/">
                            <FiHome /> Home
                        </NavLink>
                    </li>
                    <li className='text-white  gap-2'>
                        <NavLink to="/dashboard/myparcel">
                            <FiPackage /> My Parcel
                        </NavLink>
                    </li>
                    <li className='text-white  gap-2'>
                        <NavLink to="/dashboard/payment-history">
                            <FiCreditCard /> Payment History
                        </NavLink>
                    </li>
                    {isRider && (
                        <>
                            <li className='text-white  gap-2'>

                                <NavLink to="/dashboard/pending-deliveries">
                                    <FiUserPlus /> Pending Deliveries

                                </NavLink>
                            </li>
                        </>
                    )

                    }


                    {
                        isAdmin && (<>


                            <li className='text-white  gap-2'>
                                <NavLink to="/dashboard/pending-riders">
                                    <FiUsers /> Pending Riders
                                </NavLink>
                            </li>
                            <li className='text-white  gap-2'>
                                <NavLink to="/dashboard/active-riders">
                                    <FiUserCheck /> Active Riders
                                </NavLink>
                            </li>
                            <li className='text-white  gap-2'>
                                <NavLink to="/dashboard/assign-admin">
                                    <FiUserPlus /> Assign Admin Role

                                </NavLink>
                            </li>
                            <li className='text-white  gap-2'>
                                <NavLink to="/dashboard/assign-rider">
                                    <FiUserPlus /> Assign Rider

                                </NavLink>
                            </li>

                        </>)
                    }

                </ul>


            </div>

        </div>

    );
};

export default Dashboard;