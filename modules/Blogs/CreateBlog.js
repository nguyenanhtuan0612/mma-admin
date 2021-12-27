import React, { useContext, useEffect, useRef, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { AuthContext } from 'layouts/Admin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.umd';
import * as Yup from 'yup';
import { Select } from 'antd';
import { getPageFiles } from 'next/dist/server/get-page-files';

const { Option } = Select;
const { checkNull, avatarImg, dateFormat, checkSelect, formatCurrency, localStringToNumber } = displayHelpers;

export default function CreateBlog() {
    const router = useRouter();

    const [isRoot, setIsRoot] = useState(false);
    const [tagList, setTagList] = useState([]);
    const [pageList, setPageList] = useState([]);

    const auth = useContext(AuthContext);
    const [state, setState] = useState({
        class: '',
        birthday: '',
        tags: [],
        page: '',
        pageId : null,
        active: true,
        description: '',
    });

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Tên khoá học là bắt buộc'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    // get functions to build form with useForm() hook
    const { handleSubmit, formState, register } = useForm(formOptions);
    const { errors } = formState;

    useEffect(async () => {
        setIsRoot(auth.role == 'root' ? true : false);
    }, [auth]);

    useEffect(async () => {
        const page = await getPage();
        const data = await getData();
        setTagList(
            data.data.rows.map(tag => {
                return <Option key={tag.id} value={tag.slug}>{tag.name}</Option>;
            }),
        );
        setPageList(
            page.data.rows.map(page => {
                return <Option key={page.id} value={page.id}>{page.name}</Option>;
            }),
        );
    }, []);
    async function getPage(search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [];
        if (search != '') {
            filter.push({
                operator: 'iLike',
                value: `${search}`,
                property: `name`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.getListData('pages', strFilter, sort, start, 10);
        return data;
    }

    async function getData(search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [];
        if (search != '') {
            filter.push({
                operator: 'iLike',
                value: `${search}`,
                property: `name`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.getListData('tags', strFilter, sort, start, 10);
        return data;
    }

    async function onCreate() {
        let dataBlog= state;
        dataBlog.pageId = state.page;
        const data = await createBlog(dataBlog);
        if (!data) {
            return;
        }
        openNotification(notiType.success, 'Tạo mới thành công !');
        router.push('/blogs');
    }

    async function createBlog(body) {
        const { data } = await serviceHelpers.createData('blogs', body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function handleChangeName(e) {
        e.preventDefault();

        setState({
            ...state,
            title: e.target.value,
        });
    }

    async function handleChangeActive(e) {
        e.preventDefault();
        setState({
            ...state,
            active: e.target.value === 'true' ? true : false,
        });
    }

    async function handleChangeContent(e) {
        e.preventDefault();
        setState({
            ...state,
            content: e.target.value,
        });
    }

    function handlePageChange(value) {
        setState({
            ...state,
            page: value,
        });
    }
    function handleTagChange(value) {
        setState({
            ...state,
            tags: [...value],
        });
    }

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">{checkNull(state.name)}</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <div className="w-full px-4 2xl:flex mt-4 mb-6 h-full">
                        <div className="2xl:w-6/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Tên Blog: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('title')}
                                            value={checkNull(state.title, '')}
                                            onChange={handleChangeName}
                                            type="text"
                                            placeholder="Tên blog"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.title?.message}</div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Nội dung (html):
                                        </label>
                                        <textarea
                                            value={checkNull(state.content, '')}
                                            onChange={handleChangeContent}
                                            type="text"
                                            placeholder="Content"
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Tag: <span className="text-red-500">*</span>
                                        </label>
                                        <div className="w-8/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Please select"
                                                defaultValue={[]}
                                                onChange={handleTagChange}
                                            >
                                                {tagList}
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.Tag?.message}</div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                            Page: <span className="text-red-500">*</span>
                                        </label>
                                        <div className="w-8/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                            <Select
                                                // mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Please select"
                                                defaultValue= {''}
                                                onChange={handlePageChange}
                                            >
                                                <Option disabled={state.tags.length > 1 ? true : false}></Option>
                                                {pageList}
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="w-full justify-center items-center flex text-red-500">{errors.Tag?.message}</div>
                                </div>
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Trạng thái:</label>
                                        <select
                                            value={checkSelect(state.active)}
                                            onChange={handleChangeActive}
                                            className="w-8/12 px-3 py-2 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150"
                                        >
                                            <option value="true">Hoạt động</option>
                                            <option value="false">Vô hiệu</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-6 flex items-center mt-2 justify-center">
                                <button
                                    className="mx-2 mb-2 bg-yellow-500 hover:bg-yellow-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => router.back()}
                                >
                                    Trở về
                                </button>
                                <button
                                    className="mx-2 mb-2 bg-sky-400 hover:bg-sky-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={handleSubmit(onCreate)}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
