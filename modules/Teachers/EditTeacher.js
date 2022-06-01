import React, { useContext, useEffect, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { Modal } from 'antd';

const { confirm } = Modal;
const { checkNull, avatarImg, checkSelect } = displayHelpers;

export default function EditTeacher() {
    const router = useRouter();
    const { id } = router.query;

    const [data, setData] = useState({
        name: '',
        workPlace: '',
        avatar: '',
        active: true,
        gender: 'female',
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
        const { data } = await serviceHelpers.detailData('teachers', id);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            console.log(data.message);
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
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
            uploadData = { ...data, avatar: img.data.streamPath };
        }
        const rs = await update(uploadData);
        if (!rs) {
            return;
        }
        openNotification(notiType.success, 'Tạo mới thành công !');
        router.push('/teachers');
    }

    function onDelete() {
        confirm({
            title: 'Bạn muốn xóa giáo viên này?',
            content: 'Lưu ý nếu bạn xóa thì mọi thông tin của giáo viên sẽ bị mất.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                const data = await deleteData(id);
                if (!data) {
                    return;
                }
                openNotification(notiType.success, 'Thành công', 'Xoá giáo viên thành công');
                router.push('/teachers');
            },
            onCancel() {},
        });
    }

    async function deleteData(id) {
        const { data } = await serviceHelpers.deleteData('teachers', id);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            console.log(data.message);
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function update(body) {
        const { data } = await serviceHelpers.updateData('teachers', id, body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400)
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function uploadAvatar(image) {
        const { data } = await serviceHelpers.uploadFile('teachers', image);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400)
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode <= 404 && data.statusCode >= 401) {
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

    async function handleChangeGender(e) {
        e.preventDefault();
        setData({
            ...data,
            gender: e.target.value,
        });
    }

    async function handleChangeWP(e) {
        e.preventDefault();
        setData({
            ...data,
            workPlace: e.target.value,
        });
        console.log(data);
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
                <div
                    className={
                        'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'
                    }
                >
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <img
                            src={avatarImg(createObjectURL)}
                            className="object-cover h-16 w-16 bg-white rounded-full border mr-4"
                            alt="..."
                        ></img>{' '}
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">
                            {checkNull(data.name)}
                        </b>
                    </div>
                </div>
                <div
                    className={
                        'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'
                    }
                >
                    <div className="w-full px-4 2xl:flex mt-4 mb-6 h-full">
                        <div className="2xl:w-3/12 w-4/12 px-4 h-full mt-4">
                            <div className="w-full flex justify-center">
                                <img
                                    alt="..."
                                    src={avatarImg(createObjectURL)}
                                    className=" object-cover shadow-xl rounded-full border 2xl:w-40 2xl:h-40 w-40 h-40"
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
                            <input
                                name="upload"
                                id="upload"
                                className="upload"
                                type="file"
                                onChange={uploadToClient}
                            />
                        </div>
                        <div className="2xl:w-9/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Họ và tên: <span className="text-red-500">*</span>
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
                                            Nơi làm việc: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={checkNull(data.workPlace, '')}
                                            onChange={handleChangeWP}
                                            type="text"
                                            placeholder="MMA Thanh Xuân"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">
                                        {data.workPlace === '' ? 'Họ tên là bắt buộc' : null}
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Trạng thái:
                                        </label>
                                        <select
                                            value={checkSelect(data.active)}
                                            onChange={handleChangeActive}
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value="true">Hoạt động</option>
                                            <option value="false">Vô hiệu</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Trạng thái:
                                        </label>
                                        <select
                                            value={checkSelect(data.gender)}
                                            onChange={handleChangeGender}
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value="female">Nữ (Cô)</option>
                                            <option value="male">Nam (Thầy)</option>
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
                                <button
                                    className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={onDelete}
                                >
                                    Xoá giáo viên
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
