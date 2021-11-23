import React from 'react';
import PropTypes from 'prop-types';

export default function HeaderCell({ color, content }) {
    return (
        <th
            className={
                'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-200 text-blueGray-500 border-blueGray-100' +
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
};
