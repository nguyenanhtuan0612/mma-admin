import React from 'react';
import { displayHelpers } from 'helpers';
import Link from 'next/link';

export default function RowItemQuote({ data }) {

    const { checkNull, getDate ,limitLength} = displayHelpers;
    const { id, bookId, quote, authorName, categoryId, createdAt } = data;
    return (
        <tr>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{id}</td>
            <th>
                <Link href={`/quotes/${id}`} as={`/quotes/${id}`}>
                    <a
                        href={`/quotes/${id}`}
                        className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs whitespace-nowrap p-4 text-center flex items-center"
                    >
                        <span className="ml-3 font-bold text-blueGray-700 hover:text-sky-600">{limitLength(quote)}</span>
                    </a>
                </Link>
            </th>
            {/* <td className="px-2 2xl:px-6 align-middle 2xl:text-sm text-xs xl:text-xs text-center whitespace-nowrap p-4">{limitLength(quote)}</td> */}
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{checkNull(bookId)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{checkNull(authorName)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{checkNull(categoryId)}</td>
            <td className="px-2 2xl:px-6 align-middle 2xl:text-sm xl:text-xs text-xs text-center whitespace-nowrap p-4">{getDate(createdAt)}</td>
        </tr>
    );
}
