import React from 'react';

// components

import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import FooterAdmin from 'components/Footers/FooterAdmin.js';
import PropTypes from 'prop-types';

export default function Admin({ children }) {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-200 min-h-screen">
                <AdminNavbar />
                <div className="px-4 md:px-10 mx-auto mt-8 w-full h-full">
                    {children}
                    <FooterAdmin />
                </div>
            </div>
        </>
    );
}

Admin.propTypes = {
    children: PropTypes.any,
};
