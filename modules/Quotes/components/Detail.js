import React from 'react';
import { serviceHelpers, displayHelpers } from 'helpers';
import { useRouter } from 'next/router';

const { limitLength, checkNull, getDate } = displayHelpers;

export default function Detail({ state, setState, onDelete }) {
    const router = useRouter();
    return (
        <div className="w-full px-4 flex items-center mt-4 mb-6">
            <div className="xl:w-8/12 px-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                <li className="w-full px-6">
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Id:</span>
                        <b className="w-9/12">{checkNull(state.id)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Quote:</span>
                        <b className="w-9/12">{limitLength(state.quote)}</b>
                    </ul>  
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">BookId:</span>
                        <b className="w-9/12">{checkNull(state.bookId)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">AuthoName:</span>
                        <b className="w-9/12">{checkNull(state.authorName)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">CategoryId:</span>
                        <b className="w-9/12">{checkNull(state.categoryId)}</b>
                    </ul>
                  
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Ngày :</span>
                        <b className="w-9/12">{getDate(state.createdAt)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Ngày cập nhật:</span>
                        <b className="w-9/12">{getDate(state.updatedAt)}</b>
                    </ul>
                </li>
                <div className="w-full px-6 flex items-center mt-10">
                    <button
                        className="mx-2 mb-2 bg-yellow-500 hover:bg-yellow-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => router.back()}
                    >
                        Trở về
                    </button>
                    <button
                        className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => router.push(`/quotes/${state.id}/edit`)}
                    >
                        Chỉnh sủa thông tin
                    </button>
                    <button
                        className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => onDelete(state.id)}
                    >
                        Xoá người dùng
                    </button>
                </div>
            </div>
        </div>
    );
}
