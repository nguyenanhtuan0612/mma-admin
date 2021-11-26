import React, { createRef, useState } from 'react';
import { createPopper } from '@popperjs/core';
import router from 'next/router';
import PropTypes from 'prop-types';
import { useEffect } from 'react/cjs/react.development';

export default function UserDropdown({ user }) {
    const [avatar, setAvatar] = useState('/img/avatar.jpeg');

    // dropdown props
    const [isShow, setIsShow] = useState(false);
    const btnDropdownRef = createRef();
    const popoverDropdownRef = createRef();
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: 'bottom-start',
        });
        setIsShow(true);
    };
    const closeDropdownPopover = () => {
        setIsShow(false);
    };

    function logout(e) {
        e.preventDefault();
        window.localStorage.removeItem('accessToken');
        router.push('/auth/login');
    }

    function avatarUser(avatarImage) {
        if (avatarImage) {
            return avatarImage;
        }
        return '/img/avatar.jpeg';
    }

    useEffect(() => {
        if (user) {
            setAvatar(user.avatarImage);
        }
    }, [user]);

    return (
        <>
            <a
                className="text-blueGray-500 block"
                href="#pablo"
                ref={btnDropdownRef}
                onClick={e => {
                    e.preventDefault();
                    isShow ? closeDropdownPopover() : openDropdownPopover();
                }}
            >
                <div className="items-center flex">
                    <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                        <img alt="..." className="w-full rounded-full align-middle border-none shadow-lg" src={avatarUser(avatar)} />
                    </span>
                </div>
            </a>
            <div
                ref={popoverDropdownRef}
                className={(isShow ? 'block ' : 'hidden ') + 'bg-white text-base z-50 py-2 list-none text-left rounded shadow-lg min-w-48'}
            >
                <a
                    href="#pablo"
                    className={'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'}
                    onClick={e => e.preventDefault()}
                >
                    Tài khoản
                </a>
                <div className="h-0 my-2 border border-solid border-blueGray-100" />
                <a
                    href="#pablo"
                    className={'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'}
                    onClick={logout}
                >
                    Đăng xuất
                </a>
            </div>
        </>
    );
}

UserDropdown.propTypes = {
    user: PropTypes.any,
};
