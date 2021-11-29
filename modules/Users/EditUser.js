import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import Detail from './components/Detail';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';

const { checkNull, avatarUser, isActive, getDate } = displayHelpers;

export default function EditUser() {
    const router = useRouter();
    const { id } = router.query;

    const [user, setUser] = useState({});

    function callback(key) {
        console.log(key);
    }

    useEffect(async () => {
        const data = await getDetail(id);
        if (!data) {
            return;
        }
        setUser(data.data);
    }, []);

    async function getDetail(id) {
        const { data } = await serviceHelpers.detailData('users', id);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            console.log(data.message);
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
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

    async function getDetail(id) {
        const { data } = await serviceHelpers.detailData('users', id);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            console.log(data.message);
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <img src={avatarUser(user.avartarImage)} className="h-16 w-16 bg-white rounded-full border mr-4" alt="..."></img>{' '}
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">{checkNull(user.fullName)}</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <div className="w-full px-4 flex items-center mt-4 mb-6">
                        <div className="2xl:w-9/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Họ và tên đệm:
                                        </label>
                                        <input
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Tên:</label>
                                        <input
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Số điện thoại:
                                        </label>
                                        <input
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Email:</label>
                                        <input
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Giới tính:</label>
                                        <input
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Sinh nhật:</label>
                                        <input
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Loại thành viên:
                                        </label>
                                        <input
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Trạng thái:</label>
                                        <input
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-6 flex items-center mt-10 justify-center">
                                <button
                                    className="mx-2 mb-2 bg-yellow-500 hover:bg-yellow-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => router.back()}
                                >
                                    Huỷ bỏ
                                </button>
                                <button
                                    className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => router.push(`/users/${user.id}/edit`)}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                        <div className="2xl:w-3/12 w-full px-4 flex items-start justify-center">
                            <div className="relative">
                                <img
                                    alt="..."
                                    src="/img/team-2-800x800.jpg"
                                    className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
