import React from 'react';
import { serviceHelpers, displayHelpers } from 'helpers';
import { useRouter } from 'next/router';

const { isActive, checkNull, getDate } = displayHelpers;

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
                        <span className="w-3/12">Name:</span>
                        <b className="w-9/12">{checkNull(state.name)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Like:</span>
                        <b className="w-9/12">{state.like}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Description:</span>
                        <b className="w-9/12">
                            {checkNull(state.description)}
                        </b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Anh Bia:</span>
                        <b className="w-9/12">{checkNull(state.coverImage)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Trạng thái:</span>
                        <b className="w-9/12">{isActive(state.active, true)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Ngày đăng kí:</span>
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
                        onClick={() => router.push(`/pages/${state.id}/edit`)}
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
