import React from 'react';
import { displayHelpers } from 'helpers';
import { useRouter } from 'next/router';
const { isActive, checkNull, getDate } = displayHelpers;

export default function Detail({ user, onDelete }) {
    const router = useRouter();

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

    function isGender(gender) {
        switch (gender) {
            case 'male': {
                return 'Nam';
            }
            case 'female': {
                return 'Nữ';
            }
            case 'orther': {
                return 'Khác';
            }
            default: {
                return '...';
            }
        }
    }

    return (
        <div className="w-full px-4 flex items-center mt-4 mb-6">
            <div className="xl:w-8/12 px-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                <li className="w-full px-6">
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Id:</span>
                        <b className="w-9/12">{checkNull(user.id)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Họ tên:</span>
                        <b className="w-9/12">{checkNull(user.fullName)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Số điện thoại:</span>
                        <b className="w-9/12">{checkNull(user.phone)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Email:</span>
                        <b className="w-9/12">{checkNull(user.email)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Giới tính:</span>
                        <b className="w-9/12">{isGender(user.gender)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Sinh nhật:</span>
                        <b className="w-9/12">{getDate(user.birthday)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Họ và tên đệm:</span>
                        <b className="w-9/12">{checkNull(user.firstName)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Tên:</span>
                        <b className="w-9/12">{checkNull(user.lastName)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Loại thành viên:</span>
                        <b className="w-9/12">{isRole(user.role)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Trạng thái:</span>
                        <b className="w-9/12">{isActive(user.active, true)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Ngày đăng kí:</span>
                        <b className="w-9/12">{getDate(user.createdAt)}</b>
                    </ul>
                    <ul className="mb-2 flex w-full">
                        <span className="w-3/12">Ngày cập nhật:</span>
                        <b className="w-9/12">{getDate(user.updatedAt)}</b>
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
                        onClick={() => router.push(`/users/${user.id}/edit`)}
                    >
                        Chỉnh sủa thông tin
                    </button>
                    <button
                        className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => onDelete(user.id)}
                    >
                        Xoá người dùng
                    </button>
                </div>
            </div>
        </div>
    );
}
