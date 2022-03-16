import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useRouter } from 'next/router';
import { notiType, openNotification, serviceHelpers } from 'helpers';

function Zone(data) {
    const [dt, setDt] = useState(data.data);
    const index = data.index;
    const { deleteZone, onChangeZone } = data;

    return (
        <div className="border flex-wrap flex w-full px-2 py-2 ">
            <span className=" mt-4 mr-8 text-blueGray-600 text-xs font-bold text-right">Vùng: {index + 1}</span>
            <div className=" mt-2 mr-8">
                <label className="text-blueGray-600 text-xs font-bold text-right mr-2">Tọa độ trên:</label>
                <input
                    onChange={e => {
                        e.preventDefault();
                        setDt({ ...data.data, top: e.target.value });
                        onChangeZone(index, 'top', e.target.value);
                    }}
                    value={dt.top}
                    className="px-1 py-2 text-blueGray-700 bg-white text-xs border font-bold w-10"
                />{' '}
            </div>
            <div className=" mt-2 mr-8">
                <label className="text-blueGray-600  text-xs font-bold text-right mr-2">Tọa độ trái:</label>
                <input
                    onChange={e => {
                        e.preventDefault();
                        setDt({ ...data.data, left: e.target.value });
                        onChangeZone(index, 'left', e.target.value);
                    }}
                    value={dt.left}
                    className="px-1 py-2 text-blueGray-700 bg-white  text-xs border font-bold w-10"
                />{' '}
            </div>
            <div className=" mt-2 mr-8 ">
                <label className="text-blueGray-600 text-xs font-bold text-right mr-2">Dài:</label>
                <input
                    onChange={e => {
                        e.preventDefault();
                        setDt({ ...data.data, width: e.target.value });
                        onChangeZone(index, 'width', e.target.value);
                    }}
                    value={dt.width}
                    className="px-1 py-2 text-blueGray-700 bg-white text-xs border font-bold w-10"
                />{' '}
            </div>
            <div className=" mt-2 mr-8">
                <label className="text-blueGray-60 text-xs font-bold text-right mr-2">Rộng:</label>
                <input
                    onChange={e => {
                        e.preventDefault();
                        setDt({ ...data.data, height: e.target.value });
                        onChangeZone(index, 'height', e.target.value);
                    }}
                    value={dt.height}
                    className="px-1 py-2 text-blueGray-700 bg-white  text-xs border font-bold w-10"
                />{' '}
            </div>
            <div className=" mt-2 mr-8">
                <label className="text-blueGray-600  text-xs font-bold text-right mr-2">Nội dung:</label>
                <input
                    onChange={e => {
                        e.preventDefault();
                        setDt({ ...data.data, content: e.target.left });
                        onChangeZone(index, 'content', e.target.value);
                    }}
                    value={dt.content}
                    className="px-1 py-2 text-blueGray-700 bg-white  text-xs border font-bold w-20"
                />{' '}
            </div>
            <div className=" mt-2 mr-8">
                <button
                    className="bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => deleteZone(index)}
                >
                    Xóa
                </button>
            </div>
        </div>
    );
}

function ZonePic(data) {
    const dt = data.data;
    const index = data.index;

    return (
        <div
            className="border border-black absolute justify-center items-center flex"
            style={{ top: `${dt.top}%`, left: `${dt.left}%`, height: `${dt.height}%`, width: `${dt.width}%` }}
        >
            {index + 1}
        </div>
    );
}

export default function CreateDrag() {
    const router = useRouter();
    const lessonId = parseInt(router.query.lessonId);
    const [lesson, setLesson] = useState(null);
    const [state, setState] = useState({
        question: null,
        level: 'easy',
    });
    const [zones, setZones] = useState([]);

    useEffect(async () => {
        const lessonName = await getDetailLesson();
        setLesson(lessonName);
    }, []);

    async function getDetailLesson() {
        const rs = await serviceHelpers.detailData('lessons', lessonId);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs;
        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data.data.data.name;
    }

    function renderPic(zones) {
        return zones && zones.length > 0 ? zones.map((data, index) => <ZonePic data={data} key={index} index={index} />) : null;
    }

    const [pic, setPic] = useState(renderPic([]));

    function addZone() {
        const newZones = [...zones, { top: '0', left: '0', width: '10', height: '10', content: '' }];
        setZones(newZones);
        setPic(renderPic(newZones));
    }

    function deleteZone(index) {
        const a1 = zones.slice(0, index);
        const a2 = zones.slice(index + 1, zones.length);
        const newZones = a1.concat(a2);
        setZones(newZones);
        setPic(renderPic(newZones));
    }

    function onChangeZone(index, field, value) {
        const newZones = zones;
        newZones[index][field] = value;
        setZones(newZones);
        setPic(renderPic(newZones));
    }

    function onChangeState(field, e, type = 'string') {
        e.preventDefault();
        const newState = state;
        switch (type) {
            case 'boolean': {
                newState[`${field}`] = e.target.value == 'true' ? true : false;
                break;
            }
            default: {
                newState[`${field}`] = e.target.value == '' ? null : e.target.value;
                break;
            }
        }

        console.log(newState);
        setState(newState);
    }

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">Tạo câu hỏi kéo thả</b>
                    </div>
                </div>
                <div className={'relative min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center'}>
                    <div className="flex w-full">
                        <div className="w-6/12 px-4 mt-4 mb-6">
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
                                    <div className="w-full px-4 mb-2">
                                        <div className="relative w-full mb-3 items-center flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Tạo đề tự động: <span className="text-red-500">*</span>
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
                                    <div className="w-full mb-2  px-4">
                                        <div className="relative w-full mb-3 flex">
                                            <label className="w-3/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                                Audio câu hỏi:
                                            </label>
                                            <div className="w-9/12 px-3 h-auto ">
                                                <Upload>
                                                    <Button icon={<UploadOutlined />}>Chọn file</Button>
                                                </Upload>
                                                <div className="w-full mt-2" hidden={false}>
                                                    <ReactAudioPlayer src={state.questionAudio} controls />
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
                        <div className="w-6/12 px-4 mt-4 mb-6">
                            <div className="2xl:w-full">
                                <label className="text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                    Ảnh câu hỏi: <span className="text-red-500">*</span>
                                </label>

                                <div className="w-full">
                                    <Upload>
                                        <Button icon={<UploadOutlined />}>Chọn file</Button>
                                    </Upload>
                                    <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
                                        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>{pic}</div>
                                        <img
                                            src="
                                        http://54.179.149.123/api/v1/files/streaming/questions/file-1647092784745.png"
                                            className="object-contain w-full border-2"
                                            alt="..."
                                        ></img>
                                    </div>
                                </div>
                                <div className="mt-2 w-full">
                                    <button
                                        className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={addZone}
                                    >
                                        Thêm vùng thả
                                    </button>
                                    <div>
                                        {zones && zones.length > 0
                                            ? zones.map((data, index) => (
                                                  <Zone data={data} key={index} index={index} onChangeZone={onChangeZone} deleteZone={deleteZone} />
                                              ))
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-6 flex items-center mt-2 justify-center mb-8">
                        <button
                            className="mx-2 mb-2 bg-yellow-500 hover:bg-yellow-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                            type="button"
                            //onClick={() => router.back()}
                        >
                            Trở về
                        </button>
                        <button
                            className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                            type="button"
                            // onClick={onCreate}
                        >
                            Tạo mới
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
