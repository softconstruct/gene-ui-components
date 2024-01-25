import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { inputConfig } from 'configs';
import { noop, callAfterDelay } from 'utils';
import { useClickOutside } from 'hooks';
import { actionTypes, keyDownKeys, SPACE_HEIGHT } from './config';

// Components
import Icon from '../../atoms/Icon';
import CustomScrollbar from '../../atoms/Scrollbar';
import Tooltip from '../Tooltip';

// Local components
import TagWrapper from './TagWrapper';

// Styles
import './index.scss';

/**
 * Combo box
 */
function ComboBox(props) {
    const {
        infoIconTooltipProps,
        labelAppearance,
        withInfoIcon,
        flexibility,
        placeholder,
        withDelete,
        className,
        maxHeight,
        required,
        tabIndex,
        onChange,
        readOnly,
        withEdit,
        disabled,
        label,
        regEx
    } = props;

    const inputLabel = label || placeholder;
    const asterisk = required ? '*' : '';
    const isControlled = 'value' in props && props.value;

    const [activeTagIndex, setActiveTagIndex] = useState(null);
    const [editModeIndex, setEditModeIndex] = useState(null);
    const [values, setValues] = useState([]);
    const scrollbarRef = useRef();
    const activeRowRef = useRef();
    const inputRef = useRef();

    const checkIsValid = useCallback((value) => (regEx ? new RegExp(regEx).test(value) : true), [regEx]);

    const onValueChangeHandler = useCallback(
        ({ label, index }) => {
            const valuesClone = [...values];
            const isValid = checkIsValid(label);
            const added = index === undefined;
            if (added) {
                valuesClone.push({ label, isValid });
            } else {
                valuesClone[index].label = label;
                valuesClone[index].isValid = isValid;
                inputRef.current.focus();
                setEditModeIndex(null);
            }
            !isControlled && setValues(valuesClone);
            onChange({
                value: valuesClone,
                additional: {
                    type: added ? actionTypes.add : actionTypes.edit,
                    index: added ? valuesClone.length - 1 : index,
                    isValid,
                    label
                }
            });
        },
        [values, checkIsValid, isControlled, onChange, setEditModeIndex]
    );

    const onDeleteHandler = useCallback(
        (index) => {
            const valuesClone = [...values];
            const item = valuesClone[index];
            valuesClone.splice(index, 1);
            !isControlled && setValues(valuesClone);
            !valuesClone.length && setActiveTagIndex(null);
            onChange({
                value: valuesClone,
                additional: {
                    type: actionTypes.delete,
                    index,
                    ...item
                }
            });
            inputRef.current && callAfterDelay(() => inputRef.current.focus());
        },
        [values, isControlled, onChange, inputRef]
    );

    const init = useCallback(() => {
        if (isControlled && Array.isArray(props.value)) {
            setValues(
                props.value.map((row) => ({
                    ...row,
                    isValid: checkIsValid(row?.label)
                }))
            );
        } else if (props.defaultValue && Array.isArray(props.defaultValue)) {
            setValues(
                props.defaultValue.map((row) => ({
                    ...row,
                    isValid: checkIsValid(row?.label)
                }))
            );
        }
    }, [checkIsValid, isControlled, props.defaultValue, props.value]);

    const handleOutsideClick = useClickOutside(() => {
        scrollbarRef.current.scrollTop(0, 0);
        setActiveTagIndex(null);
    });

    const onClickHandler = useCallback(() => {
        if (disabled || readOnly) return;
        inputRef.current && callAfterDelay(() => inputRef.current.focus());
    }, [disabled, readOnly, inputRef]);

    const onKeyPress = useCallback(
        (type) => {
            switch (type) {
                case keyDownKeys.arrowLeft:
                    if (values.length && activeTagIndex !== 0) {
                        setActiveTagIndex(activeTagIndex === null ? values.length - 1 : activeTagIndex - 1);
                    }
                    break;
                case keyDownKeys.arrowRight:
                    if (values.length && activeTagIndex !== null && activeTagIndex < values.length - 1) {
                        setActiveTagIndex(activeTagIndex + 1);
                    }
                    break;
                case keyDownKeys.delete:
                case keyDownKeys.backspace:
                    if (withDelete) {
                        if (activeTagIndex !== null) {
                            activeTagIndex > 0 && setActiveTagIndex(activeTagIndex - 1);
                            onDeleteHandler(activeTagIndex);
                        } else if (values.length) {
                            onDeleteHandler(values.length - 1);
                        }
                    }
                    break;
            }
        },
        [activeTagIndex, onDeleteHandler, values.length, withDelete]
    );

    const onFocusHandler = useCallback(
        () => editModeIndex === null && !disabled && !readOnly && inputRef?.current?.focus(),
        [editModeIndex, disabled, readOnly, inputRef]
    );

    useEffect(init, [props.defaultValue, props.value]);

    useEffect(() => {
        if (activeTagIndex && activeRowRef.current) {
            const scrollbarRefBounding = scrollbarRef.current.container.getBoundingClientRect();
            const activeRowRefBounding = activeRowRef.current.getBoundingClientRect();
            if (scrollbarRefBounding.top > activeRowRefBounding.top - SPACE_HEIGHT) {
                scrollbarRef.current.scrollTop(
                    scrollbarRef.current.viewScrollTop - activeRowRefBounding.height - SPACE_HEIGHT
                );
            } else if (
                activeRowRefBounding.top + activeRowRefBounding.height + SPACE_HEIGHT >
                scrollbarRefBounding.top + maxHeight
            ) {
                scrollbarRef.current.scrollTop(
                    scrollbarRef.current.viewScrollTop + activeRowRefBounding.height + SPACE_HEIGHT
                );
            }
        }
    }, [activeTagIndex, scrollbarRef]);
    return (
        <div
            onFocus={onFocusHandler}
            ref={handleOutsideClick}
            tabIndex={tabIndex}
            className={classnames('combo-box', `f-${flexibility}`, className, {
                'read-only': readOnly,
                disabled
            })}
        >
            {labelAppearance === inputConfig.labelAppearance[1] && (
                <div className="title ellipsis-text">
                    <Tooltip position="auto" {...infoIconTooltipProps}>
                        <span className="ellipsis-text">
                            {asterisk} {inputLabel}
                        </span>
                    </Tooltip>
                    {withInfoIcon && (
                        <Tooltip position="auto" {...infoIconTooltipProps}>
                            <Icon type="bc-icon-info" />
                        </Tooltip>
                    )}
                </div>
            )}
            <div className="combo-box-container" onClick={onClickHandler}>
                <div className="element-back">
                    {labelAppearance === inputConfig.labelAppearance[2] && (
                        <div className="swap-label">
                            <div className="swap">
                                <div
                                    className={classnames('input-swap-animate ellipsis-text', {
                                        hide: !values.length
                                    })}
                                >
                                    <Tooltip position="auto" {...infoIconTooltipProps}>
                                        <span className="ellipsis-text">
                                            {asterisk} {inputLabel}
                                        </span>
                                    </Tooltip>
                                    {withInfoIcon && (
                                        <Tooltip position="auto" {...infoIconTooltipProps}>
                                            <Icon type="bc-icon-info" />
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={classnames({
                        'pointer-events-none': disabled || readOnly
                    })}
                >
                    <CustomScrollbar autoHeight autoHeightMax={maxHeight} ref={scrollbarRef}>
                        <div className="boxes">
                            {values.map((value, index) => (
                                <TagWrapper
                                    key={`${JSON.stringify(value)}${index}`}
                                    onChangeHandler={onValueChangeHandler}
                                    setActiveTagIndex={setActiveTagIndex}
                                    setEditModeIndex={setEditModeIndex}
                                    editMode={editModeIndex === index}
                                    hasIcon={!readOnly && withDelete}
                                    onDeleteHandler={onDeleteHandler}
                                    activeTagIndex={activeTagIndex}
                                    activeRowRef={activeRowRef}
                                    onKeyPress={onKeyPress}
                                    ref={{ activeRowRef }}
                                    withEdit={withEdit}
                                    hasTags
                                    index={index}
                                    {...value}
                                />
                            ))}
                            {withEdit && !disabled && !readOnly && (
                                <TagWrapper
                                    placeholder={!values.length ? placeholder : ''}
                                    onChangeHandler={onValueChangeHandler}
                                    setActiveTagIndex={setActiveTagIndex}
                                    setEditModeIndex={setEditModeIndex}
                                    activeTagIndex={activeTagIndex}
                                    hasTags={!!values.length}
                                    onKeyPress={onKeyPress}
                                    withEdit={withEdit}
                                    editMode
                                    ref={{
                                        createInputRef: inputRef
                                    }}
                                />
                            )}
                        </div>
                    </CustomScrollbar>
                </div>
            </div>
        </div>
    );
}

ComboBox.propTypes = {
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Specify a "label" appearance
     */
    labelAppearance: PropTypes.oneOf(inputConfig.labelAppearance),
    /**
     * How to display inscription in relation to it's parent in ExtendedInput
     */
    flexibility: PropTypes.oneOf(inputConfig.flexibility),
    /**
     * Define is input required or no.
     */
    required: PropTypes.bool,
    /**
     * Define is  need input info icon required.
     */
    withInfoIcon: PropTypes.bool,
    /**
     * Tooltip props
     */
    infoIconTooltipProps: PropTypes.shape({ ...Tooltip.propTypes }),
    /**
     * validation regex
     */
    regEx: PropTypes.string,
    /**
     * On change handler
     */
    onChange: PropTypes.func,
    /**
     * Use this prop to get specified value when "onChange" is fired
     */
    value: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string
        })
    ),
    /**
     * Initial Combobox value.
     */
    defaultValue: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string
        })
    ),
    /**
     * Combobox disabled state
     */
    disabled: PropTypes.bool,
    /**
     * Combobox readOnly state
     */
    readOnly: PropTypes.bool,
    /**
     * Is Combobox in edit mode
     */
    withEdit: PropTypes.bool,
    /**
     * Can Delete tags
     */
    withDelete: PropTypes.bool,
    /**
     * Max height of Combobox
     */
    maxHeight: PropTypes.number,
    /**
     * Since the editor has its own modal windows, there may be a problem with
     * the zIndex so you can change it using this prop
     */
    tabIndex: PropTypes.number
};

// toDo Add validation scheme fot form
ComboBox.defaultProps = {
    labelAppearance: inputConfig.labelAppearance[0],
    flexibility: inputConfig.flexibility[0],
    label: '',
    placeholder: '',
    onChange: noop,
    regEx: '',
    withInfoIcon: false,
    required: false,
    disabled: false,
    readOnly: false,
    withEdit: true,
    withDelete: true,
    maxHeight: 510,
    tabIndex: 0,
    infoIconTooltipProps: {}
};

ComboBox.displayName = 'ComboBox';

export default ComboBox;
