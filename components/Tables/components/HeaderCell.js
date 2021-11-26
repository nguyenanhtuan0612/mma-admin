import React from 'react';
import PropTypes from 'prop-types';

export default function HeaderCell({ color, content, width }) {
    return (
        <th
            className={
                width +
                ' px-6 align-middle py-3 text-md uppercase whitespace-nowrap font-semibold text-center bg-blueGray-200 text-blueGray-500 border-blueGray-100' +
                (color === 'light' ? '' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')
            }
        >
            {content}
        </th>
    );
}

HeaderCell.defaultProps = {
    color: 'light',
};

HeaderCell.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
    content: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
};
