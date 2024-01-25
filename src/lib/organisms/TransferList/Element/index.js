import React, { forwardRef } from 'react';
import classnames from 'classnames';

// Components
import Icon from '../../../atoms/Icon';
import Checkbox from '../../../molecules/Checkbox';

// Styles
import './index.scss';

const TransferElement = forwardRef(
    ({ disabled, hovered, dragged, checked, label, onClick, readOnly, minimalistic, indeterminate }, ref) => (
        <div
            ref={ref}
            onClick={onClick}
            className={classnames('bc-transfer-element', 'crs-external-hover', 'crs-external-active', {
                minimalistic,
                disabled,
                hovered,
                dragged,
                readOnly
            })}
        >
            <Checkbox indeterminate={indeterminate} checked={checked} label={label} />
            {!readOnly && !minimalistic && <Icon type="bc-icon-drag" />}
        </div>
    )
);

export default TransferElement;
