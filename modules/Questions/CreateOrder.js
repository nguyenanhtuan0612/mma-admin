import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { notiType, openNotification, serviceHelpers } from 'helpers';
import { AuthContext } from 'layouts/Admin';
import { useRouter } from 'next/router';
import React, { useState, useContext, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Latex from 'react-latex';
import { loadingFalse, loadingTrue } from 'store/actions';
const { mediaURL } = serviceHelpers;

export default function CreateOrder() {
    const [load, dispatch] = useContext(AuthContext);
    const router = useRouter();
    const lessonId = parseInt(router.query.lessonId);
    const examId = parseInt(router.query.examId);
    const isRandom = router.query.isRandom == 'true' ? true : false;
    const [lesson, setLesson] = useState(null);
    const [state, setState] = useState({
        question: null,
        level: 'easy',
        isRandom: isRandom || false,
        audio: null,
        audioInfo: [],
        image: null,
        imageInfo: [],
        active: true,
        solve: null,
        solveInfo: [],
        typeAnswer: 'text',
    });
    const [zones, setZones] = useState([]);
    const [change, setChange] = useState(false);

    function Zone({ state, data, index, deleteZone, onChangeZone }) {
        const [dt, setDt] = useState(data);
        useEffect(() => {
            setDt(dt);
        }, [state]);

        async function uploadImage(file, onSuccess, onError) {
            dispatch(loadingTrue());
            const rs = await serviceHelpers.uploadFile('/questions', file);
            if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
            const data = rs.data;

            if (data.statusCode === 400) {
                openNotification(notiType.error, 'Lỗi hệ thống', data.message);
                return onError(data.message);
            }
            if (data.statusCode <= 404 && data.statusCode >= 401) {
                router.push('/auth/login');
                return <div></div>;
            }
            console.log(mediaURL + data.data.streamPath);
            setDt({
                ...dt,
                content: mediaURL + data.data.streamPath,
            });
            onChangeZone(index, 'content', mediaURL + data.data.streamPath);
            dispatch(loadingFalse());
            return onSuccess();
        }

        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );

        return (
            <div className="w-full mt-4">
                <div className="w-full flex border-2 p-2">
                    <div className="w-8/12 flex p-2">
                        <div className="w-full px-4 justify-center items-center">
                            <div className="relative w-full items-center flex">
                                <label
                                    hidden={state.typeAnswer === 'text' ? true : false}
                                    className="w-5/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2"
                                >
                                    Nội dung đáp án:
                                </label>
                                <div
                                    className="w-full ml-4"
                                    hidden={state.typeAnswer == 'text' ? false : true}
                                >
                                    <div className="w-full px-4 mb-6">
                                        <div className="relative w-full mb-3 items-center px-4">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Nội dung câu trả lời:{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                onChange={e => {
                                                    e.preventDefault();
                                                    const data = e.target.value;
                                                    setDt({ ...dt, content: data });
                                                    onChangeZone(index, 'content', data);
                                                }}
                                                value={dt.content}
                                                className="w-full px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs border font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full px-4 mb-6">
                                        <div className="relative w-full mb-3 items-center fex px-4">
                                            <label className="w-2/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Xem trước: <span className="text-red-500">*</span>
                                            </label>
                                            <div className="text-base border h-auto w-full p-4">
                                                {state.typeAnswer == 'text'
                                                    ? renderLatex(dt.content)
                                                    : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="w-7/12 ml-4"
                                    hidden={state.typeAnswer == 'image' ? false : true}
                                >
                                    <Upload
                                        listType={dt.content !== '' ? 'picture' : 'picture-card'}
                                        customRequest={({ file, onSuccess, onError }) =>
                                            uploadImage(file, onSuccess, onError)
                                        }
                                        showUploadList={false}
                                    >
                                        {dt.content !== '' ? (
                                            <img
                                                className="border"
                                                src={
                                                    state.typeAnswer == 'image' ? dt.content : null
                                                }
                                                alt="avatar"
                                                style={{ width: '100%' }}
                                            />
                                        ) : (
                                            uploadButton
                                        )}
                                    </Upload>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-2/12 items-center flex p-2 justify-center">
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => deleteZone(index)}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    useEffect(async () => {
        dispatch(loadingTrue());
        const lessonName = await getDetailLesson();
        setLesson(lessonName.name);
        dispatch(loadingFalse());
    }, []);

    useEffect(async () => {
        setZones(zones);
    }, [change]);

    async function getDetailLesson() {
        const rs = await serviceHelpers.detailData('lessons', lessonId);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs;
        if (data.statusCode === 400)
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data.data.data;
    }

    function onChangeState(field, e, type = 'string') {
        e.preventDefault();
        if (field == 'typeAnswer') {
            setZones([]);
        }
        switch (type) {
            case 'boolean': {
                const value = e.target.value == 'true' ? true : false;
                return setState({ ...state, [field]: value });
            }
            default: {
                const value = e.target.value == '' ? null : e.target.value;
                return setState({ ...state, [field]: value });
            }
        }
    }

    async function uploadFile(file, onSuccess, onError, field) {
        dispatch(loadingTrue());
        const rs = await serviceHelpers.uploadFile('/questions', file);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs.data;

        if (data.statusCode === 400) {
            openNotification(notiType.error, 'Lỗi hệ thống', data.message);
            return onError(data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        setState({
            ...state,
            [field]: mediaURL + data.data.streamPath,
            [field + 'Info']: [
                {
                    name: data.data.originalname,
                    url: mediaURL + data.data.streamPath,
                },
            ],
        });
        dispatch(loadingFalse());
        return onSuccess();
    }

    function addZone() {
        const index = zones.length;
        const newZones = [
            ...zones,
            {
                content: '',
            },
        ];
        setZones(newZones);
    }

    function deleteZone(index) {
        const a1 = zones.slice(0, index);
        const a2 = zones.slice(index + 1, zones.length);
        const newZones = a1.concat(a2);
        setZones([...newZones]);
    }

    function onChangeZone(index, field, value) {
        const newZones = zones;
        newZones[index][field] = value;
        setZones(newZones);
    }

    async function deleteFile(field) {
        const rs1 = await serviceHelpers.deleteFile(state[field]);
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
        setState({
            ...state,
            [field]: null,
            [field + 'Info']: [],
        });
    }

    async function onCreate() {
        dispatch(loadingTrue());
        for (const [index, dt] of zones.entries()) {
            dt.order = index;
            if (dt.content == '') {
                dispatch(loadingFalse());
                return openNotification(notiType.error, 'Lỗi hệ thống', 'Thiếu nội dung đáp án');
            }
        }

        const body = { ...state, answers: zones, content: zones, lessonId };
        const rs1 = await serviceHelpers.createData('questions/order', body);
        const data1 = catchErr(rs1);
        if (examId) {
            const exam = catchErr(await serviceHelpers.detailData('exams', examId));
            const arr = exam.data.exam.listQuestions;
            arr.push(data1.data.id);
            catchErr(await serviceHelpers.updateData('exams', examId, { listQuestions: arr }));
            dispatch(loadingFalse());
            return router.push(`/exams/${examId}`, `/exams/${examId}`);
        }
        dispatch(loadingFalse());
        router.push(`/exams?lessonId=${lessonId}`, `/exams?lessonId=${lessonId}`);
    }

    function catchErr(rs) {
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs.data;

        if (data.statusCode === 400) {
            openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    function renderLatex(content) {
        if (content) {
            if (typeof content != 'string') {
                content = content.toString();
            }
            const renderHtml = [];
            const split = content.split('$');
            const htmlArr = [];
            for (let [index, iter] of split.entries()) {
                if (index % 2 == 0) {
                    htmlArr.push(<span>{iter}</span>);
                } else {
                    htmlArr.push(
                        //<span className="text-xl">
                        <Latex>{`$${iter}$`}</Latex>,
                        //</span>,
                    );
                }
            }
            const data = React.createElement(React.Fragment, null, htmlArr);
            return data;
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
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">
                            Tạo câu hỏi sắp xếp
                        </b>
                    </div>
                </div>
                <div
                    className={
                        'relative min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center'
                    }
                >
                    <div className="w-full pt-4 flex">
                        <div className="w-6/12 px-4 mb-6">
                            <div className="relative w-full items-center flex px-4">
                                <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Tên câu hỏi: <span className="text-red-500">*</span>
                                </label>
                                <input
                                    onChange={e => {
                                        onChangeState('name', e);
                                    }}
                                    value={state.name}
                                    className="w-9/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs border font-bold"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex">
                        <div className="w-6/12 px-4 mb-6">
                            <div className="relative w-full mb-3 items-center flex px-4">
                                <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Câu hỏi: <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    onChange={e => {
                                        setState({
                                            ...state,
                                            question: e.target.value == '' ? null : e.target.value,
                                        });
                                    }}
                                    value={state.question}
                                    className="p-2 w-9/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                ></textarea>
                            </div>
                        </div>
                        <div className="w-6/12 px-4 mb-6">
                            <div className="relative w-full mb-3 items-center flex px-4">
                                <label className="w-2/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Xem trước: <span className="text-red-500">*</span>
                                </label>
                                <div className="text-base border h-auto w-full p-4">
                                    {renderLatex(state.question)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex">
                        <div className="w-6/12 px-4 mb-6">
                            <div className="relative w-full mb-3 items-center flex px-4">
                                <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Lời giải: <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    onChange={e => {
                                        setState({
                                            ...state,
                                            solve: e.target.value == '' ? null : e.target.value,
                                        });
                                    }}
                                    value={state.solve}
                                    className="p-2 w-9/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                ></textarea>
                            </div>
                        </div>
                        <div className="w-6/12 px-4 mb-6">
                            <div className="relative w-full mb-3 items-center flex px-4">
                                <label className="w-2/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Xem trước: <span className="text-red-500">*</span>
                                </label>
                                <div className="text-base border h-auto w-full p-4">
                                    {renderLatex(state.solve)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex">
                        <div className="w-6/12 px-4 mb-6">
                            <div className="w-full py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                                <div className="flex flex-wrap w-full">
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Độ khó: <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                onChange={e => {
                                                    onChangeState('level', e);
                                                }}
                                                value={state.level}
                                                className="w-9/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            >
                                                <option value="easy">Dễ</option>
                                                <option value="medium">Trung Bình</option>
                                                <option value="hard">Khó</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full mb-2  px-4"></div>
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Kích hoạt: <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                onChange={e => {
                                                    onChangeState('active', e, 'boolean');
                                                }}
                                                value={state.active}
                                                className="w-9/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            >
                                                <option value="true">Có</option>
                                                <option value="false">Không</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Bài học:
                                            </label>
                                            <input
                                                disabled={true}
                                                value={lesson}
                                                className="w-9/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs border font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-6/12 px-4 mt-4 mb-6">
                            <div className="w-full mb-2  px-4">
                                <div className="relative w-full mb-3 flex">
                                    <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                        Ảnh:
                                    </label>
                                    <div className="px-3 h-auto ">
                                        <Upload
                                            fileList={state.image ? state.imageInfo : []}
                                            customRequest={({ file, onSuccess, onError }) =>
                                                uploadFile(file, onSuccess, onError, 'image')
                                            }
                                            onRemove={() => deleteFile('image')}
                                        >
                                            <Button
                                                hidden={state.image ? true : false}
                                                icon={<UploadOutlined />}
                                            >
                                                Chọn file
                                            </Button>
                                        </Upload>
                                        <div
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                position: 'relative',
                                            }}
                                            hidden={state.image ? false : true}
                                        >
                                            <img
                                                src={state.image}
                                                className="object-contain w-full border-2"
                                                alt="..."
                                            ></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mb-2  px-4">
                                <div className="relative w-full mb-3 flex">
                                    <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                        Audio:
                                    </label>
                                    <div className=" px-3 h-auto ">
                                        <Upload
                                            fileList={state.audio ? state.audioInfo : []}
                                            customRequest={({ file, onSuccess, onError }) =>
                                                uploadFile(file, onSuccess, onError, 'audio')
                                            }
                                            onRemove={() => deleteFile('audio')}
                                        >
                                            <Button
                                                hidden={state.audio ? true : false}
                                                icon={<UploadOutlined />}
                                            >
                                                Chọn file
                                            </Button>
                                        </Upload>
                                        <div
                                            className="w-full mt-2"
                                            hidden={state.audio ? false : true}
                                        >
                                            <ReactAudioPlayer src={state.audio} controls />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-4 mt-4 mb-6">
                        <div className="2xl:w-full">
                            <label className="mx-2 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                Đáp án: <span className="text-red-500">*</span>
                            </label>
                            <div className="w-full">
                                <div className="w-full flex">
                                    <div className="w-6/12 items-center flex">
                                        <label className="w-6/12 text-blueGray-600 2xl:text-sm text-xs font-bold mr-2 text-right">
                                            Định dạng câu trả lời:{' '}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            onChange={e => {
                                                onChangeState('typeAnswer', e);
                                            }}
                                            value={state.typeAnswer}
                                            className="w-6/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value="text">Text</option>
                                            <option value="image">Ảnh</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 w-full">
                                <button
                                    className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={addZone}
                                >
                                    Thêm hàng
                                </button>
                                <div>
                                    {zones && zones.length > 0
                                        ? zones.map((data, index) => {
                                              return (
                                                  <Zone
                                                      onChangeZone={onChangeZone}
                                                      state={state}
                                                      data={data}
                                                      key={index}
                                                      index={index}
                                                      deleteZone={deleteZone}
                                                  />
                                              );
                                          })
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-6 flex items-center mt-2 justify-center mb-8">
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
                            onClick={() => onCreate()}
                        >
                            Tạo mới
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
