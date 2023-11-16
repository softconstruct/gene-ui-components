import React from 'react';

import classnames from 'classnames';
import Icon from '../../../atoms/Icon';

function MapChartIconButton({ children, disabled, name, onClick }) {
    return (
        <button
            className={classnames('zoom-button', {
                disabled
            })}
            onClick={onClick}
        >
            <Icon type={name} />
        </button>
    );
}

export default MapChartIconButton;
