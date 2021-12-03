import React, { useState } from 'react';
import { serviceHelpers, openNotification, notiType } from 'helpers';
import Auth from 'layouts/Auth.js';
import router from 'next/router';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    function handleChangePhone(e) {
        setPhone(e.target.value);
    }

    function handleChangePassword(e) {
        setPassword(e.target.value);
    }

    function handleShowPassClick(e) {
        setShowPass(e.target.checked);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { data } = await serviceHelpers.login(phone, password);
        if (!data) {
            openNotification(notiType.error, 'Đăng nhập thất bại', data.message);
            return;
        }
        if (data.statusCode === 200) {
            if (data.data.role == 'user') {
                alert('Không đủ quyền truy cập');
                return;
            }
            const { accessToken } = data.data.data.JWT;
            localStorage.setItem('accessToken', `Bearer ${accessToken}`);
            const returnUrl = router.query.returnUrl || '/';
            router.push(returnUrl);
            return;
        }
        openNotification(notiType.error, 'Đăng nhập thất bại', data.message);
        return;
    }

    return (
        <>
            <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-4/12 px-4">
                        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                <div className="text-blueGray-400 text-center mt-6 justify-center flex mb-3 text-xl font-bold h-6">
                                    <img src="/img/mma-logo.png" className="" alt="logo" />
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="phone">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="string"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Số điện thoại"
                                            id="phone"
                                            name="phone"
                                            onChange={handleChangePhone}
                                        />
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Mật khẩu</label>
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Mật khẩu"
                                            id="password"
                                            name="password"
                                            onChange={handleChangePassword}
                                        />
                                    </div>
                                    <div>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                id="customCheckLogin"
                                                type="checkbox"
                                                onClick={handleShowPassClick}
                                                className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                            />
                                            <span className="ml-2 text-sm font-semibold text-blueGray-600">Hiện mật khẩu</span>
                                        </label>
                                    </div>

                                    <div className="text-center mt-6">
                                        <button
                                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="submit"
                                        >
                                            Đăng nhâp
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = Auth;
