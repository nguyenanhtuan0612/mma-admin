import React, { useContext, useEffect, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { AuthContext } from 'layouts/Admin';

const { checkNull, avatarUser, dateFormat, checkSelect } = displayHelpers;

export default function EditUser() {
    const router = useRouter();

    const { id } = router.query;
    const auth = useContext(AuthContext);
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        gender: '',
        birthday: '',
        role: '',
        active: true,
        avartarImage: '',
    });
    const [isRoot, setIsRoot] = useState(false);

    useEffect(async () => {
        const data = await getDetail(id);
        if (!data) {
            return;
        }

        setIsRoot(auth.role == 'root' ? true : false);
        setUser(data.data);
    }, [auth]);

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

    async function onUpdate(e) {
        e.preventDefault();
        const data = await updateUser(id, user);
        if (!data) {
            return;
        }
        setUser(data.data);
        openNotification(notiType.success, 'Cập nhật thành công !');
    }

    async function updateUser(id, body) {
        const { data } = await serviceHelpers.updateData('users', id, body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function handleChangeFirstName(e) {
        e.preventDefault();
        setUser({
            ...user,
            firstName: e.target.value,
            fullName: `${e.target.value} ${user.lastName}`,
        });
    }

    async function handleChangeLastName(e) {
        e.preventDefault();
        setUser({
            ...user,
            lastName: e.target.value,
            fullName: `${user.firstName} ${e.target.value}`,
        });
    }

    async function handleChangePhone(e) {
        e.preventDefault();
        setUser({
            ...user,
            lastName: e.target.value,
        });
    }

    async function handleChangeEmail(e) {
        e.preventDefault();
        setUser({
            ...user,
            email: e.target.value,
        });
    }

    async function handleChangeGender(e) {
        e.preventDefault();
        setUser({
            ...user,
            gender: e.target.value,
        });
    }

    async function handleChangeBirthDay(e) {
        e.preventDefault();
        setUser({
            ...user,
            birthday: e.target.value,
        });
    }

    async function handleChangeRole(e) {
        e.preventDefault();
        setUser({
            ...user,
            role: e.target.value,
        });
    }

    async function handleChangeActive(e) {
        e.preventDefault();
        setUser({
            ...user,
            active: e.target.value === 'true' ? true : false,
        });
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
                    <div className="w-full px-4 flex mt-4 mb-6 h-full">
                        <div className="2xl:w-9/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Họ và tên đệm:
                                        </label>
                                        <input
                                            value={checkNull(user.firstName, '')}
                                            onChange={handleChangeFirstName}
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Nguyễn Bá"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Tên:</label>
                                        <input
                                            value={checkNull(user.lastName, '')}
                                            onChange={handleChangeLastName}
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Sơn"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Số điện thoại:
                                        </label>
                                        <input
                                            value={checkNull(user.phone, '')}
                                            onChange={handleChangePhone}
                                            type="text"
                                            placeholder="0123456789"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Email:</label>
                                        <input
                                            value={checkNull(user.email, '')}
                                            onChange={handleChangeEmail}
                                            type="text"
                                            placeholder="example@email.com"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Giới tính:</label>
                                        <select
                                            value={checkSelect(user.gender)}
                                            onChange={handleChangeGender}
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value="" hidden>
                                                Chưa chọn
                                            </option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="orther">Khác</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Sinh nhật:</label>
                                        <input
                                            onChange={handleChangeBirthDay}
                                            value={dateFormat(user.birthday)}
                                            type="date"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Loại thành viên:
                                        </label>
                                        <select
                                            disabled={!isRoot}
                                            value={checkSelect(user.role)}
                                            onChange={handleChangeRole}
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value="" hidden>
                                                Chưa chọn
                                            </option>
                                            <option value="root">Root Admin</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">Người dùng</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Trạng thái:</label>
                                        <select
                                            value={checkSelect(user.active)}
                                            onChange={handleChangeActive}
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value="true">Hoạt động</option>
                                            <option value="false">Vô hiệu</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-6 flex items-center mt-2 justify-center">
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
                                    onClick={onUpdate}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                        <div className="2xl:w-3/12 w-full px-4 h-full mt-4">
                            <div className="w-full flex justify-center">
                                <img
                                    alt="..."
                                    src={avatarUser(user.avartarImage)}
                                    className="shadow-xl rounded-full h-auto border-none max-w-150-px"
                                />
                            </div>
                            <input id="file-input" type="file" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
