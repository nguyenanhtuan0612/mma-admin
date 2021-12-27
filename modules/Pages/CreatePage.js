import React, { useContext, useEffect, useRef, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { AuthContext } from 'layouts/Admin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.umd';
import * as Yup from 'yup';
import { Select } from 'antd';

const { Option } = Select;
const { checkNull, avatarImg, dateFormat, checkSelect, formatCurrency, localStringToNumber } = displayHelpers;

export default function CreatePage() {
    const router = useRouter();

    const [isRoot, setIsRoot] = useState(false);

    const auth = useContext(AuthContext);
    const [state, setState] = useState({
        coverImage: '',
        description: '',
        active: true,
        userEmail: '',
        name: '',
    });

    const validationSchema = Yup.object().shape({
        userEmail: Yup.string().required('Email người cần tạo là bắt buộc'),
        name: Yup.string().required('Tên trang là bắt buộc'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    // get functions to build form with useForm() hook
    const { handleSubmit, formState, register } = useForm(formOptions);
    const { errors } = formState;

    useEffect(async () => {
        setIsRoot(auth.role == 'root' ? true : false);
    }, [auth]);

    useEffect(async () => {
        const data = await getData();
    }, []);

    async function getData(search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [
            {
                operator: `eq`,
                value: 'true',
                property: `active`,
            },
        ];
        if (search != '') {
            filter.push({
                operator: 'iLike',
                value: `${search}`,
                property: `name`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.getListData('pages', strFilter, sort, start, 10);
        return data;
    }

    async function onCreate() {
        let dataUser = state;
        const data = await createPage(dataUser);
        if (!data) {
            return;
        }
        openNotification(notiType.success, 'Tạo mới thành công !');
        router.push('/pages');
    }

    async function createPage(body) {
        const { data } = await serviceHelpers.createData('pages/adminCreate', body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function handleCoverImage(e) {
        e.preventDefault();
        setState({
            ...state,
            coverImage: e.target.value,
        });
    }

    async function handleChangeName(e) {
        e.preventDefault();

        setState({
            ...state,
            name: e.target.value,
        });
    }


    async function handleChangeEmail(e) {
        e.preventDefault();

        setState({
            ...state,
            userEmail: e.target.value,
        });
    }

    async function handleChangeActive(e) {
        e.preventDefault();
        setState({
            ...state,
            active: e.target.value === 'true' ? true : false,
        });
    }

    async function handleChangeDescription(e) {
        e.preventDefault();
        setState({
            ...state,
            description: e.target.value,
        });
    }

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">{checkNull(state.name)}</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <div className="w-full px-4 2xl:flex mt-4 mb-6 h-full">
                        <div className="2xl:w-6/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Tên Trang: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('name')}
                                            value={checkNull(state.name, '')}
                                            onChange={handleChangeName}
                                            type="text"
                                            placeholder="Tên trang"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.name?.message}</div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Mô tả trang:</label>
                                        <textarea
                                            value={checkNull(state.description, '')}
                                            onChange={handleChangeDescription}
                                            type="text"
                                            placeholder="Tên khoá học"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-4 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Cover Image:</label>
                                        <input
                                            value={checkNull(state.coverImage, '')}
                                            onChange={handleCoverImage}
                                            type="text"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            placeholder="Nguyễn Bá"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Email người tạo: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('userEmail')}
                                            value={checkNull(state.userEmail, '')}
                                            onChange={handleChangeEmail}
                                            type="email"
                                            placeholder="Email người tạo"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.userEmail?.message}</div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Trạng thái:</label>
                                        <select
                                            value={checkSelect(state.active)}
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
