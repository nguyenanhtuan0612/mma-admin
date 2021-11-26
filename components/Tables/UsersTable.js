import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import HeaderCell from './components/HeaderCell';
import RowItemUser from './components/RowItemUser';
import { userServices } from 'services';

export default function UsersTable({ color }) {
    const [listUser, setListUser] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(async () => {
        const { data } = await userServices.getData();
        if (data.statusCode === 400) {
            alert(data.message);
        }
        setListUser(data.data.rows);
        setCount(data.data.count);
    }, []);

    return (
        <>
            <div>
                <button
                    className="w-4/24 mb-2 float-right bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <span className="fas fa-user-plus mr-2"></span> Thêm Người dùng
                </button>
                <button
                    className="w-4/24 mx-2 float-right mb-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    <span className="fas fa-table mr-2"></span> Xuất File Excel
                </button>
            </div>

            <div
                className={
                    'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded border-2 ' +
                    (color === 'light' ? 'bg-white' : 'bg-blueGray-700 text-white')
                }
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-blueGray-100">
                    <div className="flex flex-wrap mt-2">
                        <div className="w-full lg:w-6/12 px-4 flex">
                            <div className="relative w-6/12 mb-3 flex mr-4 items-center">
                                <input
                                    type="email"
                                    className="px-3 py-2 placeholder-blueGray-400 text-blueGray-800 bg-white rounded text-sm shadow focus:border-1 w-7/12 ease-linear transition-all duration-150"
                                    placeholder="Số điện thoại"
                                />
                                <div className="w-5/12 ml-2">
                                    <button
                                        className="bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                            </div>
                            <div className="relative w-6/12 mb-3 flex items-center">
                                <input
                                    type="email"
                                    className="px-3 py-2 placeholder-blueGray-400 text-blueGray-800 bg-white rounded text-sm shadow focus:border-1 w-7/12 ease-linear transition-all duration-150"
                                    placeholder="Email"
                                />
                                <div className="w-5/12 ml-2 ">
                                    <button
                                        className="bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12 px-4">
                            <div className="relative w-full mb-3 flex items-center justify-end">
                                <select className="border w-6/24 bg-white text-blueGray-800 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear">
                                    <option value="">-- Loại Thành viên --</option>
                                    <option value="root">Root Admin</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                                <select className="border mx-2 w-5/24 bg-white text-blueGray-800 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear">
                                    <option value="">-- Trạng thái --</option>
                                    <option value="true">Hoạt động</option>
                                    <option value="false">Đã vô hiệu</option>
                                </select>
                                <div className="w-3/12">
                                    <button
                                        className="mx-2 bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
                                    >
                                        Lọc
                                    </button>
                                    <button
                                        className="bg-white hover:bg-sky-500 text-sky-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
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
                                listUser.map((user, index) => <RowItemUser data={user} key={index} />)
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
                            <Pagination total={count} pageSize={10} showSizeChanger={false} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

UsersTable.defaultProps = {
    color: 'light',
};

UsersTable.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
};
