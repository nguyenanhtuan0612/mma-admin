import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';

export default function RowItemUser({ color, data }) {
    function isActive(active) {
        let className = 'fas fa-check-circle text-emerald-500 mr-2';
        let status = 'Hoạt động';
        if (active == false) {
            className = 'fas fa-times-circle text-red-500 mr-2';
            status = 'Đã vô hiệu';
        }
        return (
            <>
                <i className={className}></i> {status}
            </>
        );
    }

    function getDate(createdAt) {
        const splitT = createdAt.split('T');
        const spiltDash = splitT[0].split('-');
        return spiltDash[2] + '/' + spiltDash[1] + '/' + spiltDash[0];
    }

    function isRole(role) {
        switch (role) {
            case 'root': {
                return 'Root Admin';
            }
            case 'admin': {
                return 'Admin';
            }
            default: {
                return 'Người dùng';
            }
        }
    }

    function activeUser(active) {
        if (active == true) {
            return (
                <Popconfirm title="Bạn muốn vô hiệu thành viên này?" okText="Đồng ý" cancelText="Hủy">
                    <button
                        className="border bg-white hover:bg-red-500 text-red-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                        <span className="fas fa-user"></span>
                    </button>
                </Popconfirm>
            );
        }
        return (
            <Popconfirm title="Bạn muốn kích hoạt thành viên này?" okText="Đồng ý" cancelText="Hủy">
                <button
                    className="border bg-white hover:bg-emerald-500 text-emerald-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <span className="fas fa-user"></span>
                </button>
            </Popconfirm>
        );
    }

    function avatarUser(avatarImage) {
        if (avatarImage) {
            return avatarImage;
        }
        return '/img/avatar.jpeg';
    }

    function checkNull(string) {
        if (string) {
            return string;
        }
        return '...';
    }

    const { id, email, active, phone, avatarImage, role, fullName, createdAt } = data;
    return (
        <tr>
            <td className="px-6 align-middle text-sm text-center whitespace-nowrap p-4">{id}</td>
            <th className="px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center">
                <img src={avatarUser(avatarImage)} className="h-12 w-12 bg-white rounded-full border" alt="..."></img>{' '}
                <span className={'ml-3 font-bold ' + (color === 'light' ? 'text-blueGray-600' : 'text-white')}>{checkNull(fullName)}</span>
            </th>
            <td className="px-6 align-middle text-sm text-center whitespace-nowrap p-4">{checkNull(phone)}</td>
            <td className="px-6 align-middle text-sm text-center whitespace-nowrap p-4">{checkNull(email)}</td>
            <td className="px-6 align-middle text-sm text-center whitespace-nowrap p-4">{getDate(createdAt)}</td>
            <td className="px-6 align-middle text-sm text-center whitespace-nowrap p-4">{isRole(role)}</td>
            <td className="px-6 align-middle text-sm text-center whitespace-nowrap p-4">{isActive(active)}</td>
            <td className="px-6 align-middle text-xl text-center whitespace-nowrap p-4">{activeUser(active)}</td>
        </tr>
    );
}

RowItemUser.defaultProps = {
    color: 'light',
};

RowItemUser.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
    data: PropTypes.any.isRequired,
};
