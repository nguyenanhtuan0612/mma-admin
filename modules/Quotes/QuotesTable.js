import React, { createRef, useEffect, useState } from 'react';
import { Pagination } from 'antd';
import HeaderCell from '../../components/Tables/HeaderCell';
import { serviceHelpers, openNotification, notiType, displayHelpers } from 'helpers';
import { useRouter } from 'next/router';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import RowItemQuote from './components/RowItemQuote';
const { getDate } = displayHelpers;

export default function QuotesTable() {
    const [listQuotes, setListQuote] = useState([]);
    const [count, setCount] = useState(0);
    const [active, setActive] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const inputSearchRef = createRef();
    const router = useRouter();

    useEffect(async () => {
        const data = await getData();
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        setListQuote(data.data.rows);
        setCount(data.data.count);
    }, []);

    function changeSearchPhone(e) {
        e.preventDefault();
        return setSearch(e.target.value);
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
        setListQuote(data.data.rows);
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

        const excelData = data.data.rows.map(quote => {
            quote.createdAt = getDate(quote.createdAt);
            switch (quote.active) {
                case true: {
                    quote.active = 'Kích hoạt';
                    break;
                }
                default: {
                    quote.active = 'Vô hiệu';
                    break;
                }
            }

            return {
                Id: quote.id,
                'Tên khoá học': quote.name,
                Lớp: quote.class,
                'Giá tiền': quote.amount,
                'Số bài học': quote.numLesson,
                'Ngày tạo': quote.createdAt,
                'Trạng thái': quote.active,
            };
        });
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const rs = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(rs, 'quotes' + fileExtension);
    }

    async function handleClearFilter(e) {
        e.preventDefault();
        setSearch('');
        setActive('');
        setPage(1);
        inputSearchRef.current.focus();
        const data = await getData();
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        setListQuote(data.data.rows);
        setCount(data.data.count);
    }

    async function onclickCreateBlog(e) {
        e.preventDefault();
        router.push('/quotes/create');
    }

    async function handlePaginationChange(current) {
        const data = await getData(active, search, (current - 1) * 10);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        setPage(current);
        setListQuote(data.data.rows);
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
                operator: 'search',
                value: `${search}`,
                property: `title`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.getListData('quotes', strFilter, sort, start, 10);
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
                operator: 'search',
                value: `${search}`,
                property: `title`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.exportData('quotes', strFilter, sort, start, 10);
        return data;
    }

    return (
        <>
            <div>
                <button
                    className="2xl:w-2/12 xl:w-3/12 w-2/12 mb-2 float-right bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={onclickCreateBlog}
                >
                    <span className="fas fa-plus mr-2"></span> Thêm Quote
                </button>
                <button
                    className="2xl:w-2/12 xl:w-3/12 w-2/12 mx-2 float-right mb-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleExportExcel}
                >
                    <span className="fas fa-table mr-2"></span> Xuất File Excel
                </button>
            </div>

            <div className={'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded border-2 bg-white'}>
                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-blueGray-100">
                    <div className="flex flex-wrap mt-2">
                        <div className="2xl:w-5/12 xl:w-full  px-4 flex items-center">
                            <h3 className="font-semibold text-base text-blueGray-700 mb-3 ">QUẢN LÝ QUOTE</h3>
                        </div>
                        <div className="2xl:w-7/12 xl:w-full 2xl:px-1 px-2">
                            <div className="relative w-full mb-3 flex items-center 2xl:justify-end">
                                <input
                                    ref={inputSearchRef}
                                    value={search}
                                    type="text"
                                    className="2xl:w-3/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded text-xs font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                    placeholder="Tên Quote"
                                    onChange={changeSearchPhone}
                                />
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
                                <HeaderCell content="ID" width="w-1/24" />
                                <HeaderCell content="QUOTE" width="w-6/24" />
                                <HeaderCell content="AUTHOR NAME" width="2/24" />
                                <HeaderCell content="BOOK" width="2/24" />
                                <HeaderCell content="CATEGORY" width="2/24" />
                                <HeaderCell content="NGÀY TẠO" width="w-3/24" />
                            </tr>
                        </thead>
                        <tbody>
                            {listQuotes && listQuotes.length > 0 ? (
                                listQuotes.map((quote, index) => <RowItemQuote data={quote} key={index} />)
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