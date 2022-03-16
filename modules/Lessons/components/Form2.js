import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React from 'react';
import ReactPlayer from 'react-player';

export default function Form2({ pState }) {
    return (
        <div className="relative min-w-0 w-full mb-6 bg-white justify-center">
            <div className="flex w-full">
                <div className="ml-2 w-6/12 mb-8 px-3">
                    <span className="text-xl font-semibold leading-normal text-blueGray-700">Nút 1</span>
                    <div className="w-full mb-2">
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
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video tổng quan nút 1.2:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload>
                                <Button icon={<UploadOutlined />}>Chọn file</Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={false}>
                                <ReactPlayer
                                    url={'http://54.179.149.123/api/v1/files/streaming/lessons_videos/file-1642836681736.mp4'}
                                    width="100%"
                                    height="auto"
                                    controls
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 1.3:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
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
                                Xóa list câu hỏi
                            </button>
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
                            <Upload>
                                <Button icon={<UploadOutlined />}>Chọn file</Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={false}>
                                <ReactPlayer
                                    url={'http://54.179.149.123/api/v1/files/streaming/lessons_videos/file-1642836681736.mp4'}
                                    width="100%"
                                    height="auto"
                                    controls
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 3.2:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
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
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video kết nối kiến thức nút 3.3:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload>
                                <Button icon={<UploadOutlined />}>Chọn file</Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={false}>
                                <ReactPlayer
                                    url={'http://54.179.149.123/api/v1/files/streaming/lessons_videos/file-1642836681736.mp4'}
                                    width="100%"
                                    height="auto"
                                    controls
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 3.4:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
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
                            <Upload>
                                <Button icon={<UploadOutlined />}>Chọn file</Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={false}>
                                <ReactPlayer
                                    url={'http://54.179.149.123/api/v1/files/streaming/lessons_videos/file-1642836681736.mp4'}
                                    width="100%"
                                    height="auto"
                                    controls
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 4.2:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
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
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video kết nối kiến thức nút 4.3:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload>
                                <Button icon={<UploadOutlined />}>Chọn file</Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={false}>
                                <ReactPlayer
                                    url={'http://54.179.149.123/api/v1/files/streaming/lessons_videos/file-1642836681736.mp4'}
                                    width="100%"
                                    height="auto"
                                    controls
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2 ">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 4.4:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
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
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 6.2:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
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
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Video giá trị cuộc sống 6.3:</span>
                        <div className="w-full mt-2 mb-8 h-auto">
                            <Upload>
                                <Button icon={<UploadOutlined />}>Chọn file</Button>
                            </Upload>
                            <div className="w-full mt-2" hidden={false}>
                                <ReactPlayer
                                    url={'http://54.179.149.123/api/v1/files/streaming/lessons_videos/file-1642836681736.mp4'}
                                    width="100%"
                                    height="auto"
                                    controls
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2 ">
                        <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">List câu hỏi 6.4:</span>
                        <div className="w-full px-6 flex mt-2 mb-8">
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
                                Xóa list câu hỏi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
