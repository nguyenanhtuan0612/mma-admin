import React from 'react';
import PropTypes from 'prop-types';

export default function HeaderCell({ content, width }) {
    return (
        <th
            className={
                width +
                ' xl:px-1 px-6 align-middle py-3 xl:text-xs 2xl:text-md text-xs uppercase whitespace-nowrap font-semibold text-center bg-blueGray-200 text-blueGray-500 border-blueGray-100'
            }
        >
            {content}
        </th>
    );
}
