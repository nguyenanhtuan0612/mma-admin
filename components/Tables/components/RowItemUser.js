import React from 'react';
import PropTypes from 'prop-types';
import Popconfirm from 'antd';

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

    function loginWith(googleId, facebookId) {
        if (facebookId) {
            return 'Facebook';
        }
        if (googleId) {
            return 'Google';
        }
        return 'Email + Password';
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

    const { googleId, facebookId, active, avatarImage, role, fullName, createdAt } = data;
    return (
        <tr>
            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                <img src={avatarImage} className="h-12 w-12 bg-white rounded-full border" alt="..."></img>{' '}
                <span className={'ml-3 font-bold ' + (color === 'light' ? 'text-blueGray-600' : 'text-white')}>{fullName}</span>
            </th>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{loginWith(googleId, facebookId)}</td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{getDate(createdAt)}</td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{isRole(role)}</td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{isActive(active)}</td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                {data.enabled === true ? (
                    <Popconfirm title="Bạn muốn vô hiệu thành viên này?" okText="Đồng ý" cancelText="Hủy">
                        <span className="badge badge-danger badge-outline badge-lg">Vô hiệu</span>
                    </Popconfirm>
                ) : (
                    <Popconfirm title="Bạn muốn kích hoạt thành viên này?" okText="Đồng ý" cancelText="Hủy">
                        <span className="badge badge-success badge-outline badge-lg">Kích hoạt</span>
                    </Popconfirm>
                )}
            </td>
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
