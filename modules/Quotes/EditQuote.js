import React, { useContext, useEffect, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { AuthContext } from 'layouts/Admin';
import { Select,Option } from 'antd';

const { checkNull, avatarImg, checkSelect } = displayHelpers;

export default function EditQuote() {
    const router = useRouter();

    const { id } = router.query;
    const auth = useContext(AuthContext);
    const [state, setState] = useState({
        quote: '',
    });
    const [isRoot, setIsRoot] = useState(false);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    useEffect(async () => {
        const data = await getDetail(id);
        if (!data) {
            return;
        }
        setIsRoot(auth.role == 'root' ? true : false);
        setState(data.data);
        setCreateObjectURL(data.data.avatarImage);
    }, [auth]);

    async function getDetail(id) {
        const { data } = await serviceHelpers.detailData('quotes', id);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
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

        const data = await updateQuote(id, state);
        if (!data) {
            return;
        }
        openNotification(notiType.success, 'Cập nhật thành công !');
        const detail = await getDetail(id);
        if (!detail) {
            return;
        }

        setState(data.data);
        setCreateObjectURL(detail.data.avatarImage);
    }

    async function updateQuote(id, body) {
        const { data } = await serviceHelpers.updateData('quotes', id, body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function handleChangeContent(e) {
        e.preventDefault();
        setState({
            ...state,
            quote: e.target.value,
        });
    }

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <img src={avatarImg(createObjectURL)} className="object-contain h-16 w-16 bg-white rounded-full border mr-4" alt="..."></img>{' '}
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">Edit Quote</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <div className="w-full px-4 2xl:flex mt-4 mb-6 h-full">
                        <div className="2xl:w-9/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Quote :</label>
                                        <textarea
                                            value={checkNull(state.quote, '')}
                                            onChange={handleChangeContent}
                                            type="text"
                                            placeholder="Content"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
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
                    </div>
                </div>
            </div>
        </>
    );
}
