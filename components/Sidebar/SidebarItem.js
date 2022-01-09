import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import SidebarItemData from './SidebarItemData';

export default function SidebarItem({ path, title, icon, index }) {
    const router = useRouter();
    const routes = SidebarItemData.routes;
    let active = 0;
    for (const route of routes) {
        if (router.pathname.indexOf(route.path) > -1) {
            active = route.index;
        }
    }
    if (router.pathname !== '/' && path === '/') {
        active = 0;
    }

    return (
        <li className="items-center">
            <Link href={path}>
                <a
                    href="#pablo"
                    className={
                        'text-xs uppercase py-3 font-bold block ' +
                        (active === index ? 'text-sky-500 hover:text-sky-600' : 'text-blueGray-700 hover:text-blueGray-500')
                    }
                >
                    <i className={icon + ' mr-2 text-sm ' + (active === index ? 'opacity-75' : 'text-blueGray-700')}></i>
                    {title}
                </a>
            </Link>
        </li>
    );
}

SidebarItem.propTypes = {
    path: PropTypes.any,
    title: PropTypes.any,
    icon: PropTypes.any,
    index: PropTypes.any,
};
