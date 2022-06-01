import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { displayHelpers } from 'helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function RowItemCourse({ data, updateActive }) {
    const router = useRouter();

    function activeCourse(active) {
        if (active == true) {
            return (
                <Popconfirm
                    title="Bạn muốn vô hiệu khoá học này?"
                    okText="Đồng ý"
                    cancelText="Hủy"
                    onConfirm={() => updateActive(id, { active: false })}
                >
                    <button
                        className="border bg-white hover:bg-red-500 text-red-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                        <span className="fas fa-lock"></span>
                    </button>
                </Popconfirm>
            );
        }
        return (
            <Popconfirm
                title="Bạn muốn kích hoạt khoá học này?"
                okText="Đồng ý"
                cancelText="Hủy"
                onConfirm={() => updateActive(id, { active: true })}
            >
                <button
                    className="border bg-white hover:bg-emerald-500 text-emerald-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <span className="fas fa-unlock-alt"></span>
                </button>
            </Popconfirm>
        );
    }

    const { checkNull, avatarImg, getDate, isActive, formatCurrency } = displayHelpers;
    const { id, numLesson, amount, active, avatar, class: classStr, name, createdAt } = data;
    return (
        <tr>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {id}
            </td>
            <th>
                <Link href={`/courses/${id}/lessons`} as={`/courses/${id}/lessons`}>
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
                {checkNull(formatCurrency(amount))}
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {checkNull(numLesson.toString())}
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                <Tooltip placement="topLeft" title="Danh sách bài học">
                    <button
                        className="border bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150 mr-2"
                        type="button"
                        onClick={e => router.push(`/courses/${id}/lessons`)}
                    >
                        <span className="fas fa-th-list"></span>
                    </button>
                </Tooltip>
                <Tooltip placement="topLeft" title="Thông tin chi tiết">
                    <button
                        className="border bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={e => router.push(`/courses/${id}`)}
                    >
                        <span className="fas fa-pencil-alt"></span>
                    </button>
                </Tooltip>
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {isActive(active)}
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {activeCourse(active)}
            </td>
        </tr>
    );
}
