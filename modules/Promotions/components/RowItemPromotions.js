import React from 'react';
import { Popconfirm } from 'antd';
import { displayHelpers } from 'helpers';
import Link from 'next/link';

export default function RowItemPromotions({ data, updateActive }) {
    function activeUser(active) {
        if (active == true) {
            return (
                <Popconfirm
                    title="Bạn muốn vô hiệu khuyễn mại này?"
                    okText="Đồng ý"
                    cancelText="Hủy"
                    onConfirm={() => updateActive(id, { active: false })}
                >
                    <button
                        className="border bg-white hover:bg-red-500 text-red-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                        <span className="fas fa-user"></span>
                    </button>
                </Popconfirm>
            );
        }
        return (
            <Popconfirm
                title="Bạn muốn kích hoạt khuyến mãi này?"
                okText="Đồng ý"
                cancelText="Hủy"
                onConfirm={() => updateActive(id, { active: true })}
            >
                <button
                    className="border bg-white hover:bg-emerald-500 text-emerald-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <span className="fas fa-user"></span>
                </button>
            </Popconfirm>
        );
    }

    const { checkNull, avatarImg, getDate, isActive } = displayHelpers;
    const { id, discount, active, avatar, name, applyFrom, applyTo, course } = data;
    return (
        <tr>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{id}</td>
            <th>
                <Link href={`/promotions/${id}`} as={`/promotions/${id}`}>
                    <a
                        href={`/promotions/${id}`}
                        className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs whitespace-nowrap p-4 text-center flex items-center"
                    >
                        <img
                            src={avatarImg(avatar)}
                            className="object-cover 2xl:h-12 2xl:w-12 2xl:flex xl:hidden xl:w-8 xl:h-8 bg-white rounded-full border"
                            alt="..."
                        ></img>{' '}
                        <span className="ml-3 font-bold text-blueGray-700 hover:text-sky-600">{checkNull(name)}</span>
                    </a>
                </Link>
            </th>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm text-xs xl:text-xs text-center whitespace-nowrap p-4">{checkNull(course.name)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm text-xs xl:text-xs text-center whitespace-nowrap p-4">{discount + '%'}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{getDate(applyFrom)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{getDate(applyTo)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{isActive(active)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{activeUser(active)}</td>
        </tr>
    );
}
