import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { notiType, openNotification, serviceHelpers } from 'helpers';
import { AuthContext } from 'layouts/Admin';
import { useRouter } from 'next/router';
import React, { useState, useContext, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { loadingFalse, loadingTrue } from 'store/actions';

export default function CreateMatching() {
    const [load, dispatch] = useContext(AuthContext);
    const router = useRouter();
    const lessonId = parseInt(router.query.lessonId);
    const examId = parseInt(router.query.examId);
    const [lesson, setLesson] = useState(null);
    const [state, setState] = useState({
        question: null,
        level: 'easy',
        isRandom: false,
        questionAudio: null,
        questionAudioInfo: [],
        image: null,
        imageInfo: [],
        active: true,
        solve: null,
        solveInfo: [],
        typeAnswerLeft: 'text',
        typeAnswerRight: 'text',
    });
    const [loading, setLoading] = useState(false);
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(async () => {
        dispatch(loadingTrue());
        const lessonName = await getDetailLesson();
        setLesson(lessonName.name);
        dispatch(loadingFalse());
    }, []);

    function handleChange(info) {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(
                info.file.originFileObj,
                imageUrl =>
                    setState({
                        ...state,
                        imageUrl,
                    }),
                setLoading(false),
            );
        }
    }

    async function getDetailLesson() {
        const rs = await serviceHelpers.detailData('lessons', lessonId);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs;
        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data.data.data;
    }

    function onChangeState(field, e, type = 'string') {
        e.preventDefault();
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

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">Tạo câu hỏi nối</b>
                    </div>
                </div>
                <div className={'relative min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center'}>
                    <div className="w-full pt-4">
                        <div className="w-8/12 px-4 mb-6">
                            <div className="w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                                <div className="flex flex-wrap w-full">
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Câu hỏi: <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                onChange={e => {
                                                    onChangeState('question', e);
                                                }}
                                                value={state.question}
                                                className="w-9/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs border font-bold"
                                            />
                                        </div>
                                    </div>
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
                                    <div className="w-full mb-2  px-4">
                                        <div className="relative w-full mb-3 flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Đáp án:</label>
                                            <div className="w-9/12 px-3 h-auto ">
                                                <Upload
                                                    fileList={state.questionAudio ? state.questionAudioInfo : []}
                                                    customRequest={({ file, onSuccess, onError }) =>
                                                        uploadFile(file, onSuccess, onError, 'questionAudio')
                                                    }
                                                    onRemove={() => deleteFile('questionAudio')}
                                                >
                                                    <Button hidden={state.questionAudio ? true : false} icon={<UploadOutlined />}>
                                                        Chọn file
                                                    </Button>
                                                </Upload>
                                                <div className="w-full mt-2" hidden={state.questionAudio ? false : true}>
                                                    <ReactAudioPlayer src={state.questionAudio} controls />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full mb-2  px-4">
                                        <div className="relative w-full mb-3 flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Ảnh lời giải:
                                            </label>
                                            <div className="w-9/12 px-3 h-auto ">
                                                <Upload
                                                    fileList={state.solve ? state.solveInfo : []}
                                                    customRequest={({ file, onSuccess, onError }) => uploadFile(file, onSuccess, onError, 'solve')}
                                                    onRemove={() => deleteFile('solve')}
                                                >
                                                    <Button hidden={state.solve ? true : false} icon={<UploadOutlined />}>
                                                        Chọn file
                                                    </Button>
                                                </Upload>
                                                <div
                                                    style={{ width: '100%', height: 'auto', position: 'relative' }}
                                                    hidden={state.solve ? false : true}
                                                >
                                                    <img src={state.solve} className="object-contain w-full border-2" alt="..."></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Bài học:</label>
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
                        <div className="w-full px-4 mt-4 mb-6">
                            <div className="2xl:w-full">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Đáp án: <span className="text-red-500">*</span>
                                </label>
                                <div className="w-full">
                                    <div className="w-full flex">
                                        <div className="w-6/12 items-center flex">
                                            <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Định dạng trái: <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                onChange={e => {
                                                    onChangeState('typeAnswerLeft', e);
                                                }}
                                                value={state.typeAnswerLeft}
                                                className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            >
                                                <option value="text">Text</option>
                                                <option value="image">Ảnh</option>
                                            </select>
                                        </div>
                                        <div className="w-6/12 items-center flex">
                                            <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Định dạng phải: <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                onChange={e => {
                                                    onChangeState('typeAnswerRight', e);
                                                }}
                                                value={state.typeAnswerRight}
                                                className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            >
                                                <option value="text">Text</option>
                                                <option value="image">Ảnh</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full my-8">
                                        <div className="w-full flex border p-2">
                                            <div className="w-6/12 items-center flex p-2 border">
                                                <div className="w-full px-4 justify-center items-center">
                                                    <div className="relative w-full items-center flex">
                                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                            Nội dung trái:
                                                        </label>
                                                        <input
                                                            hidden={state.typeAnswerLeft == 'text' ? false : true}
                                                            className="w-8/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs border font-bold"
                                                        />
                                                        <div className="w-8/12 ml-4" hidden={state.typeAnswerLeft == 'image' ? false : true}>
                                                            <Upload
                                                                listType="picture-card"
                                                                customRequest={({ file, onSuccess, onError }) =>
                                                                    uploadFile(file, onSuccess, onError, 'solve')
                                                                }
                                                                onRemove={() => deleteFile('solve')}
                                                                showUploadList={false}
                                                                onChange={info => handleChange(info)}
                                                            >
                                                                {state.imageUrl ? (
                                                                    <img src={state.imageUrl} alt="avatar" style={{ width: '100%' }} />
                                                                ) : (
                                                                    uploadButton
                                                                )}
                                                            </Upload>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-6/12 items-center flex p-2 border">
                                                <div className="w-full px-4 justify-center items-center">
                                                    <div className="relative w-full items-center flex">
                                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                            Nội dung phải:
                                                        </label>
                                                        <input
                                                            hidden={state.typeAnswerRight == 'text' ? false : true}
                                                            className="w-8/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs border font-bold"
                                                        />
                                                        <div className="w-8/12 ml-4" hidden={state.typeAnswerRight == 'image' ? false : true}>
                                                            <Upload
                                                                listType="picture-card"
                                                                customRequest={({ file, onSuccess, onError }) =>
                                                                    uploadFile(file, onSuccess, onError, 'solve')
                                                                }
                                                                onRemove={() => deleteFile('solve')}
                                                                showUploadList={false}
                                                                onChange={info => handleChange(info)}
                                                            >
                                                                {state.imageUrl ? (
                                                                    <img src={state.imageUrl} alt="avatar" style={{ width: '100%' }} />
                                                                ) : (
                                                                    uploadButton
                                                                )}
                                                            </Upload>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div hidden={state.image ? false : true} className="mt-2 w-full">
                                    <button
                                        className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                        type="button"
                                        //onClick={addZone}
                                    >
                                        Thêm vùng thả
                                    </button>
                                    <div>
                                        {/* {zones && zones.length > 0
                                            ? zones.map((data, index) => (
                                                  <Zone data={data} key={index} index={index} onChangeZone={onChangeZone} deleteZone={deleteZone} />
                                              ))
                                            : null} */}
                                    </div>
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
