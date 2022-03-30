import React, { useEffect, useState, createContext, useReducer } from 'react';
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import FooterAdmin from 'components/Footers/FooterAdmin.js';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { serviceHelpers } from 'helpers';
import reducer, { initState } from '../store/reducer';
import { setState } from '../store/actions';

export const AuthContext = createContext();

export default function Admin({ children }) {
    const [state, dispatch] = useReducer(reducer, initState);
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
        dispatch(setState(data.data));
        setAuthorize(true);
    }, []);

    return (
        <AuthContext.Provider value={[state, dispatch]}>
            <div className={state.loading == false ? 'hidden' : 'loading z-2'}>
                <div className="gooey z-2">
                    <span className="dot"></span>
                    <div className="dots">
                        <span className="span_dot"></span>
                        <span className="span_dot"></span>
                        <span className="span_dot"></span>
                    </div>
                </div>
            </div>
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
