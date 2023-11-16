import React, { forwardRef } from 'react';
import classnames from 'classnames';

import Icon from '../../../atoms/Icon';
import Label from '../../../atoms/Label';
import Checkbox from '../../../molecules/Checkbox';

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
