import React, { FC, useEffect, useRef } from 'react';

// Styles
import './Checkbox.scss';
import Label from '../../atoms/Label';
import HelperText from '../../atoms/HelperText';
import { CheckMark, MinusOutline, Square } from '@geneui/icons';
import tr from '@faker-js/faker/locales/tr';
interface ICheckboxProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * Checkbox component allows users to select one or more options from a set of choices. Each checkbox can be either checked or unchecked, indicating a binary state. Checkboxes are commonly used in forms, settings, and lists where multiple selections are needed.
 */
const Checkbox: FC<ICheckboxProps> = ({ size }) => {
    const interRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (interRef.current) {
            interRef.current.indeterminate = true;
        }
    }, [interRef]);

    return (
        <div className="testHolder">
            {/* todo modifier classnames "checkbox_error" "checkbox_disabled" "checkbox_readOnly"*/}
            <div className="checkbox">
                <label className="checkbox__label">
                    <div className="checkbox__imitationHolder">
                        <div className="checkbox__imitationHolderInner">
                            <input type="checkbox" className="checkbox__input" />
                            <div className="checkbox__imitation">
                                <CheckMark className="checkbox__icon" size={16} />
                            </div>
                        </div>
                    </div>
                    <span>label</span>
                </label>

                <div className="checkbox__infoContainer">
                    <HelperText text="Helpeer Text" />
                </div>
            </div>
        </div>
    );
};

export { ICheckboxProps, Checkbox as default };
