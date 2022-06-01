import { displayHelpers, notiType, openNotification, serviceHelpers } from 'helpers';
import React from 'react';

const { checkNull, formatCurrency } = displayHelpers;

// components

export default function CardPageVisits() {
    const [list, setList] = React.useState([]);

    React.useEffect(async () => {
        const data = await getDetailLesson();
        setList(data);
    }, []);

    async function getDetailLesson() {
        const rs = await serviceHelpers.getListData('userCousres/report');
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs;
        if (data.statusCode === 400)
            return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data.data.data;
    }

    function rowItem(data) {
        return (
            <tr>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {checkNull(data.name)}
                </th>
                <td className="border-t-0 px-6 align-middle text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {checkNull(data.count)}
                </td>
                <td className="border-t-0 px-6 align-middle text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {formatCurrency(data.amount)}
                </td>
            </tr>
        );
    }

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h2 className="font-semibold text-xl text-blueGray-700">
                                Khóa học được mua nhiều nhất
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse mb-1">
                        <thead>
                            <tr>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Tên khóa học
                                </th>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid  border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                                    Số lượt mua
                                </th>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                                    Giá khóa học
                                </th>
                            </tr>
                        </thead>
                        <tbody>{list.map(item => rowItem(item))}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
