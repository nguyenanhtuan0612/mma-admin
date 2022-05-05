import React, { createRef, useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { serviceHelpers, openNotification, notiType, displayHelpers } from 'helpers';
import { useRouter } from 'next/router';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import HeaderCell from 'components/Tables/HeaderCell';
import RowItemPromotions from './components/RowItemPromotions';
const { getDate } = displayHelpers;

export default function PromotionsTable() {
    const [list, setList] = useState([]);
    const [count, setCount] = useState(0);
    const [active, setActive] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const inputSearchPhoneRef = createRef();
    const router = useRouter();

    useEffect(async () => {
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
        setList(data.data.rows);
        setCount(data.data.count);
    }, []);

    function changeSearchName(e) {
        e.preventDefault();
        return setSearch(e.target.value);
    }

    function changeActive(e) {
        e.preventDefault();
        return setActive(e.target.value);
    }

    async function handleSubmitFilter(e) {
        e.preventDefault();
        const data = await getData(active, search);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        setPage(1);
        setList(data.data.rows);
        setCount(data.data.count);
    }

    async function handleExportExcel(e) {
        e.preventDefault();
        const data = await exportData(active, search);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }

        const excelData = data.data.rows.map(teacher => {
            teacher.createdAt = getDate(teacher.createdAt);
            switch (teacher.active) {
                case true: {
                    teacher.active = 'Kích hoạt';
                    break;
                }
                default: {
                    teacher.active = 'Vô hiệu';
                    break;
                }
            }

            return {
                Id: teacher.id,
                'Họ và tên': teacher.name,
                'Nơi công tác': teacher.workPlace,
                'Ngày tạo': teacher.createdAt,
                'Trạng thái': teacher.active,
            };
        });
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const rs = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(rs, 'promotions' + fileExtension);
    }

    async function handleClearFilter(e) {
        e.preventDefault();
        setSearch('');
        setActive('');
        setPage(1);
        inputSearchPhoneRef.current.focus();
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
        setList(data.data.rows);
        setCount(data.data.count);
    }

    async function onClickCreateUser(e) {
        e.preventDefault();
        router.push('/promotions/create');
    }

    async function updateActive(id, body) {
        const update = await serviceHelpers.updateData('promotions', id, body);
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
        setList(data.data.rows);
        setCount(data.data.count);
    }

    async function handlePaginationChange(current) {
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
        setPage(current);
        setList(data.data.rows);
        setCount(data.data.count);
    }

    async function getData(active = '', search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [];
        if (active != '') {
            filter.push({
                operator: `eq`,
                value: `${active}`,
                property: `active`,
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
        const { data } = await serviceHelpers.getListData('promotions', strFilter, sort, start, 10);
        return data;
    }

    async function exportData(active = '', search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [];
        if (active != '') {
            filter.push({
                operator: `eq`,
                value: `${active}`,
                property: `active`,
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
        const { data } = await serviceHelpers.exportData('teachers', strFilter, sort, start, 10);
        return data;
    }

    return (
        <>
            <div>
                <button
                    className="2xl:w-2/12 xl:w-3/12 w-2/12 mb-2 float-right bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={onClickCreateUser}
                >
                    <span className="fas fa-user-plus mr-2"></span> Tạo mới khuyến mại
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
                            <h3 className="font-semibold text-base text-blueGray-700 mb-3 ">QUẢN LÝ KHUYẾN MẠI</h3>
                        </div>
                        <div className="2xl:w-7/12 xl:w-full 2xl:px-1 px-2">
                            <div className="relative w-full mb-3 flex items-center 2xl:justify-end">
                                <input
                                    ref={inputSearchPhoneRef}
                                    value={search}
                                    type="text"
                                    className="2xl:w-3/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded text-xs font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                    placeholder="Tên khuyến mại"
                                    onChange={changeSearchName}
                                />
                                <select
                                    value={active}
                                    onChange={changeActive}
                                    className="border mx-2 2xl:w-3/12 bg-white text-blueGray-700 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear"
                                >
                                    <option value="">Trạng thái</option>
                                    <option value="true">Hoạt động</option>
                                    <option value="false">Đã vô hiệu</option>
                                </select>
                                <div className="2xl:w-3/12 xl:w-3/12 2xl:flex 2xl:justify-end max-w-180-px">
                                    <button
                                        className="2xl:px-4 px-4 mx-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs  py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleSubmitFilter}
                                    >
                                        Lọc
                                    </button>
                                    <button
                                        className="2xl:px-2 px-4 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
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
                                <HeaderCell content="TÊN KHÓA HỌC" width="w-5/24" />
                                <HeaderCell content="TÊN KHUYẾN MẠI" width="5/24" />
                                <HeaderCell content="MỨC KHUYẾN MẠI" width="2/24" />
                                <HeaderCell content="ÁP DỤNG TỪ" width="w-3/24" />
                                <HeaderCell content="ĐẾN NGÀY" width="w-3/24" />
                                <HeaderCell content="TRẠNG THÁI" width="w-2/24" />
                                <HeaderCell content="HOẠT ĐỘNG" width="w-2/24" />
                            </tr>
                        </thead>
                        <tbody>
                            {list && list.length > 0 ? (
                                list.map((promo, index) => <RowItemPromotions data={promo} key={index} updateActive={updateActive} />)
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
