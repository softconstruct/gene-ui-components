import React from 'react';
import classnames from 'classnames';

// Components
import Icon from '../../../atoms/Icon';

function MapChartIconButton({ disabled, name, onClick }) {
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
