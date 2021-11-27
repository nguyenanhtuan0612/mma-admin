import React from 'react';
import { Popconfirm } from 'antd';
import Link from 'next/link';

export default function RowItemUser({ data, updateActive }) {
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
                <Popconfirm
                    title="Bạn muốn vô hiệu thành viên này?"
                    okText="Đồng ý"
                    cancelText="Hủy"
                    onConfirm={() => updateActive(id, { active: false })}
                >
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
            <Popconfirm
                title="Bạn muốn kích hoạt thành viên này?"
                okText="Đồng ý"
                cancelText="Hủy"
                onConfirm={() => updateActive(id, { active: true })}
            >
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

    const { id, email, phone, active, avatarImage, role, fullName, createdAt } = data;
    return (
        <tr>
            <td className="px-6 align-middle lg:text-sm md:text-xs text-center whitespace-nowrap p-4">{id}</td>
            <th>
                <Link href="/users/[id]" as={`/users/${id}`}>
                    <a href="#pablo" className=" px-6 align-middle lg:text-sm md:text-xs whitespace-nowrap p-4 text-center flex items-center">
                        <img src={avatarUser(avatarImage)} className="h-12 w-12 bg-white rounded-full border" alt="..."></img>{' '}
                        <span className="ml-3 font-bold text-blueGray-700 hover:text-sky-600">{checkNull(fullName)}</span>
                    </a>
                </Link>
            </th>
            <td className="px-6 align-middle md:text-xs lg:text-sm text-center whitespace-nowrap p-4">{checkNull(phone)}</td>
            <td className="px-6 align-middle lg:text-sm md:text-xs text-center whitespace-nowrap p-4">{checkNull(email)}</td>
            <td className="px-6 align-middle lg:text-sm md:text-xs text-center whitespace-nowrap p-4">{getDate(createdAt)}</td>
            <td className="px-6 align-middle lg:text-sm md:text-xs text-center whitespace-nowrap p-4">{isRole(role)}</td>
            <td className="px-6 align-middle lg:text-sm md:text-xs text-center whitespace-nowrap p-4">{isActive(active)}</td>
            <td className="px-6 align-middle lg:text-sm md:text-xs text-center whitespace-nowrap p-4">{activeUser(active)}</td>
        </tr>
    );
}
