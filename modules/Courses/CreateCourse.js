import React, { useContext, useEffect, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { AuthContext } from 'layouts/Admin';
import { Select } from 'antd';

const { Option } = Select;
const { checkNull, avatarImg, checkSelect, formatCurrency } = displayHelpers;

export default function CreateCourse() {
    const router = useRouter();

    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [teacherList, SetTeacherList] = useState([]);

    const [state, setState] = useState({
        name: null,
        amount: null,
        amountStr: null,
        class: null,
        active: true,
        avatarImage: null,
        description: null,
        condition: null,
        detail: null,
        targetStudent: null,
        result: null,
        teacherIds: [],
    });

    useEffect(async () => {
        const data = await getData();
        SetTeacherList(
            data.data.rows.map(teacher => {
                return (
                    <Option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                    </Option>
                );
            }),
        );
    }, []);

    async function getData(
        search = '',
        start = 0,
        sort = '[{"property":"createdAt","direction":"ASC"}]',
    ) {
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
        const { data } = await serviceHelpers.getListData('teachers', strFilter, sort, start, 10);
        return data;
    }

    async function onCreate() {
        let dataUser = state;
        if (dataUser.teacherIds.length == 0)
            return openNotification(notiType.error, 'Lỗi', 'Khoá học chưa có giáo viên');
        if (imageUpload) {
            const img = await uploadAvatar(imageUpload);
            if (!img) return;
            dataUser = { ...state, avatar: img.data.streamPath };
        }
        const data = await createCourse(dataUser);
        if (!data) {
            return;
        }
        openNotification(notiType.success, 'Tạo mới thành công !');
        router.push('/courses');
    }

    async function createCourse(body) {
        const { data } = await serviceHelpers.createData('courses', body);
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
        const { data } = await serviceHelpers.uploadFile('courses', image);
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
        setState({
            ...state,
            name: e.target.value == '' ? null : e.target.value,
        });
    }

    async function handleChangeAmount(e) {
        e.preventDefault();
        setState({
            ...state,
            amount: e.target.value == '' ? null : parseInt(e.target.value),
            amountStr: e.target.value == '' ? null : formatCurrency(parseInt(e.target.value)),
        });
    }

    async function handleChangeClass(e) {
        e.preventDefault();
        setState({
            ...state,
            class: e.target.value == '' ? null : parseInt(e.target.value),
        });
    }

    async function handleChangeDescription(e) {
        e.preventDefault();
        setState({
            ...state,
            description: e.target.value == '' ? null : e.target.value,
        });
    }

    async function handleChangeDetail(e) {
        e.preventDefault();
        setState({
            ...state,
            detail: e.target.value == '' ? null : e.target.value,
        });
    }

    async function handleChangeCondition(e) {
        e.preventDefault();
        setState({
            ...state,
            condition: e.target.value == '' ? null : e.target.value,
        });
    }

    async function handleChangeTarget(e) {
        e.preventDefault();
        setState({
            ...state,
            targetStudent: e.target.value == '' ? null : e.target.value,
        });
    }

    async function handleChangeResult(e) {
        e.preventDefault();
        setState({
            ...state,
            result: e.target.value == '' ? null : e.target.value,
        });
    }

    async function uploadToClient(e) {
        if (e.target.files && e.target.files[0]) {
            const i = e.target.files[0];
            setCreateObjectURL(URL.createObjectURL(i));
            setImageUpload(i);
        }
    }

    async function onFocusAmount(e) {
        e.target.value = state.amount;
    }

    async function onBlurAmount(e) {
        e.target.value = checkNull(state.amountStr, '');
    }

    function handleTeacherIdsChange(value) {
        setState({
            ...state,
            teacherIds: [...value],
        });
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
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">
                            {checkNull(state.name)}
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
                                    src={avatarImg(createObjectURL, '/img/empty.jpeg')}
                                    className=" object-contain shadow-xl border 2xl:w-40 2xl:h-40 w-40 h-40"
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
                        <div className="2xl:w-6/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Tên khoá học: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={checkNull(state.name, '')}
                                            onChange={handleChangeName}
                                            type="text"
                                            placeholder="Tên khoá học"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Mô tả khoá học: <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={checkNull(state.description, '')}
                                            onChange={handleChangeDescription}
                                            type="text"
                                            placeholder="Mô tả khoá học"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Về khoá học: <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={checkNull(state.detail, '')}
                                            onChange={handleChangeDetail}
                                            type="text"
                                            placeholder="Chi tiết khoá học"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Điều kiện học: <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={checkNull(state.condition, '')}
                                            onChange={handleChangeCondition}
                                            type="text"
                                            placeholder="Điều kiện học"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Đối tượng học sinh:{' '}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={checkNull(state.targetStudent, '')}
                                            onChange={handleChangeTarget}
                                            type="text"
                                            placeholder="Đối tượng học sinh"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Két quả kì vọng: <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={checkNull(state.result, '')}
                                            onChange={handleChangeResult}
                                            type="text"
                                            placeholder="Két quả kì vọng"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Giá khoá học: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            onFocus={onFocusAmount}
                                            onBlur={onBlurAmount}
                                            onChange={handleChangeAmount}
                                            type="text"
                                            placeholder=""
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Lớp: <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={checkSelect(state.class)}
                                            onChange={handleChangeClass}
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value={null} hidden>
                                                Chưa chọn
                                            </option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Giáo viên: <span className="text-red-500">*</span>
                                        </label>
                                        <div className="w-8/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Please select"
                                                value={state.teacherIds}
                                                onChange={handleTeacherIdsChange}
                                            >
                                                {teacherList}
                                            </Select>
                                        </div>
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
                                    onClick={onCreate}
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
