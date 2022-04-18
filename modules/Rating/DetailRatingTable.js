import React, { createRef, useContext, useEffect, useState } from 'react';
import { Pagination } from 'antd';
import HeaderCell from '../../components/Tables/HeaderCell';
import { serviceHelpers, openNotification, notiType, displayHelpers } from 'helpers';
import { useRouter } from 'next/router';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AuthContext } from 'layouts/Admin';
import { loadingFalse, loadingTrue } from 'store/actions';
import RowDetail from './components/RowDetail';
const { getDate } = displayHelpers;

export default function DetailRatingTable() {
    const [state, dispatch] = useContext(AuthContext);
    const [listCourse, setListCourse] = useState([]);
    const [count, setCount] = useState(0);
    const [rate, setActive] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const inputSearchRef = createRef();
    const router = useRouter();
    const { id } = router.query;

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
        setListCourse(data.data.rows);
        setCount(data.data.count);
        dispatch(loadingFalse());
    }, []);

    function changeSearchPhone(e) {
        e.preventDefault();
        return setSearch(e.target.value);
    }

    function changeActive(e) {
        e.preventDefault();
        return setActive(e.target.value);
    }

    async function handleSubmitFilter(e) {
        e.preventDefault();
        dispatch(loadingTrue());
        const data = await getData(rate, search);
        if (!data) {
            dispatch(loadingFalse());
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            dispatch(loadingFalse());
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        setPage(1);
        setListCourse(data.data.rows);
        setCount(data.data.count);
        dispatch(loadingFalse());
    }

    async function handleExportExcel(e) {
        e.preventDefault();
        const data = await exportData(rate, search);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }

        const excelData = data.data.rows.map(course => {
            course.createdAt = getDate(course.createdAt);
            switch (course.rate) {
                case true: {
                    course.rate = 'Kích hoạt';
                    break;
                }
                default: {
                    course.rate = 'Vô hiệu';
                    break;
                }
            }

            return {
                Id: course.id,
                'Tên khoá học': course.name,
                Lớp: course.class,
                'Giá tiền': course.amount,
                'Số bài học': course.numLesson,
                'Ngày tạo': course.createdAt,
                'Trạng thái': course.rate,
            };
        });
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const rs = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(rs, 'courses' + fileExtension);
    }

    async function handleClearFilter(e) {
        e.preventDefault();
        dispatch(loadingTrue());
        setSearch('');
        setActive('');
        setPage(1);
        //inputSearchRef.current.focus();
        const data = await getData();
        if (!data) {
            dispatch(loadingFalse());
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            dispatch(loadingFalse());
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        setListCourse(data.data.rows);
        setCount(data.data.count);
        dispatch(loadingFalse());
    }

    async function onClickCreateUser(e) {
        e.preventDefault();
        router.push('/courses/create');
    }

    async function updateActive(id, body) {
        dispatch(loadingTrue());
        const update = await serviceHelpers.updateData('userCousres/display', id, {});
        if (update.data.statusCode === 400) {
            return dispatch(loadingFalse());
        }
        const data = await getData(rate, search, (page - 1) * 10);
        if (!data) {
            dispatch(loadingFalse());
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            dispatch(loadingFalse());
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        openNotification(notiType.success, 'Cập nhật thành công !');
        setListCourse(data.data.rows);
        setCount(data.data.count);
        dispatch(loadingFalse());
    }

    async function handlePaginationChange(current) {
        dispatch(loadingTrue());
        const data = await getData(rate, search, (current - 1) * 10);
        if (!data) {
            dispatch(loadingFalse());
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            dispatch(loadingFalse());
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        setPage(current);
        setListCourse(data.data.rows);
        setCount(data.data.count);
        dispatch(loadingFalse());
    }

    async function getData(rate = '', search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [
            { operator: `eq`, value: `${id}`, property: `courseId` },
            { operator: `ne`, value: `null`, property: `rate` },
        ];
        if (rate != '') {
            filter.pop();
            filter.push({
                operator: `eq`,
                value: `${rate}`,
                property: `rate`,
            });
        }
        if (search != '') {
            filter.push({
                operator: 'iLike',
                value: `${search}`,
                property: `name`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.getListData('userCousres', strFilter, sort, start, 10);
        return data;
    }

    async function exportData(rate = '', search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [];
        if (rate != '') {
            filter.push({
                operator: `eq`,
                value: `${rate}`,
                property: `rate`,
            });
        }
        if (search != '') {
            filter.push({
                operator: 'iLike',
                value: `${search}`,
                property: `name`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.exportData('courses', strFilter, sort, start, 10);
        return data;
    }

    return (
        <>
            {/* <div>
                <button
                    className="2xl:w-2/12 xl:w-3/12 w-2/12 mb-2 float-right bg-white hover:bg-sky-500 text-sky-500 hover:text-white rate:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={onClickCreateUser}
                >
                    <span className="fas fa-plus mr-2"></span> Thêm Khoá học
                </button>
                <button
                    className="2xl:w-2/12 xl:w-3/12 w-2/12 mx-2 float-right mb-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white rate:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleExportExcel}
                >
                    <span className="fas fa-table mr-2"></span> Xuất File Excel
                </button>
            </div> */}

            <div className={'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded border-2 bg-white'}>
                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-blueGray-100">
                    <div className="flex flex-wrap mt-2">
                        <div className="2xl:w-5/12 xl:w-full  px-4 flex items-center">
                            <h3 className="font-semibold text-base text-blueGray-700 mb-3 ">QUẢN LÝ ĐÁNH GIÁ</h3>
                        </div>
                        <div className="2xl:w-7/12 xl:w-full 2xl:px-1 px-2">
                            <div className="relative w-full mb-3 flex items-center 2xl:justify-end">
                                {/* <input
                                    ref={inputSearchRef}
                                    value={search}
                                    type="text"
                                    className="2xl:w-3/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded text-xs font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                    placeholder="Tên khoá học"
                                    onChange={changeSearchPhone}
                                /> */}
                                <select
                                    value={rate}
                                    onChange={changeActive}
                                    className="border mx-2 2xl:w-3/12 bg-white text-blueGray-700 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear"
                                >
                                    <option value="">Điểm đánh giá</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <div className="2xl:w-3/12 xl:w-3/12 2xl:flex 2xl:justify-end max-w-180-px">
                                    <button
                                        className="2xl:px-4 px-4 mx-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white rate:bg-blueGray-600 font-bold uppercase text-xs  py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleSubmitFilter}
                                    >
                                        Lọc
                                    </button>
                                    <button
                                        className="2xl:px-2 px-4 bg-white hover:bg-sky-500 text-sky-500 hover:text-white rate:bg-blueGray-600 font-bold uppercase text-xs py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleClearFilter}
                                    >
                                        Bỏ lọc
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <HeaderCell content="ID" width="w-2/24" />
                                <HeaderCell content="NGƯỜI ĐÁNH GIÁ" width="w-6/24" />
                                <HeaderCell content="ĐÁNH GIÁ" width="w-4/24" />
                                <HeaderCell content="NHẬN XÉT" width="w-6/24" />
                                <HeaderCell content="TRẠNG THÁI" width="w-3/24" />
                                <HeaderCell content="Ẩn/Hiện" width="w-3/24" />
                            </tr>
                        </thead>
                        <tbody>
                            {listCourse && listCourse.length > 0 ? (
                                listCourse.map((user, index) => <RowDetail data={user} key={index} updateActive={updateActive} />)
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
                            <Pagination total={count} pageSize={10} showSizeChanger={false} current={page} onChange={handlePaginationChange} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
