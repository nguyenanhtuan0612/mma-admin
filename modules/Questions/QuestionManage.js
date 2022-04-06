import React, { createRef, useContext, useEffect, useState } from 'react';
import { Dropdown, Menu, Pagination } from 'antd';
import HeaderCell from '../../components/Tables/HeaderCell';
import { serviceHelpers, openNotification, notiType, displayHelpers } from 'helpers';
import router, { useRouter } from 'next/router';
import { AuthContext } from 'layouts/Admin';
import { loadingFalse, loadingTrue } from 'store/actions';
import RowItemQuestions from './components/RowItemQuestions';
const { getDate } = displayHelpers;

export default function ExamsTable() {
    const [state, dispatch] = useContext(AuthContext);

    const [numQs, setNumQs] = useState({ easy: 0, medium: 0, hard: 0 });
    const [listQuestions, setListQuestions] = useState({ count: 0, rows: [] });

    const inputSearchRef = createRef();
    const [page, setPage] = useState(1);
    const [change, setChange] = useState(false);

    const router = useRouter();
    const { lessonId } = router.query;

    useEffect(async () => {
        dispatch(loadingTrue());
        const data = await getData();
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        console.log(data);
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        setNumQs({
            easy: data.data.easy,
            medium: data.data.medium,
            hard: data.data.hard,
        });
        setListQuestions(data.data.listQuestions.rows);
        dispatch(loadingFalse());
    }, [change]);

    // function changeSearchPhone(e) {
    //     e.preventDefault();
    //     return setSearch(e.target.value);
    // }

    // function changeActive(e) {
    //     e.preventDefault();
    //     return setActive(e.target.value);
    // }

    // async function handleSubmitFilter(e) {
    //     e.preventDefault();
    //     const data = await getData(active, search);
    //     if (!data) {
    //         return openNotification(notiType.error, 'Lỗi hệ thống');
    //     }
    //     if (data.statusCode === 400) {
    //         return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
    //     }
    //     setPage(1);
    //     setListQuestions(data.data.rows);
    //     setCount(data.data.count);
    // }

    // async function handleClearFilter(e) {
    //     e.preventDefault();
    //     setSearch('');
    //     setActive('');
    //     setPage(1);
    //     inputSearchRef.current.focus();
    //     const data = await getData();
    //     if (!data) {
    //         return openNotification(notiType.error, 'Lỗi hệ thống');
    //     }
    //     if (data.statusCode === 400) {
    //         return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
    //     }
    //     if (data.statusCode <= 404 && data.statusCode >= 401) {
    //         router.push('/auth/login');
    //         return <div></div>;
    //     }
    //     console.log(data.data);
    //     setListQuestions(data.data.rows);
    //     setCount(data.data.count);
    // }

    async function updateActive(id, body) {
        const update = await serviceHelpers.updateData('courses', id, body);
        if (update.data.statusCode === 400) {
            return;
        }
        const data = await getData(active, search, (page - 1) * 10);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        openNotification(notiType.success, 'Cập nhật thành công !');
        setListQuestions(data.data.rows);
        setCount(data.data.count);
    }

    async function handlePaginationChange(current) {
        dispatch(loadingTrue());
        const data = await getData(active, search, (current - 1) * 10);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        setExams(data.data.exam);
        setListQuestions(data.data.listQuestion);
        dispatch(loadingFalse());
    }

    async function getData() {
        const { data } = await serviceHelpers.detailData('lessons/numQuestion', lessonId);
        return data;
    }

    async function deleteQuestion(qsId) {
        dispatch(loadingTrue());
        const valueToRemove = qsId;
        const arr = exam.listQuestions.filter(item => item !== valueToRemove);

        const data = await serviceHelpers.updateData('exams', id, { listQuestions: arr });
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        setChange(!change);
        dispatch(loadingFalse());
    }

    return (
        <>
            <div>
                <button
                    onClick={() =>
                        router.push(
                            `/questions/multipleChoice?&lessonId=${lessonId}&isRandom=true`,
                            `/questions/multipleChoice?&lessonId=${lessonId}&isRandom=true`,
                        )
                    }
                    className="2xl:w-2/12 xl:w-3/12 w-2/12 mx-2 float-right mb-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                >
                    Tạo mới câu hỏi trắc nghiệm
                </button>
                {/* <button
                    className="2xl:w-2/12 xl:w-3/12 w-2/12 mx-2 float-right mb-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleExportExcel}
                >
                    <span className="fas fa-table mr-2"></span> Xuất File Excel
                </button> */}
            </div>

            <div className={'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded border-2 bg-white'}>
                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-blueGray-100">
                    <div className="flex flex-wrap mt-2">
                        <div className="2xl:w-5/12 xl:w-full  px-4 flex items-center">
                            <span className="font-semibold text-sm text-blueGray-700 mb-3 mr-4">Dễ: {numQs.easy}/15</span>
                            <span className="font-semibold text-sm text-blueGray-700 mb-3 mr-4">Trung Bình: {numQs.medium}/10</span>
                            <span className="font-semibold text-sm text-blueGray-700 mb-3 mr-4">Khó: {numQs.hard}/5</span>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <HeaderCell content="ID" width="w-2/24" />
                                <HeaderCell content="CÂU HỎI" width="w-10/24" />
                                <HeaderCell content="LOẠI CÂU HỎI" width="w-3/24" />
                                <HeaderCell content="ĐỘ KHÓ" width="w-3/24" />
                                <HeaderCell content="TRẠNG THÁI" width="w-3/24" />
                                <HeaderCell content="NGÀY TẠO" width="w-3/24" />
                            </tr>
                        </thead>
                        <tbody>
                            {listQuestions && listQuestions.length > 0 ? (
                                listQuestions.map((data, index) => {
                                    return <RowItemQuestions data={data} key={index} deleteQuestion={deleteQuestion} />;
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <hr />
                <div className="rounded-t mb-0 px-4 py-3 border-0 justify-center bg-blueGray-100">
                    <div className="flex flex-wrap items-center justify-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <Pagination
                                total={listQuestions.count}
                                pageSize={10}
                                showSizeChanger={false}
                                current={page}
                                onChange={handlePaginationChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
