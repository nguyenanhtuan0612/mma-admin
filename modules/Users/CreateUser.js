import React, { useContext, useEffect, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { AuthContext } from 'layouts/Admin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.umd';
import * as Yup from 'yup';

const { checkNull, avatarImg, dateFormat, checkSelect } = displayHelpers;

export default function CreateU() {
    const router = useRouter();

    const { id } = router.query;
    const auth = useContext(AuthContext);
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: null,
        gender: null,
        birthday: null,
        role: 'user',
        active: true,
        avatarImage: null,
        password: '',
        confirmPassword: '',
    });

    const validationSchema = Yup.object().shape({
        phone: Yup.string()
            .matches(/[0]{1}[0-9]+/, 'Số điện thoại không đúng')
            .min(10, 'Số điện thoại phải có 10-11 kí tự')
            .max(11, 'Số điện thoại phải có 10-11 kí tự')
            .required('Số điện thoại là bắt buộc'),
        firstName: Yup.string().required('Họ là bắt buộc'),
        lastName: Yup.string().required('Tên là bắt buộc'),
        password: Yup.string().min(6, 'Mật khẩu phải nhiều hơn 6 kí tự').required('Mật khẩu là bắt buộc'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
            .required('Xác nhận mật khẩu là bắt buộc'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { handleSubmit, formState, register } = useForm(formOptions);
    const { errors } = formState;

    const [isRoot, setIsRoot] = useState(false);
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);

    useEffect(async () => {
        setIsRoot(auth.role == 'root' ? true : false);
    }, [auth]);

    async function onCreate() {
        let dataUser = user;
        if (imageUpload) {
            const img = await uploadAvatar(imageUpload);
            if (!img) return;
            dataUser = { ...user, avatarImage: img.data.streamPath };
        }
        console.log(dataUser);
        const data = await createUser(dataUser);
        if (!data) {
            return;
        }
        openNotification(notiType.success, 'Tạo mới thành công !');
        router.push('/users');
    }

    async function createUser(body) {
        console.log('body', body);
        const { data } = await serviceHelpers.createData('users', body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function uploadAvatar(image) {
        const { data } = await serviceHelpers.uploadFile('users', image);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode <= 404 && data.statusCode >= 401) {
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
            phone: e.target.value.toString(),
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

    async function handleChangePassword(e) {
        e.preventDefault();
        setUser({
            ...user,
            password: e.target.value,
        });
    }

    async function handleChangeCfPassword(e) {
        e.preventDefault();
        setUser({
            ...user,
            confirmPassword: e.target.value,
        });
    }

    async function uploadToClient(e) {
        if (e.target.files && e.target.files[0]) {
            const i = e.target.files[0];
            setCreateObjectURL(URL.createObjectURL(i));
            setImageUpload(i);
        }
    }

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <img src={avatarImg(createObjectURL)} className="object-contain h-16 w-16 bg-white rounded-full border mr-4" alt="..."></img>{' '}
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">{checkNull(user.fullName)}</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <div className="w-full px-4 2xl:flex mt-4 mb-6 h-full">
                        <div className="2xl:w-3/12 w-4/12 px-4 h-full mt-4">
                            <div className="w-full flex justify-center">
                                <img
                                    alt="..."
                                    src={avatarImg(createObjectURL)}
                                    className=" object-contain shadow-xl rounded-full border 2xl:w-40 2xl:h-40 w-40 h-40"
                                />
                            </div>
                            <div className="w-full flex justify-center mt-4">
                                <label
                                    htmlFor="upload"
                                    className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                >
                                    Thay đổi ảnh đại diện
                                </label>
                            </div>
                            <input name="upload" id="upload" className="upload" type="file" onChange={uploadToClient} />
                        </div>
                        <div className="2xl:w-9/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Số điện thoại: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('phone')}
                                            value={checkNull(user.phone, '')}
                                            onChange={handleChangePhone}
                                            type="text"
                                            placeholder="0123456789"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.phone?.message}</div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Mật khẩu: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('password')}
                                            value={checkNull(user.password, '')}
                                            onChange={handleChangePassword}
                                            type="password"
                                            placeholder="password"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.password?.message}</div>
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
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Nhập lại mật khẩu: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('confirmPassword')}
                                            value={checkNull(user.confirmPassword, '')}
                                            onChange={handleChangeCfPassword}
                                            type="password"
                                            placeholder="confirm password"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.confirmPassword?.message}</div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-4 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Họ và tên đệm: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('firstName')}
                                            value={checkNull(user.firstName, '')}
                                            onChange={handleChangeFirstName}
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Nguyễn Bá"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.firstName?.message}</div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-4 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Tên: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('lastName')}
                                            value={checkNull(user.lastName, '')}
                                            onChange={handleChangeLastName}
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Sơn"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.lastName?.message}</div>
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
                                    onClick={handleSubmit(onCreate)}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
