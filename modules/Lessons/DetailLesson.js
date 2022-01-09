import React, { createRef, useEffect, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { Upload, Button, AutoComplete, Modal, Popconfirm } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
const { Option } = AutoComplete;
const { confirm } = Modal;
const { checkNull, avatarImg, checkSelect } = displayHelpers;

export default function DetailLesson() {
    const router = useRouter();

    const [result, setResult] = useState([]);
    const [courseName, setCourseName] = useState(null);
    const videoRef = createRef();
    const thumbRef = createRef();
    const Id = parseInt(router.query.id);
    const solveHomeworkVideoRef = createRef();
    const [listDoc, setListDoc] = useState([]);
    const [listHomework, setListHomework] = useState([]);
    const [listSolve, setListSolve] = useState([]);
    const [state, setState] = useState({
        name: null,
        isFree: false,
        courseId: null,
        documents: null,
        homework: null,
        solveHomeworkVideo: null,
        solveHomeworkDoc: null,
        testId: null,
        active: true,
        duration: 0,
        video: null,
        thumb: null,
    });

    useEffect(async () => {
        const { data } = await getData(Id);
        setCourseName(data.data.course.name);
        const stateData = {
            ...state,
            ...data.data,
        };
        console.log(stateData);
        if (data.data.documents) {
            setListDoc([{ url: data.data.documents, name: data.data.docName, status: 'done' }]);
        }
        if (data.data.homework) {
            setListHomework([{ url: data.data.homework, name: data.data.homeworkName, status: 'done' }]);
        }
        if (data.data.homework) {
            setListSolve([{ url: data.data.solveHomeworkDoc, name: data.data.solveName, status: 'done' }]);
        }

        setState(stateData);
    }, []);

    async function getData(id) {
        const rs = await serviceHelpers.detailData('lessons', id);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs;

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function onUpdate() {
        let dataLesson = state;
        const data = await update(dataLesson);
        if (!data) {
            return;
        }
        openNotification(notiType.success, 'Cập nhật bài học thành công !');
    }

    async function update(body) {
        const { data } = await serviceHelpers.updateData('lessons', Id, body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function uploadDoc({ file, onSuccess, onError }) {
        confirm({
            title: 'Bạn muốn thay đổi file này?',
            content: 'Sau khi thay đổi file thông tin bài học sẽ được lưu lại ngay lập tức !!',
            okText: 'Thay đổi',
            okType: 'success',
            cancelText: 'Hủy',
            async onOk() {
                if (state.documents) await deleteFile(state.documents);
                const { data } = await serviceHelpers.uploadFile('lessons/documents', file);
                if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

                if (data.statusCode === 400) {
                    openNotification(notiType.error, 'Lỗi hệ thống', data.message);
                    return onError(data.message);
                }
                if (data.statusCode === 404) {
                    router.push('/auth/login');
                    return <div></div>;
                }
                setState({
                    ...state,
                    documents: data.data.streamPath,
                });
                setListDoc([{ url: data.data.streamPath, name: data.data.originalname, status: 'done' }]);
                await update({
                    ...state,
                    documents: data.data.streamPath,
                });
                return onSuccess();
            },
            onCancel() {},
        });
    }

    async function uploadHomework({ file, onSuccess, onError }) {
        confirm({
            title: 'Bạn muốn thay đổi file này?',
            content: 'Sau khi thay đổi file thông tin bài học sẽ được lưu lại ngay lập tức !!',
            okText: 'Thay đổi',
            okType: 'success',
            cancelText: 'Hủy',
            async onOk() {
                if (state.homework) await deleteFile(state.homework);
                const { data } = await serviceHelpers.uploadFile('lessons/documents', file);
                if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

                if (data.statusCode === 400) {
                    openNotification(notiType.error, 'Lỗi hệ thống', data.message);
                    return onError(data.message);
                }
                if (data.statusCode === 404) {
                    router.push('/auth/login');
                    return <div></div>;
                }
                setState({
                    ...state,
                    homework: data.data.streamPath,
                });
                setListHomework([{ url: data.data.streamPath, name: data.data.originalname, status: 'done' }]);
                return onSuccess();
            },
            onCancel() {},
        });
    }

    async function uploadSolveHomework({ file, onSuccess, onError }) {
        confirm({
            title: 'Bạn muốn thay đổi file này?',
            content: 'Sau khi thay đổi file thông tin bài học sẽ được lưu lại ngay lập tức !!',
            okText: 'Thay đổi',
            okType: 'success',
            cancelText: 'Hủy',
            async onOk() {
                if (state.solveHomeworkDoc) await deleteFile(state.solveHomeworkDoc);
                const { data } = await serviceHelpers.uploadFile('lessons/documents', file);
                if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

                if (data.statusCode === 400) {
                    openNotification(notiType.error, 'Lỗi hệ thống', data.message);
                    return onError(data.message);
                }
                if (data.statusCode === 404) {
                    router.push('/auth/login');
                    return <div></div>;
                }
                setState({
                    ...state,
                    solveHomeworkDoc: data.data.streamPath,
                });
                setListSolve([{ url: data.data.streamPath, name: data.data.originalname, status: 'done' }]);
                return onSuccess();
            },
            onCancel() {},
        });
    }

    async function deleteFile(path) {
        const { data } = await serviceHelpers.deleteFile(path);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return;
    }

    async function handleChangeName(e) {
        e.preventDefault();
        setState({
            ...state,
            name: e.target.value == '' ? null : e.target.value,
        });
    }

    async function handleChangeFree(e) {
        e.preventDefault();
        let value = false;
        if (e.target.value == 'true') value = true;
        setState({
            ...state,
            isFree: value,
        });
    }

    async function handleChangeActive(e) {
        e.preventDefault();
        setState({
            ...state,
            active: e.target.value == '' ? null : e.target.value,
        });
    }

    const handleSearch = value => {
        let res = [];

        if (!value || value.indexOf('@') >= 0) {
            res = [];
        } else {
            res = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
        }

        setResult(res);
    };

    async function uploadVideo(file) {
        const { data } = await serviceHelpers.uploadFile('lessons/videos', file);
        if (!data) {
            videoRef.current.value = null;
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function uploadThumb(file) {
        const { data } = await serviceHelpers.uploadFile('lessons/avatars', file);
        if (!data) {
            videoRef.current.value = null;
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function uploadLessonThumb(e) {
        if (state.thumb) await deleteFile(state.thumb);
        if (e.target.files && e.target.files[0]) {
            const i = e.target.files[0];
            const rs = await uploadThumb(i);
            if (!rs || !rs.data) return;
            const data = rs.data;

            return setState({ ...state, thumb: data.streamPath });
        }
        return openNotification(notiType.error, 'Lỗi hệ thống');
    }

    async function uploadLessonVideo(e) {
        if (state.video) await deleteFile(state.video);
        if (e.target.files && e.target.files[0]) {
            const i = e.target.files[0];
            const rs = await uploadVideo(i);
            if (!rs || !rs.data) return;
            const data = rs.data;

            return setState({ ...state, video: data.streamPath });
        }
        return openNotification(notiType.error, 'Lỗi hệ thống');
    }

    async function uploadLessonSolveVideo(e) {
        if (state.video) await deleteFile(state.video);
        if (e.target.files && e.target.files[0]) {
            const i = e.target.files[0];
            const rs = await uploadVideo(i);
            if (!rs || !rs.data) return;
            const data = rs.data;

            return setState({ ...state, solveHomeworkVideo: data.streamPath });
        }
        return openNotification(notiType.error, 'Lỗi hệ thống');
    }

    async function deleteDoc() {
        confirm({
            title: 'Bạn xóa muốn file này?',
            content: 'Sau khi xóa file thông tin bài học sẽ được lưu lại ngay lập tức !!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                await deleteFile(state.documents);
                setState({
                    ...state,
                    documents: null,
                });
                setListDoc([]);
                await update({
                    ...state,
                    documents: null,
                });
            },
            onCancel() {},
        });
    }

    async function deleteVideo() {
        confirm({
            title: 'Bạn xóa muốn file này?',
            content: 'Sau khi xóa file thông tin bài học sẽ được lưu lại ngay lập tức !!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                await deleteFile(state.video);
                videoRef.current.value = null;
                setState({
                    ...state,
                    video: null,
                });
                await update({
                    ...state,
                    video: null,
                });
            },
            onCancel() {},
        });
    }

    async function deleteSolveVideo() {
        confirm({
            title: 'Bạn xóa muốn file này?',
            content: 'Sau khi xóa file thông tin bài học sẽ được lưu lại ngay lập tức !!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                await deleteFile(state.solveHomeworkVideo);
                solveHomeworkVideoRef.current.value = null;
                setState({
                    ...state,
                    solveHomeworkVideo: null,
                });
                await update({
                    ...state,
                    solveHomeworkVideo: null,
                });
            },
            onCancel() {},
        });
    }

    async function deleteThumb() {
        confirm({
            title: 'Bạn xóa muốn file này?',
            content: 'Sau khi xóa file thông tin bài học sẽ được lưu lại ngay lập tức !!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                await deleteFile(state.thumb);
                thumbRef.current.value = null;
                setState({
                    ...state,
                    thumb: null,
                });
                await update({
                    ...state,
                    thumb: null,
                });
            },
            onCancel() {},
        });
    }

    async function deleteHomework() {
        confirm({
            title: 'Bạn xóa muốn file này?',
            content: 'Sau khi xóa file thông tin bài học sẽ được lưu lại ngay lập tức !!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                await deleteFile(state.homework);
                setState({
                    ...state,
                    homework: null,
                });
                setListHomework([]);
                await update({
                    ...state,
                    homework: null,
                });
            },
            onCancel() {},
        });
    }

    async function deleteSolveHomework() {
        confirm({
            title: 'Bạn xóa muốn file này?',
            content: 'Sau khi xóa file thông tin bài học sẽ được lưu lại ngay lập tức !!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                await deleteFile(state.solveHomeworkDoc);
                setState({
                    ...state,
                    solveHomeworkDoc: null,
                });
                setListSolve([]);
                await update({
                    ...state,
                    solveHomeworkDoc: null,
                });
            },
            onCancel() {},
        });
    }

    function onDelete() {
        confirm({
            title: 'Bạn muốn xóa bài học này?',
            content: 'Lưu ý nếu bạn xóa thì mọi thông tin liên quan đều sẽ bị mất.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                if (state.documents) {
                    console.log('state.documents', state.documents);
                    await deleteFile(state.documents);
                }
                if (state.video) {
                    console.log('state.video', state.video);
                    await deleteFile(state.video);
                }
                if (state.thumb) {
                    console.log('state.thumb', state.thumb);
                    await deleteFile(state.thumb);
                }
                if (state.homework) {
                    console.log('state.homework', state.homework);
                    await deleteFile(state.homework);
                }
                if (state.solveHomeworkDoc) {
                    console.log('state.solveHomeworkDoc', state.solveHomeworkDoc);
                    await deleteFile(state.solveHomeworkDoc);
                }
                if (state.solveHomeworkVideo) {
                    console.log('state.solveHomeworkVideo', state.solveHomeworkVideo);
                    await deleteFile(state.solveHomeworkVideo);
                }
                const data = await deleteData(Id);
                if (!data) {
                    return;
                }
                openNotification(notiType.success, 'Thành công', 'Xoá người dùng thành công');
                router.push(`/courses/${state.courseId}/lessons`);
            },
            onCancel() {},
        });
    }

    async function deleteData(id) {
        const { data } = await serviceHelpers.deleteData('lessons', id);
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
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">{checkNull(state.name)}</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <div className="w-full px-4 2xl:flex mt-4 mb-6 h-full">
                        <div className="2xl:w-4/12 w-6/12 px-4 h-full mt-4">
                            <div className="mb-8">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Video: <span className="text-red-500">*</span>
                                </label>
                                <div className="w-full flex items-center mt-2">
                                    <div className="w-7/12" hidden={state.video ? false : true}>
                                        <ReactPlayer
                                            url={state.video}
                                            width="100%"
                                            height="auto"
                                            controls
                                            config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                                            onContextMenu={e => e.preventDefault()}
                                        />
                                    </div>
                                    <div className="w-5/12">
                                        <label
                                            htmlFor="uploadVideo"
                                            className="mx-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                        >
                                            Chọn video
                                        </label>
                                        <input
                                            ref={videoRef}
                                            name="uploadVideo"
                                            id="uploadVideo"
                                            className="upload"
                                            type="file"
                                            onChange={uploadLessonVideo}
                                        />
                                        <button
                                            onClick={deleteVideo}
                                            hidden={state.video ? false : true}
                                            className="mx-2 mt-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                        >
                                            Xoá video
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Ảnh đầu video (320 x 180): </label>
                                <div className="w-full flex items-center mt-2">
                                    <div className="w-7/12" hidden={state.thumb ? false : true}>
                                        <img
                                            alt="..."
                                            src={avatarImg(state.thumb, '/img/empty.jpeg')}
                                            className=" object-contain shadow-xl border w-full"
                                        />
                                    </div>
                                    <div className="w-5/12">
                                        <label
                                            htmlFor="uploadThumb"
                                            className="mx-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                        >
                                            Chọn ảnh
                                        </label>
                                        <input
                                            ref={thumbRef}
                                            name="uploadThumb"
                                            id="uploadThumb"
                                            className="upload"
                                            type="file"
                                            onChange={uploadLessonThumb}
                                        />
                                        <button
                                            onClick={deleteThumb}
                                            hidden={state.thumb ? false : true}
                                            className="mx-2 mt-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                        >
                                            Xoá ảnh
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-8">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">File tài liệu:</label>
                                <div className="w-full flex items-center mt-2">
                                    <Upload customRequest={uploadDoc} fileList={listDoc} maxCount={1} onRemove={deleteDoc}>
                                        <Button icon={<UploadOutlined />}>Chọn tài liệu</Button>
                                    </Upload>
                                </div>
                            </div>
                            <div className="mb-8">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">File bài tập:</label>
                                <div className="w-full flex items-center mt-2">
                                    <Upload
                                        customRequest={uploadHomework}
                                        fileList={listHomework}
                                        maxCount={1}
                                        onRemove={deleteHomework}
                                        showUploadList
                                    >
                                        <Button icon={<UploadOutlined />}>Chọn file</Button>
                                    </Upload>
                                </div>
                            </div>
                            <div className="mb-8">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">File giải bài tập:</label>
                                <div className="w-full flex items-center mt-2">
                                    <Upload customRequest={uploadSolveHomework} fileList={listSolve} maxCount={1} onRemove={deleteSolveHomework}>
                                        <Button icon={<UploadOutlined />}>Chọn file</Button>
                                    </Upload>
                                </div>
                            </div>
                            <div className="mb-8">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Video: <span className="text-red-500">*</span>
                                </label>
                                <div className="w-full flex items-center mt-2">
                                    <div className="w-7/12" hidden={state.solveHomeworkVideo ? false : true}>
                                        <ReactPlayer
                                            url={state.solveHomeworkVideo}
                                            width="100%"
                                            height="auto"
                                            controls
                                            config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                                            onContextMenu={e => e.preventDefault()}
                                        />
                                    </div>
                                    <div className="w-5/12">
                                        <label
                                            htmlFor="uploadSolveVideo"
                                            className="mx-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                        >
                                            Chọn video
                                        </label>
                                        <input
                                            ref={solveHomeworkVideoRef}
                                            name="uploadSolveVideo"
                                            id="uploadSolveVideo"
                                            className="upload"
                                            type="file"
                                            onChange={uploadLessonSolveVideo}
                                        />
                                        <button
                                            onClick={deleteSolveVideo}
                                            hidden={state.solveHomeworkVideo ? false : true}
                                            className="mx-2 mt-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                        >
                                            Xoá video
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="2xl:w-6/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Khoá học:</label>
                                        <input
                                            disabled
                                            className="w-8/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs border font-bold"
                                            value={checkNull(courseName, '')}
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Tên bài học: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={checkNull(state.name, '')}
                                            onChange={handleChangeName}
                                            type="text"
                                            placeholder="Tên bài học"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Loại bài học: <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={checkSelect(state.isFree)}
                                            onChange={handleChangeFree}
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value="false">Không miễn phí</option>
                                            <option value="true">Miễn phí</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Trạng thái: <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={checkSelect(state.active)}
                                            onChange={handleChangeActive}
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value="true">Hoạt động </option>
                                            <option value="false">Vô hiệu</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Bài kiểm tra:
                                        </label>
                                        <div className="w-8/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                            <AutoComplete disabled onSearch={handleSearch} placeholder="input here" style={{ width: '100%' }}>
                                                {result.map(email => (
                                                    <Option key={email} value={email}>
                                                        {email}
                                                    </Option>
                                                ))}
                                            </AutoComplete>
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
                                    onClick={onUpdate}
                                >
                                    Lưu
                                </button>
                                <button
                                    className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={onDelete}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
