import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { displayHelpers } from 'helpers';
import Link from 'next/link';

export default function RowItemLesson({ data, deleteLesson }) {
    function onDelete(id) {
        return (
            <Popconfirm
                title="Bạn muốn xoá bài học này?"
                okText="Đồng ý"
                cancelText="Hủy"
                onConfirm={() => deleteLesson(id)}
            >
                <button
                    className="border bg-white hover:bg-red-500 text-red-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <span className="fas fa-solid fa-trash"></span>
                </button>
            </Popconfirm>
        );
    }

    function checkFree(isFree) {
        let value = 'Có phí';
        if (isFree) value = 'Miễn phí';
        return value;
    }

    function isType(type) {
        switch (type) {
            case 'test': {
                return 'Kiểm tra';
            }
            case 'form_2': {
                return 'Dạng 2';
            }
            default: {
                return 'Dạng 1';
            }
        }
    }

    const { checkNull, avatarImg, getDate, isActive } = displayHelpers;
    const { id, isFree, active, thumb, type, name, createdAt } = data;
    return (
        <tr>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {id}
            </td>
            <th>
                <Link href={`/lessons/${id}`} as={`/lessons/${id}`}>
                    <a
                        href={`/lessons/${id}`}
                        className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs whitespace-nowrap p-4 text-center flex items-center"
                    >
                        <img
                            src={avatarImg(thumb, '/img/empty.jpeg')}
                            className=" object-contain object-center 2xl:w-12 2xl:flex xl:hidden xl:w-8 bg-white border"
                            alt="..."
                        ></img>{' '}
                        <Tooltip placement="topLeft" title={name}>
                            <span className="ml-3 font-bold text-blueGray-700 hover:text-sky-600">
                                {checkNull(name, '', 20)}
                            </span>
                        </Tooltip>
                    </a>
                </Link>
            </th>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {checkFree(isFree)}
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm text-xs xl:text-xs text-center whitespace-nowrap p-4">
                {isType(type)}
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {getDate(createdAt)}
            </td>
            <td className="px-2 2xl:px-2 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {isActive(active)}
            </td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">
                {onDelete(id)}
            </td>
        </tr>
    );
}
