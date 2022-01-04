import React, { useContext, useEffect, useState } from 'react';
import Detail from './components/Detail';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { Modal } from 'antd';
import { AuthContext } from 'layouts/Admin';

const { confirm } = Modal;
const { checkNull, avatarImg, formatCurrency } = displayHelpers;

export default function CourseDetail() {
    const router = useRouter();
    const { id } = router.query;

    const auth = useContext(AuthContext);
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [state, setState] = useState({
        name: null,
        amount: null,
        amountStr: null,
        class: null,
        active: true,
        avatar: null,
        description: null,
        condition: null,
        detail: null,
        targetStudent: null,
        result: null,
        teacherIds: [],
        teacherDeactive: [],
        teacher: [],
    });

    useEffect(async () => {
        const data = await getDetail(id);
        if (!data) {
            return;
        }
        const teacherIds = [];
        const teacherDeactive = [];
        data.data.teacher.map(t => {
            if (t.teacher.active === true) {
                teacherIds.push(t.teacher.id);
            } else {
                teacherDeactive.push(t.teacher.id);
            }
        });
        const amountStr = data.data.amount == '' ? null : formatCurrency(data.data.amount);
        setState({
            ...data.data,
            teacherIds,
            amountStr,
            teacherDeactive,
        });
        setCreateObjectURL(data.data.avatar);
    }, []);

    function onDelete(id) {
        const role = auth.role;
        confirm({
            title: 'Bạn muốn xóa khoá học này?',
            content: 'Lưu ý nếu bạn xóa thì mọi thông tin, khóa học, bài học liên quan đều sẽ bị mất.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                if (role && role == 'root') {
                    const data = await deleteData(id);
                    if (!data) {
                        return;
                    }
                    openNotification(notiType.success, 'Thành công', 'Xoá người dùng thành công');
                    router.push('/courses');
                } else {
                    return openNotification(notiType.warning, 'Không thành công', 'Bạn không có quyền xoá người dùng');
                }
            },
            onCancel() {},
        });
    }

    async function onUpdate() {
        let dataUser = { ...state, teacherIds: [...state.teacherIds, ...state.teacherDeactive] };
        if (dataUser.teacherIds.length == 0) return openNotification(notiType.error, 'Lỗi', 'Khoá học chưa có giáo viên');
        if (imageUpload) {
            const img = await uploadAvatar(imageUpload);
            if (!img) return;
            dataUser = { ...state, avatar: img.data.streamPath };
        }
        const data = await update(dataUser);
        if (!data) {
            return;
        }
        openNotification(notiType.success, 'Cập nhật khoá học thành công !');
    }

    async function update(body) {
        const { data } = await serviceHelpers.updateData('courses', id, body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function uploadAvatar(image) {
        const { data } = await serviceHelpers.uploadFile('courses', image);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function deleteData(id) {
        const { data } = await serviceHelpers.deleteData('courses', id);
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
        const { data } = await serviceHelpers.detailData('courses', id);
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
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">{checkNull(state.name)}</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <div className="flex flex-wrap">
                        <Detail
                            state={state}
                            onDelete={onDelete}
                            setState={setState}
                            createObjectURL={createObjectURL}
                            imageUpload={imageUpload}
                            uploadToClient={uploadToClient}
                            onUpdate={onUpdate}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
