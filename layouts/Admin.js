import React, { useEffect, useState, createContext } from 'react';
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import FooterAdmin from 'components/Footers/FooterAdmin.js';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { serviceHelpers } from 'helpers';

export const AuthContext = createContext();

export default function Admin({ children }) {
    const [user, setUser] = useState({});
    const [authorize, setAuthorize] = useState(false);
    const router = useRouter();
    useEffect(async () => {
        const { data } = await serviceHelpers.checkToken();
        if (!data) {
            window.localStorage.removeItem('accessToken');
            router.push('/auth/login');
            return <div></div>;
        }
        if (data.statusCode == 400) {
            router.push('/auth/login');
            return <div></div>;
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        if (data.statusCode === 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        if (data.data && data.data.role == 'user') {
            router.push('/auth/login');
            return <div></div>;
        }
        setUser(data.data);
        setAuthorize(true);
    }, []);

    return (
        <AuthContext.Provider value={user}>
            <div className={authorize == false ? 'hidden' : ''}>
                <Sidebar />
                <div className="relative md:ml-64 bg-blueGray-200 min-h-screen">
                    <AdminNavbar />
                    <div className="px-4 md:px-10 mx-auto mt-6 w-full h-full ">
                        {children}
                        <FooterAdmin />
                    </div>
                </div>
            </div>
        </AuthContext.Provider>
    );
}

Admin.propTypes = {
    children: PropTypes.any,
};
