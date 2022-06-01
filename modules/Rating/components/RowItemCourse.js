import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { displayHelpers } from 'helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function RowItemCourse({ data, updateActive }) {
    const router = useRouter();

    const { checkNull, avatarImg, isActive } = displayHelpers;
    const { id, active, avatar, class: classStr, name, rate, countRate } = data;
    return (
        <tr>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {id}
            </td>
            <th>
                <Link href={`/rating/${id}`} as={`/rating/${id}`}>
                    <a className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs whitespace-nowrap p-4 text-center flex items-center">
                        <img
                            src={avatarImg(avatar)}
                            className="object-contain 2xl:h-12  2xl:flex xl:hidden xl:h-8 bg-white border"
                            alt="..."
                        ></img>{' '}
                        <span className="ml-3 font-bold text-blueGray-700 hover:text-sky-600">
                            {checkNull(name)}
                        </span>
                    </a>
                </Link>
            </th>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {checkNull(classStr)}
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm text-xs xl:text-xs text-center whitespace-nowrap p-4">
                {checkNull(rate.toString())}
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {checkNull(countRate.toString())}
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {isActive(active)}
            </td>
        </tr>
    );
}
