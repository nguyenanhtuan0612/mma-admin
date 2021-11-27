import React from 'react';
import PropTypes from 'prop-types';

export default function HeaderCell({ content, width }) {
    return (
        <th
            className={
                width +
                ' px-6 align-middle py-3 text-md uppercase whitespace-nowrap font-semibold text-center bg-blueGray-200 text-blueGray-500 border-blueGray-100'
            }
        >
            {content}
        </th>
    );
}
