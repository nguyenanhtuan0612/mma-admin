import React, { createRef, useEffect, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { Upload, Button, AutoComplete } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
const { Option } = AutoComplete;
const { checkNull, avatarImg, checkSelect } = displayHelpers;

export default function CreateLesson() {
    const router = useRouter();

    const [result, setResult] = useState([]);
    const [courseName, setCourseName] = useState(null);
    const videoRef = createRef();
    const thumbRef = createRef();
    const courseId = parseInt(router.query.courseId);
    const solveHomeworkVideoRef = createRef();
    const [state, setState] = useState({
        name: null,
        isFree: false,
        courseId: courseId,
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
        const { data } = await getDataCourse(courseId);
        setCourseName(data.data.name);
    }, []);

    async function getDataCourse(id) {
        const rs = await serviceHelpers.detailData('courses', id);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs;

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function onCreate() {
        let lesson = state;
        const data = await CreateLesson(lesson);
        if (!data) {
            return;
        }
        openNotification(notiType.success, 'Tạo mới thành công !');
        router.push(`/courses/${courseId}/lessons`);
    }

    async function CreateLesson(body) {
        const { data } = await serviceHelpers.createData('lessons', body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function uploadDoc({ file, onSuccess, onError }) {
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
        return onSuccess();
    }

    async function uploadHomework({ file, onSuccess, onError }) {
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
        return onSuccess();
    }

    async function uploadSolveHomework({ file, onSuccess, onError }) {
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
        return onSuccess();
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
        await deleteFile(state.documents);
        setState({
            ...state,
            documents: null,
        });
    }

    async function deleteVideo() {
        await deleteFile(state.video);
        videoRef.current.value = null;
        setState({
            ...state,
            video: null,
        });
    }

    async function deleteSolveVideo() {
        await deleteFile(state.solveHomeworkVideo);
        solveHomeworkVideoRef.current.value = null;
        setState({
            ...state,
            solveHomeworkVideo: null,
        });
    }

    async function deleteThumb() {
        await deleteFile(state.thumb);
        thumbRef.current.value = null;
        setState({
            ...state,
            thumb: null,
        });
    }

    async function deleteHomework() {
        await deleteFile(state.homework);
        setState({
            ...state,
            homework: null,
        });
    }

    async function deleteSolveHomework() {
        await deleteFile(state.solveHomeworkDoc);
        setState({
            ...state,
            solveHomeworkDoc: null,
        });
    }

    async function clickBack(e) {
        e.preventDefault();
        if (state.documents) {
            await deleteFile(state.documents);
        }
        if (state.video) {
            await deleteFile(state.video);
        }
        if (state.thumb) {
            await deleteFile(state.thumb);
        }
        if (state.homework) {
            await deleteFile(state.homework);
        }
        if (state.solveHomeworkDoc) {
            await deleteFile(state.solveHomeworkDoc);
        }
        if (state.solveHomeworkVideo) {
            await deleteFile(state.solveHomeworkVideo);
        }
        router.back();
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
                                    <Upload customRequest={uploadDoc} maxCount={1} onRemove={deleteDoc}>
                                        <Button icon={<UploadOutlined />}>Chọn tài liệu</Button>
                                    </Upload>
                                </div>
                            </div>
                            <div className="mb-8">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">File bài tập:</label>
                                <div className="w-full flex items-center mt-2">
                                    <Upload customRequest={uploadHomework} maxCount={1} onRemove={deleteHomework}>
                                        <Button icon={<UploadOutlined />}>Chọn file</Button>
                                    </Upload>
                                </div>
                            </div>
                            <div className="mb-8">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">File giải bài tập:</label>
                                <div className="w-full flex items-center mt-2">
                                    <Upload customRequest={uploadSolveHomework} maxCount={1} onRemove={deleteSolveHomework}>
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
                                    onClick={clickBack}
                                >
                                    Trở về
                                </button>
                                <button
                                    className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={onCreate}
                                >
                                    Tạo mới
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
