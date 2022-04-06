import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { notiType, openNotification, serviceHelpers } from 'helpers';
const { mediaURL } = serviceHelpers;
import { AuthContext } from 'layouts/Admin';
import { loadingFalse, loadingTrue } from 'store/actions';

export default function Test({ pState, setState, courseName }) {
    const router = useRouter();

    async function createListQuestions(e, field) {
        e.preventDefault();
        const examName = `${pState.name} - Khóa: ${courseName}`;
        const rs = await serviceHelpers.createData('exams', { name: examName, lessonId: pState.id });
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs.data;

        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
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

        router.push(`/exams/${data.data.id}?&ref=${router.asPath}`);
    }

    async function deleteListQuestions(e, field) {
        e.preventDefault();
        const rs = await serviceHelpers.deleteData('exams', pState[field]);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs.data;

        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        setState({ ...pState, [field]: null });
        return true;
    }

    return (
        <div className="w-full mb-2">
            <span className="text-blueGray-600 2xl:text-sm text-xs font-bold">Bộ câu hỏi kiểm tra đầu vào:</span>
            <div className="w-full px-6 flex mt-2 mb-8">
                <button
                    onClick={e => createListQuestions(e, 'examId', 'test')}
                    hidden={pState.examId ? true : false}
                    className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    Tạo mới
                </button>
                <button
                    hidden={pState.examId ? false : true}
                    onClick={() => router.push(`/exams/${pState.examId}?&ref=${router.asPath}`)}
                    className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    Chỉnh sửa
                </button>
                <button
                    hidden={pState.examId ? false : true}
                    onClick={e => deleteListQuestions(e, 'examId')}
                    className="mx-2 mb-2 bg-red-400 hover:bg-red-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    Xóa list câu hỏi
                </button>
            </div>
        </div>
    );
}
