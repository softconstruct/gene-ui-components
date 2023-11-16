import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { stopEvent, callAfterDelay } from 'utils';
import { useKeyDown, useClickOutside } from 'hooks';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { keyDownKeys } from '../config';
import { Icon } from '../../../atoms';
import Tooltip from '../../Tooltip';
import Tag from '../../Tag';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

/**
 * Tag Wrapper
 */
const TagWrapper = forwardRef((props, ref) => {
    const { createInputRef, activeRowRef } = ref;
    const {
        isValid,
        label,
        editMode,
        index,
        onChangeHandler,
        onDeleteHandler,
        placeholder,
        hasTags,
        hasIcon,
        onKeyPress,
        activeTagIndex,
        setEditModeIndex,
        setActiveTagIndex,
        withEdit
    } = props;
    const [hasTooltip, setHasTooltip] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isEditMode, setIsEditMode] = useState(editMode);
    const inputRef = useRef(null);
    const tagRef = useRef(null);

    const isActive = useMemo(() => index === activeTagIndex, [activeTagIndex, index]);
    const createMode = useMemo(() => index === undefined, [index]);

    const editModeChangeHandler = useCallback(() => {
        setIsEditMode(editMode);
        editMode && callAfterDelay(() => inputRef?.current?.focus());
    }, [editMode, inputRef]);

    const stopEventHandler = (e) => stopEvent(e, true);

    const keyDownHandler = useCallback(
        (e) => {
            switch (e.key) {
                case keyDownKeys.tab:
                case keyDownKeys.enter:
                    e.key === keyDownKeys.tab &&
                        ((isEditMode && !createMode) || (createMode && inputValue && inputValue.trim().length)) &&
                        stopEventHandler(e);
                    setEditModeIndex && setEditModeIndex(null);
                    if (inputValue && inputValue.trim().length && isEditMode) {
                        setInputValue(createMode ? '' : inputValue);
                        onChangeHandler({ label: inputValue, index });
                        !createMode && setIsEditMode(false);
                    } else if (!inputValue && !createMode) {
                        onDeleteHandler(index);
                        setIsEditMode(false);
                    } else if (activeTagIndex !== null && setEditModeIndex) {
                        e.key === keyDownKeys.enter && setEditModeIndex(activeTagIndex);
                        e.key === keyDownKeys.tab && setActiveTagIndex(null);
                    }
                    break;
                case keyDownKeys.escape:
                    setEditModeIndex && setEditModeIndex(null);
                    setActiveTagIndex && setActiveTagIndex(null);
                    if (!createMode) {
                        setIsEditMode(false);
                        setInputValue(label || '');
                    }
                    break;
                case keyDownKeys.arrowRight:
                case keyDownKeys.backspace:
                case keyDownKeys.arrowLeft:
                case keyDownKeys.delete:
                    createMode && !inputValue && withEdit && onKeyPress(e.key);
                    break;
            }
        },
        [
            activeTagIndex,
            createMode,
            index,
            inputValue,
            isEditMode,
            label,
            onChangeHandler,
            onDeleteHandler,
            onKeyPress,
            setActiveTagIndex,
            setEditModeIndex,
            withEdit
        ]
    );
    const dblclickHandler = useCallback(() => {
        const handleClick = () => {
            if (createMode || !withEdit || isEditMode) return;
            setIsEditMode((prev) => !prev);
            setEditModeIndex(index);
            setActiveTagIndex(null);
            (createInputRef || inputRef).current.focus();
        };

        const element = tagRef?.current;
        element && element.addEventListener('dblclick', handleClick);
        return () => {
            element && element.removeEventListener('dblclick', handleClick);
        };
    }, [createMode, isEditMode, createInputRef, withEdit, setEditModeIndex, index, setActiveTagIndex]);

    const handleOutsideClick = useClickOutside((event) => {
        if (tagRef && !tagRef.current.contains(event.target)) {
            if (!createMode && isEditMode) {
                setIsEditMode(false);
                if (label !== inputValue) {
                    if (inputValue && inputValue.trim().length) {
                        onChangeHandler({ label: inputValue, index });
                    } else {
                        onDeleteHandler(index);
                    }
                }
            } else if (inputValue && createMode) {
                inputValue.trim().length && onChangeHandler({ label: inputValue, index });
                setInputValue('');
            }
        }
    });

    const handleChangeLabel = useCallback(() => {
        setHasTooltip(tagRef?.current?.offsetWidth + 130 > tagRef?.current?.offsetParent?.offsetWidth);
    }, [setHasTooltip, tagRef]);

    const inputChangeHandler = useCallback(
        (e) => {
            setInputValue(e.target.value);
            createMode && setActiveTagIndex(null);
        },
        [createMode, setActiveTagIndex]
    );

    useKeyDown(keyDownHandler, [keyDownHandler], createInputRef || inputRef, [
        keyDownKeys.enter,
        keyDownKeys.escape,
        keyDownKeys.arrowLeft,
        keyDownKeys.arrowRight,
        keyDownKeys.backspace,
        keyDownKeys.tab,
        keyDownKeys.delete
    ]);

    useEffect(dblclickHandler, [createInputRef, tagRef, inputRef, withEdit, isEditMode]);
    useEffect(() => label && setInputValue(label), [label]);
    useEffect(editModeChangeHandler, [editMode, inputRef]);
    useEffect(handleChangeLabel, [tagRef, label]);

    return (
        <div className={classnames('tag-wrapper', { 'flex-basis': hasTags })} ref={tagRef}>
            <div ref={handleOutsideClick}>
                {isEditMode ? (
                    <>
                        <input
                            ref={createInputRef || inputRef}
                            onChange={inputChangeHandler}
                            onClick={stopEventHandler}
                            placeholder={placeholder}
                            className="input"
                            value={inputValue}
                        />
                        <span>{inputValue.replaceAll(' ', '-')}</span>
                    </>
                ) : (
                    <div ref={isActive ? activeRowRef : null}>
                        <Tooltip position="auto" title={hasTooltip ? label : ''}>
                            <Tag
                                {...(hasIcon
                                    ? {
                                          icons: (
                                              <Icon type="bc-icon-clear-small" onClick={() => onDeleteHandler(index)} />
                                          )
                                      }
                                    : {})}
                                appearance={isActive ? 'colored' : 'light'}
                                {...(!isValid && { color: 'red' })}
                                cornerRadius="smooth-radius"
                                onClick={stopEventHandler}
                                name={label}
                            />
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    );
});

TagWrapper.propTypes = {
    isValid: PropTypes.bool,
    label: PropTypes.string,
    editMode: PropTypes.bool,
    index: PropTypes.number,
    onChangeHandler: PropTypes.func,
    onDeleteHandler: PropTypes.func,
    placeholder: PropTypes.string,
    hasTags: PropTypes.bool,
    hasIcon: PropTypes.bool,
    onKeyPress: PropTypes.func,
    activeTagIndex: PropTypes.number,
    setEditModeIndex: PropTypes.func,
    setActiveTagIndex: PropTypes.func,
    withEdit: PropTypes.bool
};

TagWrapper.defaultProps = {
    isValid: false,
    isActive: false
};

export default TagWrapper;
