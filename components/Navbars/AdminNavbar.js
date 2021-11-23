import React from 'react';

import UserDropdown from 'components/Dropdowns/UserDropdown.js';
import { BreadCrumbs } from './BreadCrums';

export default function Navbar() {
    return (
        <>
            {/* Navbar */}
            <nav className="relative top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4 bg-blueGray-800">
                <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
                    {/* Brand */}

                    <BreadCrumbs className="hidden lg:inline-block" />

                    {/* User */}
                    <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
                        <UserDropdown />
                    </ul>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    );
}
