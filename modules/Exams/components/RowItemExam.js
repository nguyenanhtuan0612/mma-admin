import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { displayHelpers } from 'helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function RowItemExams({ data, deleteQuestion, examId }) {
    const router = useRouter();

    function deleteQs(id) {
        return (
            <Popconfirm
                title="Bạn muốn xóa câu hỏi này?"
                okText="Đồng ý"
                cancelText="Hủy"
                onConfirm={() => {
                    deleteQuestion(id);
                }}
            >
                <button
                    className="border bg-white hover:bg-red-500 text-red-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs 2xl:px-4 2xl:py-2 xl:px-3 xl:py-1.5 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <i className=" fas fa-solid fa-trash"></i>
                </button>
            </Popconfirm>
        );
    }

    function isType(type) {
        switch (type) {
            case 'drag': {
                return 'Kéo thả';
            }
            case 'matching': {
                return 'Nối';
            }
            case 'multiChoice': {
                return 'Trắc nghiệm';
            }
            default: {
                return '...';
            }
        }
    }

    function isLevel(level) {
        switch (level) {
            case 'easy': {
                return 'Dễ';
            }
            case 'medium': {
                return 'Trung bình';
            }
            case 'hard': {
                return 'Khó';
            }
            default: {
                return '...';
            }
        }
    }

    const { checkNull, isActive } = displayHelpers;
    const { id, type, level, active, question } = data;
    return (
        <tr>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{id}</td>
            <th>
                <Link href={`/questions/${id}?examId=${examId}`} as={`/questions/${id}?examId=${examId}`}>
                    <a
                        href={`/teachers/${id}`}
                        className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs whitespace-nowrap p-4 text-center flex items-center"
                    >
                        <span className="ml-3 font-bold text-blueGray-700 hover:text-sky-600">{checkNull(question)}</span>
                    </a>
                </Link>
            </th>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{isType(type)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm text-xs xl:text-xs text-center whitespace-nowrap p-4">{isLevel(level)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{isActive(active)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{deleteQs(id)}</td>
        </tr>
    );
}
