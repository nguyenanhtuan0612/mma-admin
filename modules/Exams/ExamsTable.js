import React, { createRef, useContext, useEffect, useState } from 'react';
import { Dropdown, Menu, Pagination } from 'antd';
import HeaderCell from '../../components/Tables/HeaderCell';
import { serviceHelpers, openNotification, notiType, displayHelpers } from 'helpers';
import router, { useRouter } from 'next/router';
import { AuthContext } from 'layouts/Admin';
import { loadingFalse, loadingTrue } from 'store/actions';
import RowItemExams from './components/RowItemExam';
const { getDate } = displayHelpers;

export default function ExamsTable() {
    const [state, dispatch] = useContext(AuthContext);

    const [exam, setExams] = useState({});
    const [listQuestions, setListQuestions] = useState({ count: 0, rows: [] });

    const inputSearchRef = createRef();
    const [page, setPage] = useState(1);
    const [change, setChange] = useState(false);

    const router = useRouter();
    const { id } = router.query;

    const menuQuestion = (
        <Menu>
            <Menu.Item>
                <button
                    onClick={() =>
                        router.push(
                            `/questions/order?examId=${id}&lessonId=${exam.lessonId}`,
                            `/questions/order?examId=${id}&lessonId=${exam.lessonId}`,
                        )
                    }
                    className={
                        'text-sm py-2 px-4 block w-full whitespace-nowrap font-bold bg-transparent text-blueGray-700 hover:text-sky-700'
                    }
                >
                    Sắp xếp
                </button>
            </Menu.Item>
            <Menu.Item>
                <button
                    onClick={() =>
                        router.push(
                            `/questions/multipleChoice?examId=${id}&lessonId=${exam.lessonId}`,
                            `/questions/multipleChoice?examId=${id}&lessonId=${exam.lessonId}`,
                        )
                    }
                    className={
                        'text-sm py-2 px-4 block w-full whitespace-nowrap font-bold bg-transparent text-blueGray-700 hover:text-sky-700'
                    }
                >
                    Trắc nghiệm
                </button>
            </Menu.Item>
            <Menu.Item>
                <button
                    onClick={() =>
                        router.push(
                            `/questions/fill?examId=${id}&lessonId=${exam.lessonId}`,
                            `/questions/fill?examId=${id}&lessonId=${exam.lessonId}`,
                        )
                    }
                    className={
                        'text-sm py-2 px-4 block w-full whitespace-nowrap font-bold bg-transparent text-blueGray-700 hover:text-sky-700'
                    }
                >
                    Điền từ
                </button>
            </Menu.Item>
            <Menu.Item>
                <button
                    onClick={() =>
                        router.push(
                            `/questions/matching?examId=${id}&lessonId=${exam.lessonId}`,
                            `/questions/matching?examId=${id}&lessonId=${exam.lessonId}`,
                        )
                    }
                    className={
                        'text-sm py-2 px-4 block w-full whitespace-nowrap font-bold bg-transparent text-blueGray-700 hover:text-sky-700'
                    }
                >
                    Nối
                </button>
            </Menu.Item>
            <Menu.Item>
                <button
                    onClick={() =>
                        router.push(
                            `/questions/drag?examId=${id}&lessonId=${exam.lessonId}`,
                            `/questions/drag?examId=${id}&lessonId=${exam.lessonId}`,
                        )
                    }
                    className={
                        'text-sm py-2 px-4 block w-full whitespace-nowrap font-bold bg-transparent text-blueGray-700 hover:text-sky-700'
                    }
                >
                    Kéo thả
                </button>
            </Menu.Item>
        </Menu>
    );

    useEffect(async () => {
        dispatch(loadingTrue());
        const data = await getData();
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
        setListQuestions(data.data.listQuestion.rows);
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
        const { data } = await serviceHelpers.detailData('exams', id);
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
                <Dropdown overlay={menuQuestion} placement="bottomRight" arrow>
                    <button
                        className="2xl:w-2/12 xl:w-3/12 w-2/12 mx-2 float-right mb-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                        Tạo mới
                    </button>
                </Dropdown>
                <button
                    className=" mx-2 float-right mb-2 bg-white hover:bg-yellow-500 text-yellow-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                        router.push(`/lessons/${exam.lessonId}`, `/lessons/${exam.lessonId}`);
                    }}
                >
                    <span className="fas fa-table mr-2"></span> Thông tin bài học
                </button>
            </div>

            <div
                className={
                    'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded border-2 bg-white'
                }
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-blueGray-100">
                    <div className="flex flex-wrap mt-2">
                        <div className="2xl:w-5/12 xl:w-full  px-4 flex items-center">
                            <h3 className="font-semibold text-base text-blueGray-700 mb-3 ">
                                {exam.name}
                            </h3>
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
                                    return (
                                        <RowItemExams
                                            data={data}
                                            key={index}
                                            deleteQuestion={deleteQuestion}
                                            examId={exam.id}
                                        />
                                    );
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
