import React from 'react';

export default function Test() {
    return (
        <div className="w-full mb-2">
            <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Bộ câu hỏi kiểm tra đầu vào:</span>
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
    );
}
