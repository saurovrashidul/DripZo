import React from 'react';
import { NavLink } from 'react-router';
import useAuth from '../contexts/useAuth';
import Home from '../pages/Home/Home';
import Logo from './Logo/logo';



const Navbar = () => {

    const { user, logout, loading } = useAuth()
    console.log(user)
    return (

        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="servicelocations">Service Locations</NavLink></li>
                        <li><NavLink to="sendparcel">Send Parcel</NavLink></li>
                        {
                            user && <>
                                <li><NavLink to="dashboard">Dashboard</NavLink></li>
                                <li><NavLink to="serve-as-rider">Serve As Rider</NavLink></li>
                            </>
                        }

                    </ul>
                </div>
                <Logo></Logo>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="servicelocations">Service Locations</NavLink></li>
                    <li><NavLink to="sendparcel">Send Parcel</NavLink></li>
                    {
                        user && <>
                            <li><NavLink to="dashboard">Dashboard</NavLink></li>
                            <li><NavLink to="serve-as-rider">Serve As Rider</NavLink></li>
                        </>
                    }

                </ul>
            </div>
            <div className="navbar-end">


                {loading ? loading : user ? (
                    <button
                        onClick={logout}
                        className="px-4 py-2 border border-black bg-black text-white
             hover:bg-white hover:text-black
             transition duration-200"
                    >
                        <p className='text-[15px]'>Logout</p>
                    </button>

                ) : (
                    <>
                        <NavLink to="/login">
                            <button className="mr-2 px-4 py-2 border border-black bg-black text-white
             hover:bg-white hover:text-black
             transition duration-200">
                                Login
                            </button>
                        </NavLink>
                        <NavLink to="/register">
                            <button className="px-4 py-2 border border-black bg-black text-white
             hover:bg-white hover:text-black
             transition duration-200">
                                Register
                            </button>
                        </NavLink>
                    </>
                )}

            </div>
        </div>

    );
};

export default Navbar;