import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import HeaderCell from './components/HeaderCell';
import RowItemUser from './components/RowItemUser';

export default function UsersTable({ color }) {
    const data = [
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: true,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: false,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: true,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: true,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: true,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: true,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: true,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: true,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: true,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
        {
            id: '8fef0b8f-dbf6-416e-ae33-39d126b73d74',
            email: 'tuananhvd1998@gmail.com',
            firstName: 'Nguyễn Anh',
            lastName: 'Tuấn',
            googleId: null,
            facebookId: null,
            gender: null,
            active: true,
            avatarImage: null,
            role: 'root',
            birthday: null,
            fullName: 'Nguyễn Anh Tuấn',
            createdAt: '2021-11-22T16:51:45.789Z',
            updatedAt: '2021-11-22T16:51:45.789Z',
        },
    ];

    return (
        <>
            <div
                className={
                    'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded border-2 ' +
                    (color === 'light' ? 'bg-white' : 'bg-blueGray-700 text-white')
                }
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-blueGray-100">
                    <div className="flex flex-wrap mt-2">
                        <div className="w-full lg:w-6/12 px-4">
                            <div className="relative w-full mb-3 flex items-center">
                                <label className="uppercase mr-4 text-blueGray-600 w-1/12 text-xs font-bold" htmlFor="grid-password">
                                    HỌ Tên:
                                </label>
                                <input
                                    type="email"
                                    className="border-0 px-3 py-3 placeholder-blueGray-400 text-blueGray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-8/12 ease-linear transition-all duration-150"
                                    placeholder="example@email.com"
                                />
                                <div className="w-3/12">
                                    <button
                                        className="mx-4 bg-lightBlue-500 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
                                    >
                                        Tìm kiếm
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
                                <HeaderCell content={'HỌ TÊN'}></HeaderCell>
                                <HeaderCell content={'ĐĂNG NHẬP QUA'}></HeaderCell>
                                <HeaderCell content={'NGÀY TẠO'}></HeaderCell>
                                <HeaderCell content={'LOẠI THÀNH VIÊN'}></HeaderCell>
                                <HeaderCell content={'TRẠNG THÁI'}></HeaderCell>
                                <HeaderCell content={'HOẠT ĐỘNG'}></HeaderCell>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                                data.map((user, index) => <RowItemUser data={user} key={index} />)
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
                            <Pagination total={data.length} pageSize={10} showSizeChanger={false} />
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
