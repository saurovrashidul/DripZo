import React from 'react';
import { NavLink, Outlet } from 'react-router';
import Logo from '../../components/Logo/logo';

const Dashboard = () => {
    return (
        <div className="drawer lg:drawer-open ">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
                {/* Page content here */}
                <Outlet></Outlet>
                <label htmlFor="my-drawer-3" className="btn drawer-button lg:hidden">
                    Click here to see Dashboard
                </label>

            </div>
            <div className="drawer-side ">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <Logo />
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/dashboard/myparcel">My Parcel</NavLink></li>
                    <li><NavLink to="/dashboard/payment-history">Payment History</NavLink></li>
                </ul>

            </div>

        </div>

    );
};

export default Dashboard;