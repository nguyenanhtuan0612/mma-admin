import React, { useContext, useEffect, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { Modal, Select } from 'antd';

const { Option } = Select;
const { confirm } = Modal;
const { checkNull, avatarImg, checkSelect, dateFormat } = displayHelpers;

export default function EditPromotions() {
    const router = useRouter();
    const id = router.query.id;
    const [data, setData] = useState({
        name: '',
        courseId: null,
        active: true,
        discount: null,
        applyFrom: new Date(),
        applyTo: new Date(),
    });
    const [courseList, setCourseList] = useState([]);

    useEffect(async () => {
        const courseLst = await exportData();
        const data = await getDetail(id);
        setData(data.data);
        setCourseList(
            courseLst.data.rows.map(course => {
                return (
                    <Option key={course.id} value={course.id}>
                        {course.name}
                    </Option>
                );
            }),
        );
    }, []);

    async function getDetail(id) {
        const { data } = await serviceHelpers.detailData('promotions', id);
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

    async function exportData(active = '', search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [];
        if (active != '') {
            filter.push({
                operator: `eq`,
                value: `${active}`,
                property: `active`,
            });
        }
        if (search != '') {
            filter.push({
                operator: 'iLike',
                value: `${search}`,
                property: `name`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.exportData('courses', strFilter, sort, start, 10);
        return data;
    }

    async function onUpdate() {
        let uploadData = data;
        const rs = await update(uploadData);
        if (!rs) {
            return;
        }
        openNotification(notiType.success, 'Chỉnh sửa thành công !');
        router.push('/promotions');
    }

    async function update(body) {
        const { data } = await serviceHelpers.updateData('promotions', id, body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

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

    async function handleChangeDiscount(e) {
        e.preventDefault();
        setData({
            ...data,
            discount: parseInt(e.target.value),
        });
    }

    async function handleChangeActive(e) {
        e.preventDefault();
        setData({
            ...data,
            active: e.target.value === 'true' ? true : false,
        });
    }

    async function handleChangeApplyFrom(e) {
        e.preventDefault();
        setData({
            ...data,
            applyFrom: e.target.value,
        });
    }

    async function handleChangeApplyTo(e) {
        e.preventDefault();
        setData({
            ...data,
            applyTo: e.target.value,
        });
    }

    function handleCourseIdsChange(value) {
        setData({
            ...data,
            courseId: value,
        });
    }

    function onDelete(id) {
        confirm({
            title: 'Bạn muốn xóa khuyến mại này?',
            content: 'Lưu ý nếu bạn xóa thì mọi thông tin, khóa học, bài học liên quan đến khuyến mại sẽ bị mất.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                const data = await deleteData(id);
                if (!data) {
                    return;
                }
                openNotification(notiType.success, 'Thành công', 'Xoá khuyến mại thành công');
                router.push('/promotions');
            },
            onCancel() {},
        });
    }

    async function deleteData(id) {
        const { data } = await serviceHelpers.deleteData('promotions', id);
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

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
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
                                            Tên khuyến mại: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={checkNull(data.name, '')}
                                            onChange={handleChangeName}
                                            type="text"
                                            placeholder="Nguyễn Bá Sơn"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Khóa học: <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-8/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                                <Select
                                                    allowClear
                                                    style={{ width: '100%' }}
                                                    placeholder="Please select"
                                                    value={data.courseId}
                                                    onChange={handleCourseIdsChange}
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {courseList}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Mức khuyến mại(%): <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={checkNull(data.discount, '')}
                                            onChange={handleChangeDiscount}
                                            type="number"
                                            placeholder="30"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Trạng thái:</label>
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
                                            Áp dụng từ ngày: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={dateFormat(data.applyFrom)}
                                            onChange={handleChangeApplyFrom}
                                            type="date"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Áp dụng đến ngày: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={dateFormat(data.applyTo)}
                                            onChange={handleChangeApplyTo}
                                            type="date"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-6 flex items-center mt-2 justify-center">
                                <button
                                    className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => onDelete(id)}
                                >
                                    Xoá
                                </button>
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
