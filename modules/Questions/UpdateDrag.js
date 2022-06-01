import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { useEffect, useState, useContext, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useRouter } from 'next/router';
import { notiType, openNotification, serviceHelpers } from 'helpers';
import { AuthContext } from 'layouts/Admin';
import { loadingFalse, loadingTrue } from 'store/actions';
import Latex from 'react-latex';
const { mediaURL } = serviceHelpers;
import ReactHtmlParser from 'react-html-parser';

export default function UpdateDrag({ data, lessonId }) {
    const [load, dispatch] = useContext(AuthContext);
    const router = useRouter();
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
        audio: null,
        audioInfo: [],
        name: null,
    });
    const [change, setChange] = useState(false);
    const [zones, setZones] = useState([]);
    const editorRef = useRef();
    const [editorLoaded, setEditorLoaded] = useState(false);
    const { CKEditor, ClassicEditor } = editorRef.current || {};
    const numAns = 0;
    useEffect(async () => {
        dispatch(loadingTrue());
        const lessonName = await getDetailLesson();
        setLesson(lessonName);
        data.audioInfo = [
            {
                url: data.audio,
                name: data.audioName,
            },
        ];
        data.solveInfo = [
            {
                url: data.solve,
                name: data.solveName,
            },
        ];
        data.imageInfo = [
            {
                url: data.image,
                name: data.imageName,
            },
        ];
        const arr = [];
        if (data.answers[0] && data.answers[0]) {
            for (const [index, iterator] of data.answers.entries()) {
                arr.push({
                    ...iterator,
                    content: data.answers[index].content,
                });
            }
        }

        setState(data);
        setZones(arr);
        dispatch(loadingFalse());
    }, [data, editorLoaded]);

    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
        };
        setEditorLoaded(true);
    }, []);

    useEffect(async () => {
        setZones(zones);
    }, [change]);

    function Zone({ state, data, index, deleteZone, onChangeZone }) {
        const [dt, setDt] = useState(data);
        useEffect(() => {
            setDt(dt);
        }, [state]);

        return (
            <div className="w-full mt-4">
                <div className="w-full flex border-2 p-2">
                    <div className="w-2/12 items-center justify-center flex">
                        <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                            Ô thả: {index + 1}
                        </label>
                    </div>
                    <div className="w-8/12 flex p-2">
                        <div className="w-full px-4 justify-center items-center">
                            <div className="relative w-full items-center flex">
                                <div className="w-full ml-4">
                                    <div className="w-full px-4 mb-6">
                                        <div className="relative w-full mb-3 items-center px-4">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Nội dung câu trả lời :{' '}
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
                                                {renderLatexArea(dt.content)}
                                            </div>
                                        </div>
                                    </div>
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

    function addZone() {
        const newZones = [
            ...zones,
            {
                content: '',
                correct: false,
            },
        ];
        setZones(newZones);
    }

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
        return data.data.data.name;
    }

    function deleteZone(index) {
        const a1 = zones.slice(0, index);
        const a2 = zones.slice(index + 1, zones.length);
        const newZones = a1.concat(a2);
        setZones(newZones);
    }

    function onChangeZone(index, field, value) {
        const newZones = zones;
        newZones[index][field] = value;
        setZones(newZones);
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

    async function uploadFile(file, onSuccess, onError, field) {
        dispatch(loadingTrue());
        if (state[field]) {
            const rs1 = await serviceHelpers.detailFile(state[field]);
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
        }
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

    async function onUpdate() {
        dispatch(loadingTrue());
        const zonesProp = [];
        const zoneContent = [];
        for (const dt of zones) {
            if (dt.content == '' || dt.content == null) {
                dispatch(loadingFalse());
                return openNotification(
                    notiType.error,
                    'Lỗi hệ thống',
                    'Vùng chọn chưa đủ nội dung',
                );
            }
            zoneContent.push(dt.content);
        }
        if (numAns != zoneContent.length) {
            dispatch(loadingFalse());
            return openNotification(
                notiType.error,
                'Lỗi hệ thống',
                'Số vùng thả và số đáp án không giống nhau',
            );
        }

        const body = {
            ...state,
            typeAnswer: 'text',
            content: zonesProp,
            answers: zoneContent,
            lessonId,
        };
        console.log(body);
        const rs1 = await serviceHelpers.updateData('questions/drag', data.id, body);
        const data1 = catchErr(rs1);
        const exam = catchErr(await serviceHelpers.detailData('exams', examId));
        const arr = exam.data.exam.listQuestions;
        arr.push(data1.data.id);
        catchErr(await serviceHelpers.updateData('exams', examId, { listQuestions: arr }));
        dispatch(loadingFalse());
        router.push(`/exams/${examId}`, `/exams/${examId}`);
    }

    function catchErr(rs) {
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
        return data;
    }

    function renderLatex(content) {
        if (content) {
            if (typeof content != 'string') {
                content = content.toString();
            }
            const renderHtml = [];
            const element = ReactHtmlParser(content);
            for (const iterator of element) {
                if (iterator.props) {
                    const split = iterator.props.children[0].split('$');
                    const htmlArr = [];
                    for (let [index, iter] of split.entries()) {
                        if (index % 2 == 0) {
                            const iterArr = iter.split('%');
                            const arr = [];

                            for (const [ind, iterator] of iterArr.entries()) {
                                if (ind % 2 == 0) {
                                    arr.push(<span>{iterator}</span>);
                                } else {
                                    numAns += 1;
                                    arr.push(
                                        <input
                                            name={iterator}
                                            disabled
                                            className="py-1 w-20 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        ></input>,
                                    );
                                }
                            }
                            htmlArr.push(React.createElement('span', null, arr));
                        } else {
                            htmlArr.push(
                                //<span className="text-xl">
                                <Latex>{`$${iter}$`}</Latex>,
                                //</span>,
                            );
                        }
                    }
                    const html = React.createElement('p', null, htmlArr);
                    renderHtml.push(html);
                }
            }
            const data = React.createElement(React.Fragment, null, renderHtml);
            return data;
        }
    }

    function renderLatexArea(content) {
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
                            Chỉnh sửa câu hỏi kéo thả
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
                                <div className="w-9/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                    {editorLoaded ? (
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={state.question}
                                            config={{
                                                toolbar: [],
                                            }}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setState({ ...state, question: data });
                                            }}
                                        />
                                    ) : (
                                        <div>Editor loading</div>
                                    )}
                                </div>
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
                                    className="w-9/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                ></textarea>
                            </div>
                        </div>
                        <div className="w-6/12 px-4 mb-6">
                            <div className="relative w-full mb-3 items-center flex px-4">
                                <label className="w-2/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Xem trước: <span className="text-red-500">*</span>
                                </label>
                                <div className="text-base border h-auto w-full p-4">
                                    {renderLatexArea(state.solve)}
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
                                                Tạo đề ngẫu nhiên:{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                onChange={e => {
                                                    onChangeState('isRandom', e, 'boolean');
                                                }}
                                                value={state.isRandom}
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
                            <div className="mt-2 w-full">
                                <button
                                    className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={addZone}
                                >
                                    Thêm đáp án
                                </button>
                                <div className=" w-full">
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
                            onClick={() => onUpdate()}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
