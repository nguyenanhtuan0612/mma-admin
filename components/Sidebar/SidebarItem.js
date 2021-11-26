import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

export default function SidebarItem({ path, title, icon }) {
    const router = useRouter();

    return (
        <li className="items-center">
            <Link href={path}>
                <a
                    href="#pablo"
                    className={
                        'text-xs uppercase py-3 font-bold block ' +
                        (router.pathname == path ? 'text-sky-500 hover:text-sky-600' : 'text-blueGray-700 hover:text-blueGray-500')
                    }
                >
                    <i className={icon + ' mr-2 text-sm ' + (router.pathname == path ? 'opacity-75' : 'text-blueGray-300')}></i>
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
};
