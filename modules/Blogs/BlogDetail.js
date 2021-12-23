import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import Detail from './components/Detail';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { Modal } from 'antd';
import { AuthContext } from 'layouts/Admin';

const { confirm } = Modal;
const { TabPane } = Tabs;
const { checkNull, avatarImg } = displayHelpers;

export default function UserDetail() {
    const router = useRouter();
    const { id } = router.query;

    const auth = useContext(AuthContext);
    const [blog, setBlog] = useState({});

    function callback(key) {
        console.log(key);
    }

    useEffect(async () => {
        const data = await getDetail(id);

        if (!data) {
            return;
        }
        setBlog(data.data);
    }, [blog]);

    async function getDetail(id) {
        const { data } = await serviceHelpers.detailData('blogs', id);
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

    function onDelete(id) {
        const role = auth.role;
        confirm({
            title: 'Bạn muốn xóa người dùng này?',
            content: 'Lưu ý nếu bạn xóa thì mọi thông tin, khóa học, bài học liên quan đến người dùng sẽ bị mất.',
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
                    router.push('/blogs');
                } else {
                    return openNotification(notiType.warning, 'Không thành công', 'Bạn không có quyền xoá người dùng');
                }
            },
            onCancel() {},
        });
    }

    async function deleteData(id) {
        const { data } = await serviceHelpers.deleteData('blogs', id);
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
        const { data } = await serviceHelpers.detailData('blogs', id);
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

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        {/* <img src={avatarImg(blog.avatarImage)} className="object-contain h-16 w-16 bg-white rounded-full border mr-4" alt="..."></img>{' '} */}
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">{checkNull(blog.title)}</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <Tabs defaultActiveKey="1" onChange={callback} size="large" tabBarStyle={{ fontWeight: 500 }}>
                        <TabPane tab="Thông tin cá nhân" key="1">
                            <Detail blog={blog} onDelete={onDelete} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
