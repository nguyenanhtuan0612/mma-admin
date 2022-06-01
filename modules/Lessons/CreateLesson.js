import React, { useEffect, useRef, useState, useContext } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { loadingFalse, loadingTrue } from 'store/actions';
const { checkNull, avatarImg, checkSelect } = displayHelpers;
const { mediaURL } = serviceHelpers;
import { AuthContext } from 'layouts/Admin';

export default function CreateLesson() {
    const router = useRouter();
    const [load, dispatch] = useContext(AuthContext);
    const [courseName, setCourseName] = useState(null);
    const courseId = parseInt(router.query.courseId);
    const [state, setState] = useState({
        name: null,
        isFree: false,
        courseId: courseId,
        type: 'form_1',
        active: false,
        thumb: null,
        lessonContent: null,
    });

    const editorRef = useRef();
    const [editorLoaded, setEditorLoaded] = useState(false);
    const { CKEditor, ClassicEditor } = editorRef.current || {};

    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
        };
        setEditorLoaded(true);
    }, []);

    useEffect(async () => {
        const { data } = await getDataCourse(courseId);
        setCourseName(data.data.name);
    }, [editorLoaded]);

    async function getDataCourse(id) {
        dispatch(loadingTrue());
        const rs = await serviceHelpers.detailData('courses', id);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs;

        if (data.statusCode === 400)
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        dispatch(loadingFalse());
        return data;
    }

    async function onCreate() {
        dispatch(loadingTrue());
        let lesson = state;
        const data = await CreateLesson(lesson);
        if (!data) {
            return;
        }
        const lessonId = data.data.id;
        openNotification(notiType.success, 'Tạo mới thành công !');
        dispatch(loadingFalse());
        router.push(`/lessons/${lessonId}`, `/lessons/${lessonId}`);
    }

    async function CreateLesson(body) {
        const { data } = await serviceHelpers.createData('lessons', body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400)
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function deleteFile(path) {
        dispatch(loadingTrue());
        const { data } = await serviceHelpers.deleteFile(path);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        dispatch(loadingFalse());
        return data;
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

    async function handleChangeType(e) {
        e.preventDefault();
        setState({
            ...state,
            type: e.target.value,
        });
    }

    async function handleChangeContent(event, editor) {
        const data = editor.getData();
        setState({
            ...state,
            lessonContent: data,
        });
    }

    async function uploadLessonThumb({ file, onSuccess, onError }) {
        dispatch(loadingTrue());
        const rs = await serviceHelpers.uploadFile('lessons/avatars', file);
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
            thumb: mediaURL + data.data.streamPath,
        });
        dispatch(loadingFalse());
        return onSuccess();
    }

    async function deleteThumb(e) {
        dispatch(loadingTrue());
        await deleteFile(state.thumb);
        setState({ ...state, thumb: null });
        dispatch(loadingFalse());
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
                        'relative min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center'
                    }
                >
                    <div className="flex w-full">
                        <div className="w-6/12 px-4 mt-4 mb-6">
                            <div className="w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                                <div className="flex flex-wrap w-full">
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Khoá học:
                                            </label>
                                            <input
                                                disabled
                                                className="w-9/12 px-3 py-2 text-blueGray-700 bg-white 2xl:text-sm text-xs border font-bold"
                                                value={checkNull(courseName, '')}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Tên bài học: <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={checkNull(state.name, '')}
                                                onChange={handleChangeName}
                                                type="text"
                                                placeholder="Tên bài học"
                                                className="w-9/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Miễn phí: <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={checkSelect(state.isFree)}
                                                onChange={handleChangeFree}
                                                className="w-9/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            >
                                                <option value="false">Không</option>
                                                <option value="true">Có</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Kiểu bài học:{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={checkSelect(state.type)}
                                                onChange={handleChangeType}
                                                className="w-9/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                            >
                                                <option value="form_1">Dạng 1 </option>
                                                <option value="form_2">Dạng 2</option>
                                                <option value="test">Kiểm tra</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Nội dung bài học:
                                            </label>
                                            <div className="w-9/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                                {editorLoaded ? (
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={state.lessonContent}
                                                        config={{
                                                            toolbar: [],
                                                        }}
                                                        onChange={handleChangeContent}
                                                    />
                                                ) : (
                                                    <div>Editor loading</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-6/12 px-4 mt-4 mb-6">
                            <div className="2xl:w-full w-full">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Ảnh bài học: <span className="text-red-500">*</span>
                                </label>
                                <div className="w-full flex items-center mt-2">
                                    <Upload
                                        customRequest={uploadLessonThumb}
                                        maxCount={1}
                                        onRemove={deleteThumb}
                                    >
                                        <Button icon={<UploadOutlined />}>Chọn file</Button>
                                    </Upload>
                                </div>
                                <div className="w-full" hidden={state.thumb ? false : true}>
                                    <img
                                        src={avatarImg(state.thumb)}
                                        className="h-40 border"
                                        alt="..."
                                    ></img>
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
                            onClick={onCreate}
                        >
                            Tạo mới
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
