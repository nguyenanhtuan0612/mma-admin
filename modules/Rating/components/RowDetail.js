import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { displayHelpers } from 'helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function RowDetail({ data, updateActive }) {
    const router = useRouter();

    function isDisplay(display, reverse = false) {
        let className = 'fas fa-check-circle text-emerald-500 ';
        let status = 'Hiển thị';
        if (active == false) {
            className = 'fas fa-times-circle text-red-500 ';
            status = 'Ẩn';
        }
        if (reverse === true) {
            return (
                <>
                    {status} <i className={className + 'ml-2'}></i>
                </>
            );
        }
        return (
            <>
                <i className={className + 'mr-2'}></i> {status}
            </>
        );
    }

    function displayRate(display) {
        if (display == true) {
            return (
                <Popconfirm title="Bạn muốn vô hiệu khoá học này?" okText="Đồng ý" cancelText="Hủy" onConfirm={() => updateActive(id)}>
                    <button
                        className="border bg-white hover:bg-red-500 text-red-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                        <span className="fas fa-solid fa-eye-slash"></span>
                    </button>
                </Popconfirm>
            );
        }
        return (
            <Popconfirm title="Bạn muốn kích hoạt khoá học này?" okText="Đồng ý" cancelText="Hủy" onConfirm={() => updateActive(id)}>
                <button
                    className="border bg-white hover:bg-emerald-500 text-emerald-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <span className="fas ffa-solid fa-eye"></span>
                </button>
            </Popconfirm>
        );
    }

    const { checkNull, avatarImg, isActive } = displayHelpers;
    const { id, active, avatar, class: classStr, name, rate, user, comment, display } = data;
    return (
        <tr>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{id}</td>
            <td className="">
                <Link href={`/users/${id}`} as={`/users/${id}`}>
                    <a
                        href={`/users/${id}`}
                        className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs whitespace-nowrap p-4 text-center flex items-center"
                    >
                        <img
                            src={avatarImg(user.avatarImage)}
                            className="object-contain 2xl:h-12 2xl:w-12 2xl:flex xl:hidden xl:w-8 xl:h-8 bg-white rounded-full border"
                            alt="..."
                        ></img>{' '}
                        <span className="ml-3 font-bold text-blueGray-700 hover:text-sky-600">{checkNull(user.fullName)}</span>
                    </a>
                </Link>
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm text-xs xl:text-xs text-center whitespace-nowrap p-4">
                {checkNull(rate.toString())}
            </td>
            <td>
                <Tooltip placement="topLeft" title={comment}>
                    <span className="ml-3 font-bold text-blueGray-700 hover:text-sky-600">{checkNull(comment, '...', 20)}</span>
                </Tooltip>
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{isDisplay(display)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{displayRate(display)}</td>
        </tr>
    );
}
