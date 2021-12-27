import React, { useContext, useEffect, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { Modal } from 'antd';

const { confirm } = Modal;
const { checkNull, avatarImg, checkSelect } = displayHelpers;

export default function EditTag() {
    const router = useRouter();
    const { id } = router.query;

    const [data, setData] = useState({
        name: '',
        slug: '',
        active: true,
    });

    useEffect(async () => {
        const data = await getDetail(id);
        if (!data) {
            return;
        }

        setData(data.data);
        setCreateObjectURL(data.data.avatar);
    }, []);

    async function getDetail(id) {
        const { data } = await serviceHelpers.detailData('tags', id);
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

    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);

    async function onUpdate() {
        let uploadData = data;
        if (imageUpload) {
            const img = await uploadAvatar(imageUpload);
            if (!img) return;
            uploadData = { ...data, avatarImage: img.data.streamPath };
        }
        const rs = await update(uploadData);
        if (!rs) {
            return;
        }
        openNotification(notiType.success, 'cập nhật thành công !');
        router.push('/tags');
    }

    function onDelete() {
        confirm({
            title: 'Ban muon xoa thẻ nay khong?',
            content: 'Lưu ý nếu bạn xóa thì mọi thông tin của thẻ sẽ bị mất.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                const data = await deleteData(id);
                if (!data) {
                    return;
                }
                openNotification(notiType.success, 'Thành công', 'Xoá thẻ thành công');
                router.push('/tags');
            },
            onCancel() {},
        });
    }

    async function deleteData(id) {
        const { data } = await serviceHelpers.deleteData('tags', id);
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

    async function update(body) {
        const { data } = await serviceHelpers.updateData('tags', id, body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function uploadAvatar(image) {
        const { data } = await serviceHelpers.uploadFile('tags', image);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function handleChangeName(e) {
        e.preventDefault();
        setData({
            ...data,
            name: e.target.value,
        });
    }

    async function handleChangeActive(e) {
        e.preventDefault();
        setData({
            ...data,
            active: e.target.value === 'true' ? true : false,
        });
    }

    async function handleChangeWP(e) {
        e.preventDefault();
        setData({
            ...data,
            slug: e.target.value,
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
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">{checkNull(data.name)}</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <div className="w-full px-4 2xl:flex mt-4 mb-6 h-full">
                        <div className="2xl:w-9/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Tag Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={checkNull(data.name, '')}
                                            onChange={handleChangeName}
                                            type="text"
                                            placeholder="Nguyễn Bá Sơn"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">
                                        {data.name === '' ? 'Họ tên là bắt buộc' : null}
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Slug: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={checkNull(data.slug, '')}
                                            onChange={handleChangeWP}
                                            type="text"
                                            placeholder="MMA Thanh Xuân"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">
                                        {data.slug === '' ? 'Họ tên là bắt buộc' : null}
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
                                <button
                                    className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={onDelete}
                                >
                                    Xoá Tag
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
