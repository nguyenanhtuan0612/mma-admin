import React, { useContext, useEffect, useRef, useState } from 'react';
import { serviceHelpers, displayHelpers, openNotification, notiType } from 'helpers';
import { useRouter } from 'next/router';
import { AuthContext } from 'layouts/Admin';

import { Select, Input , AutoComplete } from 'antd';

const { Option } = Select;
const { checkNull, checkSelect } = displayHelpers;

export default function CreateQuote() {
    const router = useRouter();
    const [isRoot, setIsRoot] = useState(false);
    const [listening, setListening] = useState(true);
    const [searchBy, setSearchBy] = useState('');
    const [bookList, setBookList] = useState([]);
    const [category, setCategory] = useState([]);
    const [option, setOption] = useState('');

    const auth = useContext(AuthContext);
    const [state, setState] = useState({
        categoryId: null,
        authorName: '',
        bookId: null,
        quote: '',
    });

    useEffect(async () => {
        setIsRoot(auth.role == 'root' ? true : false);

        const data = await getCategory();
        setCategory(
            data.data.rows.map(cate => {
                return (
                    <Option key={cate.id} value={cate.id}>
                        {cate.name}
                    </Option>
                );
            }),
        );
        const dataBook = await getBook();
        setBookList(
            dataBook.data.rows.map(book => {
                return (
                    <AutoComplete.Option key={book.id}  value={book.name}>
                        {book.name}
                    </AutoComplete.Option>
                );
            }),
        );
    }, []);
    const handleSearch = async (value) => {

        const dataBook = await getBook(value);
        setBookList(
            dataBook.data.rows.map(book => {
                return (
                    <AutoComplete.Option key={book.id} value={book.name}>
                        {book.name}
                    </AutoComplete.Option>
                );
            }),
        );
        setListening(!listening);
      };
    
    useEffect(async () => {
        if (searchBy && searchBy == 'bookId') {
            setOption(
                <>
                    <div className="w-full px-4 mb-2">
                        <div className="relative w-full mb-3 items-center flex">
                            <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                Book: <span className="text-red-500">*</span>
                            </label>
                            <div className="w-8/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                <AutoComplete
                                    mode='multiple'
                                    style={{ width: '100%' }}
                                    allowClear
                                    // onChange={handleBookChange}
                                    onSearch={handleSearch}
                                    placeholder="input here"
                                    onSelect={handleBookChange}
                                >
                                    {bookList}  

                                </AutoComplete>
                            </div>
                        </div>
                    </div>
                </>,
            );
        }
        if (searchBy && searchBy == 'categoryId') {
            setOption(
                <>
                    <div className="w-full px-4 mb-2">
                        <div className="relative w-full mb-3 items-center flex">
                            <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                Category: <span className="text-red-500">*</span>
                            </label>
                            <div className="w-8/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Please select"
                                    defaultValue={''}
                                    onChange={handleCateChange}
                                >
                                    {category}
                                </Select>
                            </div>
                        </div>
                    </div>
                </>,
            );
        }
        if (searchBy && searchBy == 'authorName') {
            setOption(
                <>
                    <div className="w-full px-4 mb-2">
                        <div className="relative w-full mb-3 items-center flex">
                            <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">
                                Author Name: <span className="text-red-500">*</span>
                            </label>
                            <div className="w-8/12 placeholder-blueGray-400 text-blueGray-700 bg-white rounded 2xl:text-sm text-xs border font-bold shadow focus:border-1 ease-linear transition-all duration-150">
                                <Input placeholder="Basic usage" onChange={handleAuthorName} />
                            </div>
                        </div>
                    </div>
                </>,
            );
        }
    }, [listening]);
    async function onCreate() {
        let dataQuote = state;
        const data = await createQuote(dataQuote);
        if (!data) {
            return;
        }
        openNotification(notiType.success, 'Tạo mới thành công !');
        router.push('/quotes');
    }

    async function getBook(search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [];
        if (search != '') {
            filter.push({
                operator: 'search',
                value: `${search}`,
                property: `name,tikiBookId`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.getListData('books', strFilter, sort, start);
        return data;
    }
    async function getCategory(search = '', start = 0, sort = '[{"property":"createdAt","direction":"ASC"}]') {
        const filter = [];
        if (search != '') {
            filter.push({
                operator: 'search',
                value: `${search}`,
                property: `name,slug`,
            });
        }
        const strFilter = JSON.stringify(filter);
        const { data } = await serviceHelpers.getListData('categories', strFilter, sort, start, 10);
        return data;
    }

    async function createQuote(body) {
        const { data } = await serviceHelpers.createData('quotes', body);
        if (!data) return openNotification(notiType.error, 'Lỗi hệ thống');

        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode === 404) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data;
    }

    async function handleChangeContent(e) {
        e.preventDefault();
        setState({
            ...state,
            quote: e.target.value,
        });
    }

    async function handleAuthorName(e) {
        e.preventDefault();
        setState({
            ...state,
            authorName: e.target.value,
        });
    }

    async function handleCateChange(value) {
        setState({
            ...state,
            categoryId: value,
        });
    }

    async function handleBookChange(value, options) {
        setState({
            ...state,
            bookId: Number(options.key),
        });
    }

    async function handleChooseType(value) {
        setSearchBy(value);
        setListening(!listening);
    }

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <b className="text-xl font-semibold leading-normal text-blueGray-700">Create Quote</b>
                    </div>
                </div>
                <div className={'relative flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6 justify-center flex'}>
                    <div className="w-full px-4 2xl:flex mt-4 mb-6 h-full">
                        <div className="2xl:w-6/12 w-full px-4 py-4 items-center 2xl:text-base text-xs text-blueGray-700 ">
                            <div className="flex flex-wrap ">
                                <div className="w-full px-4 mb-2">
                                    <div className="relative w-full mb-3 items-center flex">
                                        <label className="w-4/12 text-blueGray-600 2xl:text-sm text-xs font-bold text-right mr-2">Quote :</label>
                                        <textarea
                                            value={checkNull(state.quote, '')}
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
                                                style={{ width: '100%' }}
                                                placeholder="Please select"
                                                value={searchBy}
                                                onChange={handleChooseType}
                                            >
                                                <Option value="bookId">Book Id</Option>
                                                <Option value="authorName">Author Name</Option>
                                                <Option value="categoryId">Category Id</Option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                {searchBy != '' ? option : null}
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
                                    onClick={onCreate}
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
