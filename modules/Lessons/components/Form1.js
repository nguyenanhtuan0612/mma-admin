import { UploadOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
import { Button, Upload } from 'antd';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { notiType, openNotification, serviceHelpers } from 'helpers';
const { mediaURL } = serviceHelpers;
import { AuthContext } from 'layouts/Admin';
import { loadingFalse, loadingTrue } from 'store/actions';

export default function Form1({ pState, setState, courseName }) {
    const [load, dispatch] = useContext(AuthContext);
    const router = useRouter();

    async function uploadVideo(file, onSuccess, onError, field) {
        dispatch(loadingTrue());
        let oldDur = 0;
        if (pState[field]) {
            const rs1 = await serviceHelpers.detailFile(pState[field]);
            if (!rs1) return openNotification(notiType.error, 'Lỗi hệ thống');
            const data1 = rs1.data;

            if (data1.statusCode === 400) {
                openNotification(notiType.error, 'Lỗi hệ thống', data.message);
                return onError(data.message);
            }
            if (data1.statusCode === 404) {
                router.push('/auth/login');
                return <div></div>;
            }
            oldDur = data1.data.data.duration;
        }
        const rs = await serviceHelpers.uploadFile('/lessons/videos', file);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs.data;

        if (data.statusCode === 400) {
            dispatch(loadingFalse());
            openNotification(notiType.error, 'Lỗi hệ thống', data.message);
            return onError(data.message);
        }
        if (data.statusCode === 413) {
            dispatch(loadingFalse());
            openNotification(notiType.error, 'Lỗi hệ thống', data.message);
            return onError(data.message);
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        setState({
            ...pState,
            [field]: mediaURL + data.data.streamPath,
            [field + 'Info']: [
                {
                    name: data.data.originalname,
                    url: mediaURL + data.data.streamPath,
                },
            ],
            duration: pState.duration + data.data.duration - oldDur,
        });
        dispatch(loadingFalse());
        return onSuccess();
    }

    async function deleteVideo(field) {
        const rs1 = await serviceHelpers.deleteFile(pState[field]);
        if (!rs1) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data1 = rs1.data;

        if (data1.statusCode === 400) {
            openNotification(notiType.error, 'Lỗi hệ thống', data1.message);
            return onError(data1.message);
        }
        if (data1.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        const oldDur = data1.data.data.duration;
        setState({
            ...pState,
            [field]: null,
            [field + 'Info']: [],
            duration: pState.duration - oldDur,
        });
    }

    async function createListQuestions(e, field, node) {
        e.preventDefault();
        const examName = `List câu hỏi nút ${node} của bài học: ${pState.name} - Khóa: ${courseName}`;
        const rs = await serviceHelpers.createData('exams', { name: examName, lessonId: pState.id });
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs.data;

        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        console.log(data.data.id);
        const rs1 = await serviceHelpers.updateData('lessons', pState.id, { ...pState, [field]: data.data.id });
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data1 = rs1.data;

        if (data1.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data1.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }

        router.push(`/exams/${data.data.id}?&ref=${router.asPath}`, `/exams/${data.data.id}?&ref=${router.asPath}`);
    }

    async function deleteListQuestions(e, field) {
        e.preventDefault();
        const rs = await serviceHelpers.deleteData('exams', pState[field]);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs.data;

        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        setState({ ...pState, [field]: null });
        return true;
    }

    return (
        <div className="relative min-w-0 w-full mb-6 bg-white justify-center">
            <div className="flex w-full">
                <div className="ml-2 w-6/12 mb-8 px-3">
                    <span className="text-xl font-semibold leading-normal text-blueGray-700">Nút 1</span>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 1.1:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
                            <button
                                onClick={e => createListQuestions(e, 'examNode11', '1.1')}
                                hidden={pState.examNode11 ? true : false}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                hidden={pState.examNode11 ? false : true}
                                onClick={() => router.push(`/exams/${pState.examNode11}`)}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                hidden={pState.examNode11 ? false : true}
                                onClick={e => deleteListQuestions(e, 'examNode11')}
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video tổng quan nút 1.2:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload
                                fileList={pState.videoNode12 ? pState.videoNode12Info : []}
                                customRequest={({ file, onSuccess, onError }) => uploadVideo(file, onSuccess, onError, 'videoNode12')}
                                onRemove={() => deleteVideo('videoNode12')}
                            >
                                <Button hidden={pState.videoNode12 ? true : false} icon={<UploadOutlined />}>
                                    Chọn file
                                </Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={pState.videoNode12 ? false : true}>
                                <ReactPlayer url={pState.videoNode12} width="100%" height="auto" controls />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 1.3:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
                            <button
                                onClick={e => createListQuestions(e, 'examNode13', '1.3')}
                                hidden={pState.examNode13 ? true : false}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                hidden={pState.examNode13 ? false : true}
                                onClick={() => router.push(`/exams/${pState.examNode13}`)}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                hidden={pState.examNode13 ? false : true}
                                onClick={e => deleteListQuestions(e, 'examNode13')}
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                </div>
                <div className="ml-2 w-6/12 mb-8 px-3">
                    <span className="text-xl font-semibold leading-normal text-blueGray-700">Nút 2</span>
                    <div className="w-full mb-2 opacity-0">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Câu hỏi nhanh nút 1.1:</span>
                        <div className="w-full px-6 flex mt-2 mb-2">
                            <button
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video hướng dẫn nút 2.1:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload
                                fileList={pState.videoNode21 ? pState.videoNode21Info : []}
                                customRequest={({ file, onSuccess, onError }) => uploadVideo(file, onSuccess, onError, 'videoNode21')}
                                onRemove={() => deleteVideo('videoNode21')}
                            >
                                <Button hidden={pState.videoNode21 ? true : false} icon={<UploadOutlined />}>
                                    Chọn file
                                </Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={pState.videoNode21 ? false : true}>
                                <ReactPlayer url={pState.videoNode21} width="100%" height="auto" controls />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full">
                <div className="ml-2 w-6/12 mb-8 px-3">
                    <span className="text-xl font-semibold leading-normal text-blueGray-700">Nút 3</span>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video kết nối kiến thức nút 3.1:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload
                                fileList={pState.videoNode31 ? pState.videoNode31Info : []}
                                customRequest={({ file, onSuccess, onError }) => uploadVideo(file, onSuccess, onError, 'videoNode31')}
                                onRemove={() => deleteVideo('videoNode31')}
                            >
                                <Button hidden={pState.videoNode31 ? true : false} icon={<UploadOutlined />}>
                                    Chọn file
                                </Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={pState.videoNode31 ? false : true}>
                                <ReactPlayer url={pState.videoNode31} width="100%" height="auto" controls />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 3.2:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
                            <button
                                onClick={e => createListQuestions(e, 'examNode32', '3.2')}
                                hidden={pState.examNode32 ? true : false}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                hidden={pState.examNode32 ? false : true}
                                onClick={() =>
                                    router.push(
                                        `/exams/${pState.examNode32}?&ref=${router.asPath}`,
                                        `/exams/${pState.examNode32}?&ref=${router.asPath}`,
                                    )
                                }
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                hidden={pState.examNode32 ? false : true}
                                onClick={e => deleteListQuestions(e, 'examNode32')}
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video kết nối kiến thức nút 3.3:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload
                                fileList={pState.videoNode33 ? pState.videoNode33Info : []}
                                customRequest={({ file, onSuccess, onError }) => uploadVideo(file, onSuccess, onError, 'videoNode33')}
                                onRemove={() => deleteVideo('videoNode33')}
                            >
                                <Button hidden={pState.videoNode33 ? true : false} icon={<UploadOutlined />}>
                                    Chọn file
                                </Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={pState.videoNode33 ? false : true}>
                                <ReactPlayer url={pState.videoNode33} width="100%" height="auto" controls />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 3.4:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
                            <button
                                onClick={e => createListQuestions(e, 'examNode34', '3.4')}
                                hidden={pState.examNode34 ? true : false}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                hidden={pState.examNode34 ? false : true}
                                onClick={() =>
                                    router.push(
                                        `/exams/${pState.examNode34}?&ref=${router.asPath}`,
                                        `/exams/${pState.examNode34}?&ref=${router.asPath}`,
                                    )
                                }
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                hidden={pState.examNode34 ? false : true}
                                onClick={e => deleteListQuestions(e, 'examNode34')}
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                </div>
                <div className="ml-2 w-6/12 mb-8 px-3">
                    <span className="text-xl font-semibold leading-normal text-blueGray-700">Nút 4</span>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video kết nối kiến thức nút 4.1:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload
                                fileList={pState.videoNode41 ? pState.videoNode41Info : []}
                                customRequest={({ file, onSuccess, onError }) => uploadVideo(file, onSuccess, onError, 'videoNode41')}
                                onRemove={() => deleteVideo('videoNode41')}
                            >
                                <Button hidden={pState.videoNode41 ? true : false} icon={<UploadOutlined />}>
                                    Chọn file
                                </Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={pState.videoNode41 ? false : true}>
                                <ReactPlayer url={pState.videoNode41} width="100%" height="auto" controls />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 4.2:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
                            <button
                                onClick={e => createListQuestions(e, 'examNode42', '4.2')}
                                hidden={pState.examNode42 ? true : false}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                hidden={pState.examNode42 ? false : true}
                                onClick={() =>
                                    router.push(
                                        `/exams/${pState.examNode42}?&ref=${router.asPath}`,
                                        `/exams/${pState.examNode42}?&ref=${router.asPath}`,
                                    )
                                }
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                hidden={pState.examNode42 ? false : true}
                                onClick={e => deleteListQuestions(e, 'examNode42')}
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video kết nối kiến thức nút 4.3:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload
                                fileList={pState.videoNode42 ? pState.videoNode42Info : []}
                                customRequest={({ file, onSuccess, onError }) => uploadVideo(file, onSuccess, onError, 'videoNode42')}
                                onRemove={() => deleteVideo('videoNode42')}
                            >
                                <Button hidden={pState.videoNode42 ? true : false} icon={<UploadOutlined />}>
                                    Chọn file
                                </Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={pState.videoNode42 ? false : true}>
                                <ReactPlayer url={pState.videoNode42} width="100%" height="auto" controls />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2 ">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 4.4:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
                            <button
                                onClick={e => createListQuestions(e, 'examNode44', '4.4')}
                                hidden={pState.examNode44 ? true : false}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                hidden={pState.examNode44 ? false : true}
                                onClick={() =>
                                    router.push(
                                        `/exams/${pState.examNode44}?&ref=${router.asPath}`,
                                        `/exams/${pState.examNode44}?&ref=${router.asPath}`,
                                    )
                                }
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                hidden={pState.examNode44 ? false : true}
                                onClick={e => deleteListQuestions(e, 'examNode44')}
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full">
                <div className="ml-2 w-6/12 mb-8 px-3">
                    <span className="text-xl  font-semibold leading-normal text-blueGray-700">Nút 5</span>
                    <div className="w-full mt-2">
                        <button
                            className="bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                            type="button"
                        >
                            Quản lý kho câu hỏi
                        </button>
                    </div>
                    <div className="w-full">
                        <div className="relative w-full mb-3 items-center flex">
                            <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold  mr-2">Câu hỏi dễ:</label>
                            <span className="w-8/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs font-bold">15</span>
                        </div>
                        <div className="relative w-full mb-3 items-center flex">
                            <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold  mr-2">Câu hỏi trung bình:</label>
                            <span className="w-8/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs font-bold">10</span>
                        </div>
                        <div className="relative w-full mb-3 items-center flex">
                            <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold mr-2">Câu hỏi khó:</label>
                            <span className="w-8/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs font-bold">5</span>
                        </div>
                    </div>
                </div>
                <div className="ml-2 w-6/12 mb-8 px-3">
                    <span className="text-xl font-semibold leading-normal text-blueGray-700">Nút 6</span>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 6.1:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
                            <button
                                onClick={e => createListQuestions(e, 'examNode61', '6.1')}
                                hidden={pState.examNode61 ? true : false}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                hidden={pState.examNode61 ? false : true}
                                onClick={() =>
                                    router.push(
                                        `/exams/${pState.examNode61}?&ref=${router.asPath}`,
                                        `/exams/${pState.examNode61}?&ref=${router.asPath}`,
                                    )
                                }
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                hidden={pState.examNode61 ? false : true}
                                onClick={e => deleteListQuestions(e, 'examNode61')}
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 6.2:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
                            <button
                                onClick={e => createListQuestions(e, 'examNode62', '6.2')}
                                hidden={pState.examNode62 ? true : false}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                hidden={pState.examNode62 ? false : true}
                                onClick={() =>
                                    router.push(
                                        `/exams/${pState.examNode62}?&ref=${router.asPath}`,
                                        `/exams/${pState.examNode62}?&ref=${router.asPath}`,
                                    )
                                }
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                hidden={pState.examNode62 ? false : true}
                                onClick={e => deleteListQuestions(e, 'examNode62')}
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video giá trị cuộc sống 6.3:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload
                                fileList={pState.videoNode63 ? pState.videoNode63Info : []}
                                customRequest={({ file, onSuccess, onError }) => uploadVideo(file, onSuccess, onError, 'videoNode63')}
                                onRemove={() => deleteVideo('videoNode63')}
                            >
                                <Button hidden={pState.videoNode63 ? true : false} icon={<UploadOutlined />}>
                                    Chọn file
                                </Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={pState.videoNode63 ? false : true}>
                                <ReactPlayer url={pState.videoNode63} width="100%" height="auto" controls />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2 ">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 6.4:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
                            <button
                                onClick={e => createListQuestions(e, 'examNode64', '6.4')}
                                hidden={pState.examNode64 ? true : false}
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Tạo mới
                            </button>
                            <button
                                hidden={pState.examNode64 ? false : true}
                                onClick={() =>
                                    router.push(
                                        `/exams/${pState.examNode64}?&ref=${router.asPath}`,
                                        `/exams/${pState.examNode64}?&ref=${router.asPath}`,
                                    )
                                }
                                className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                hidden={pState.examNode64 ? false : true}
                                onClick={e => deleteListQuestions(e, 'examNode64')}
                                className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
