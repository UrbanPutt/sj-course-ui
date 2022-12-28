import { FaPoo, FaFire } from 'react-icons/fa';
import { BsPlus, BsFillLightningFill ,BsGearFill } from 'react-icons/bs';
import {GiSharkJaws} from 'react-icons/gi'
import React from 'react'

const NavBar = () => {
    return (
        <div className="fixed top-0 left-0 w-screen h-16 m-0 flex flex-row bg-gray-900 text-white shadow-lg">
            <NavBarIcon icon={<FaFire size="28"/>} />
            <NavBarIcon icon={<BsPlus size="32"/>} />
            <NavBarIcon icon={<BsFillLightningFill size="20"/>} />
            <NavBarIcon icon={<FaPoo size="20"/>} />
            <NavBarIcon icon={<BsGearFill size="28"/>} />
            <NavBarIcon icon={<GiSharkJaws size="28"/>} />
        </div>
    );
};

const NavBarIcon = ({icon}) => (
    <div className="navbar-icon">
        {icon}
    </div>
);

export default NavBar