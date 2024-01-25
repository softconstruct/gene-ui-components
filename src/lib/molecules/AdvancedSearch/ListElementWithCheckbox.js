import React, { useCallback, useRef, useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Helpers
import { useEllipsisDetection } from 'hooks';
import { noop } from 'utils';

// Components
import Icon from '../../atoms/Icon';
import Checkbox from '../Checkbox';
import Tooltip from '../Tooltip';

function ListElementWithCheckbox({ item, onSelect }) {
    const { checked, icon, name } = item;
    const checkboxRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const nameRef = useRef(null);
    const isNameTruncated = useEllipsisDetection(nameRef);

    // Handle blur event to clear focus state
    const handleBlur = useCallback(() => setIsFocused(false), []);

    // Handle Focus event to add focus state
    const handleFocus = useCallback(() => setIsFocused(true), []);

    return (
        <li
            className={classnames('listElementWithCheckbox', {
                'listElementWithCheckbox-hover': isFocused
            })}
        >
            <label className="listElementWithCheckbox__label">
                {item.hasOwnProperty('checked') && (
                    <Checkbox
                        ref={checkboxRef}
                        checked={checked}
                        onChange={() => {
                            onSelect(item);
                        }}
                        className="listElementWithCheckbox__checkbox"
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                    />
                )}

                {icon && <Icon type={icon} className="listElementWithCheckbox__icon" />}

                {name && (
                    <Tooltip text={name} isVisible={isNameTruncated}>
                        <span className="listElementWithCheckbox__name ellipsis-text" ref={nameRef}>
                            {name}
                        </span>
                    </Tooltip>
                )}
            </label>
        </li>
    );
}

ListElementWithCheckbox.defaultProps = {
    onSelect: noop,
    item: {
        checked: false
    }
};
ListElementWithCheckbox.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string,
        checked: PropTypes.bool,
        icon: PropTypes.string
    })
};

export default ListElementWithCheckbox;
