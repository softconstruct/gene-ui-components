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
            {/* todo modifier classnames "checkbox_labelTop" "checkbox_error" "checkbox_disabled" "checkbox_readOnly"*/}
            <div className="checkbox">
                <Label
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Default" />
                </div>
            </div>
            <div className="checkbox checkbox_error">
                <Label
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Error" type="danger" />
                </div>
            </div>
            <div className="checkbox checkbox_warning">
                <Label
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Warning" type="warning" />
                </div>
            </div>
            <div className="checkbox checkbox_disabled">
                <Label
                    disabled
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Disabled" isDisabled />
                </div>
            </div>
            <div className="checkbox checkbox_readOnly">
                <Label
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Read Only" />
                </div>
            </div>
            {/*label top states START*/}
            <div className="checkbox checkbox_labelTop">
                <Label
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Default" />
                </div>
            </div>
            <div className="checkbox checkbox_labelTop checkbox_error">
                <Label
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Error" type="danger" />
                </div>
            </div>
            <div className="checkbox checkbox_labelTop checkbox_warning">
                <Label
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Warning" type="warning" />
                </div>
            </div>
            <div className="checkbox checkbox_labelTop checkbox_disabled">
                <Label
                    disabled
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Disabled" isDisabled />
                </div>
            </div>
            <div className="checkbox checkbox_labelTop checkbox_readOnly">
                <Label
                    labelText="label"
                    className="checkbox__label"
                    children={
                        <span className="checkbox__imitationHolder">
                            <span className="checkbox__imitationHolderInner">
                                <input type="checkbox" className="checkbox__input" />
                                <span className="checkbox__imitation">
                                    <CheckMark className="checkbox__icon" size={16} />
                                </span>
                            </span>
                        </span>
                    }
                />
                <div className="checkbox__infoContainer">
                    <HelperText text="State Read Only" />
                </div>
            </div>
        </div>
    );
};

export { ICheckboxProps, Checkbox as default };
