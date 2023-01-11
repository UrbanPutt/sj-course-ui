import { FaPoo, FaFire } from 'react-icons/fa';
import { BsPlus, BsFillLightningFill ,BsGearFill } from 'react-icons/bs';
import {GiSharkJaws} from 'react-icons/gi'
import React from 'react'

const NavBar = () => {
    return (
        <header className="sticky top-0 z-50 w-screen h-16 mb-8 flex  bg-gray-900 text-white shadow-lg align-middle">
            <NavBarIcon className="basis-1 w-1" icon={<GiSharkJaws size="28"/>} />
            <div className="basis-2 flex-row inline-block">
                <li><a href="Course">Course</a></li>
                <li><a href="Holes">Holes</a></li>
                <li><a href="Settings">Settings</a></li>
            </div>

        </header>
    );
};

const NavBarIcon = ({icon}) => (
    <div className="navbar-icon">
        {icon}
    </div>
);

export default NavBar