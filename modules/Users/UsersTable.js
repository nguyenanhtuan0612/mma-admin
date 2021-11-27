import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import HeaderCell from './components/HeaderCell';
import RowItemUser from './components/RowItemUser';
import { serviceHelpers, openNotification, notiType } from 'helpers';

export default function UsersTable() {
    const [listUser, setListUser] = useState([]);
    const [count, setCount] = useState(0);
    const [role, setRole] = useState('');
    const [active, setActive] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [page, setPage] = useState(1);
    const inputSearchPhoneRef = createRef();

    useEffect(async () => {
        const data = await getData();
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống', 'Không thể kết nối máy chủ');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        setListUser(data.data.rows);
        setCount(data.data.count);
    }, []);

    function changeSearchPhone(e) {
        e.preventDefault();
        return setSearchPhone(e.target.value);
    }

    function changeRole(e) {
        e.preventDefault();
        return setRole(e.target.value);
    }

    function changeActive(e) {
        e.preventDefault();
        return setActive(e.target.value);
    }

    async function handleSubmitFilter(e) {
        e.preventDefault();
        const data = await getData(role, active, searchPhone);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống', 'Không thể kết nối máy chủ');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        setPage(1);
        setListUser(data.data.rows);
        setCount(data.data.count);
    }

    async function handleClearFilter(e) {
        e.preventDefault();
        setSearchPhone('');
        setRole('');
        setActive('');
        setPage(1);
        inputSearchPhoneRef.current.focus();
        const data = await getData();
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống', 'Không thể kết nối máy chủ');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        setListUser(data.data.rows);
        setCount(data.data.count);
    }

    async function updateActive(id, body) {
        const update = await serviceHelpers.updateData('users', id, body);
        if (update.data.statusCode === 400) {
            return;
        }
        const data = await getData(role, active, searchPhone, (page - 1) * 10);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống', 'Không thể kết nối máy chủ');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        openNotification(notiType.success, 'Cập nhật thành công !');
        setListUser(data.data.rows);
        setCount(data.data.count);
    }

    async function handlePaginationChange(current) {
        const data = await getData(role, active, searchPhone, (current - 1) * 10);
        if (!data) {
            return openNotification(notiType.error, 'Lỗi hệ thống', 'Không thể kết nối máy chủ');
        }
        if (data.statusCode === 400) {
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);
        }
        setPage(current);
        setListUser(data.data.rows);
        setCount(data.data.count);
    }

    async function getData(role = '', active = '', searchPhone = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [];
        if (role != '') {
            filter.push({
                operator: `eq`,
                value: `${role}`,
                property: `role`,
            });
        }
        if (active != '') {
            filter.push({
                operator: `eq`,
                value: `${active}`,
                property: `active`,
            });
        }
        if (searchPhone != '') {
            filter.push({
                operator: 'iLike',
                value: `${searchPhone}`,
                property: `phone`,
            });
        }
        const strFilter = JSON.stringify(filter);
        console.log(strFilter);
        const { data } = await serviceHelpers.getListData('users', strFilter, sort, start, 10);
        return data;
    }

    return (
        <>
            <div>
                <button
                    className="lg:w-2/12 md:w-2/12 mb-2 float-right bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <span className="fas fa-user-plus mr-2"></span> Thêm Người dùng
                </button>
                <button
                    className="lg:w-2/12 md:w-2/12 mx-2 float-right mb-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <span className="fas fa-table mr-2"></span> Xuất File Excel
                </button>
            </div>

            <div className={'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded border-2 bg-white'}>
                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-blueGray-100">
                    <div className="flex flex-wrap mt-2">
                        <div className="2xl:w-6/12 lg:w-4/12 px-4 flex items-center">
                            <h3 className="font-semibold text-base text-blueGray-700 mb-3">QUẢN LÝ NGƯỜI DÙNG</h3>
                        </div>
                        <div className="2xl:w-6/12 lg:w-8/12 px-4">
                            <div className="relative w-full mb-3 flex items-center justify-end">
                                <input
                                    ref={inputSearchPhoneRef}
                                    value={searchPhone}
                                    type="text"
                                    className="px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded text-xs font-bold shadow focus:border-1 w-6/24 ease-linear transition-all duration-150"
                                    placeholder="Số điện thoại"
                                    onChange={changeSearchPhone}
                                />
                                <select
                                    value={role}
                                    onChange={changeRole}
                                    className="border ml-2 w-6/24 bg-white text-blueGray-700 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear"
                                >
                                    <option value="">-- Loại Thành viên --</option>
                                    <option value="root">Root Admin</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                                <select
                                    value={active}
                                    onChange={changeActive}
                                    className="border mx-2 w-5/24 bg-white text-blueGray-700 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear"
                                >
                                    <option value="">-- Trạng thái --</option>
                                    <option value="true">Hoạt động</option>
                                    <option value="false">Đã vô hiệu</option>
                                </select>
                                <div className="w-3/12">
                                    <button
                                        className="mx-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 md:px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleSubmitFilter}
                                    >
                                        Lọc
                                    </button>
                                    <button
                                        className="bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 md:px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
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
                                <HeaderCell content="HỌ TÊN" width="w-5/24" />
                                <HeaderCell content="SỐ ĐIỆN THOẠI" width="2/24" />
                                <HeaderCell content="EMAIL" width="w-5/24" />
                                <HeaderCell content="NGÀY TẠO" width="w-2/24" />
                                <HeaderCell content="LOẠI THÀNH VIÊN" width="4/24" />
                                <HeaderCell content="TRẠNG THÁI" width="w-3/24" />
                                <HeaderCell content="HOẠT ĐỘNG" width="w-2/24" />
                            </tr>
                        </thead>
                        <tbody>
                            {listUser && listUser.length > 0 ? (
                                listUser.map((user, index) => <RowItemUser data={user} key={index} updateActive={updateActive} />)
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