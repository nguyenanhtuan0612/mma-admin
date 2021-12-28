import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

export default function SidebarItem({ path, title, icon, index }) {
    const router = useRouter();
    const routes = [
        {
            path: '/',
            index: 1,
        },
        {
            path: '/users',
            index: 2,
        },
        {
            path: '/teachers',
            index: 3,
        },
        {
            path: '/courses',
            index: 4,
        },
        {
            path: '/lessons',
            index: 4,
        },
    ];
    let active = 0;
    if (router.pathname.indexOf(path) > -1) {
        for (const route of routes) {
            if (route.path === path) {
                active = route.index;
            }
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
                    <i className={icon + ' mr-2 text-sm ' + (active === index ? 'opacity-75' : 'text-blueGray-300')}></i>
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
