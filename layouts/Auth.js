import React, { useEffect } from 'react';
import FooterSmall from 'components/Footers/FooterSmall.js';
import PropTypes from 'prop-types';
import { serviceHelpers } from 'helpers';
import router from 'next/router';
export default function Auth({ children }) {
    useEffect(async () => {
        const { data } = await serviceHelpers.checkToken();
        if (!data) return;
        if (data.statusCode == 200) {
            router.push('/');
            return <div></div>;
        }
    }, []);

    return (
        <>
            <main>
                <section className="relative w-full h-full py-40 min-h-screen">
                    <div
                        className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
                        style={{
                            backgroundImage: "url('/img/register_bg_2.png')",
                        }}
                    ></div>
                    {children}
                    <FooterSmall absolute />
                </section>
            </main>
        </>
    );
}

Auth.propTypes = {
    children: PropTypes.any,
};
