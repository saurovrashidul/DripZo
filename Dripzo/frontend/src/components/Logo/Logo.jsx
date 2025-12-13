import React from 'react';
import { NavLink } from "react-router";
import image from "../../assets/images/logo/logo.png";

const Logo = () => {
    return (
        <NavLink to="/" className="inline-block">
            <img 
                src={image} 
                alt="DripZo Logo" 
                className="w-20 h-10 md:w-24 lg:w-28 object-contain"
            />
        </NavLink>
    );
};

export default Logo;
