import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { conflictPropsLog, keyboardHandler } from 'utils';
import Button from '../../atoms/Button';
import Divider from '../../atoms/Divider';
import TextInput from '../ValidatableElements/Elements/ValidatableTextInput';
import Tooltip from '../Tooltip';

import './index.scss';

const drawCount = 5;
const offset = 2;
const enterCode = 13;
const diff = drawCount - offset;
const numberRegExp = /^[1-9][0-9]*$/;

function Pagination(props) {
    const {
        count: propCount,
        selected,
        onChange,
        errorText,
        defaultSelected,
        supportedKeyCodes,
        autoFocus,
        nextIconTooltipText,
        previousIconTooltipText
    } = props;

    selected && defaultSelected && conflictPropsLog('Pagination', ['selected', 'defaultSelected']);

    const [page, setPage] = useState(selected || defaultSelected || 1);
    const [isValid, setIsValid] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const current = selected || page;
    const count = propCount === 0 ? current : propCount;

    const isLeftIconDisabled = current === 1;
    const isRightIconDisabled = current === count;

    const canShowDots = count > drawCount;
    const areLeftDotsVisible = canShowDots && current > diff;
    const areRightDotsVisible = canShowDots && current + diff <= count;

    const setSelected = useCallback(
        (nextSelected) => {
            if (nextSelected) {
                !selected && setPage(nextSelected);
                onChange && onChange(nextSelected);
            }
        },
        [selected, onChange]
    );

    // button handlers
    const onClick = useCallback(
        (e) => {
            setSelected(Number(e.currentTarget.dataset.key));
            setInputValue('');
            setIsValid(true);
        },
        [setSelected]
    );

    const validate = useCallback(
        (value) => {
            const allowedDigitsCount = String(count).length;

            const checkingValue = value.length > allowedDigitsCount ? value.substring(0, allowedDigitsCount) : value;

            const number = Number(checkingValue);
            if (isNaN(number)) return true;

            return !number || (number <= count && number >= 1);
        },
        [count]
    );

    // input handlers
    const onInputChange = useCallback(
        (e) => {
            setIsValid(validate(e.target.value));
            const { value = '' } = e.target;

            if (!value || (numberRegExp.test(value) && value.length <= String(count).length)) {
                setInputValue(value);
            }
        },
        [count, validate]
    );

    const onBlur = useCallback(
        (e) => {
            if (isValid) {
                setSelected(Number(e.target.value));
                setInputValue('');
            }
        },
        [isValid, setSelected]
    );

    const onInputKeyPress = useCallback(
        (e) => {
            if (isValid && keyboardHandler(e, supportedKeyCodes)) {
                setSelected(Number(e.target.value));
                setInputValue('');
            }
        },
        [isValid, setSelected, supportedKeyCodes]
    );

    // icon handlers
    const onLeftClick = useCallback(
        (e) => {
            if (current > 1) {
                setSelected(current - 1);
                setInputValue('');
                setIsValid(true);
            }
        },
        [current, setSelected]
    );
    const onRightClick = useCallback(
        (e) => {
            if (current < count) {
                setSelected(current + 1);
                setInputValue('');
                setIsValid(true);
            }
        },
        [count, current, setSelected]
    );

    const leftButtons = [1];
    const rightButtons = count > 1 ? [count] : [];
    let centerButtons = [];

    if (count > offset) {
        if (count - offset > diff) {
            const customPage = current < diff ? diff : current + diff > count ? count - offset : current;
            centerButtons = [customPage - 1, customPage, customPage + 1];
        } else {
            for (let i = offset; i < count; i++) {
                centerButtons.push(i);
            }
        }
    }

    const dotedButton = () => (
        <Button flexibility="content-size" color="default" appearance="minimal" className="pointer-events-none">
            ...
        </Button>
    );

    const Input = (
        <Tooltip alwaysShow={!isValid} title={isValid ? '' : errorText} padding={25}>
            <TextInput
                min={1}
                forceAllowValidation
                autoFocus={autoFocus}
                max={count}
                type="text"
                onBlur={onBlur}
                value={inputValue}
                colorBorderOnError
                showErrorIcon={false}
                showNumberIcon={false}
                onChange={onInputChange}
                flexibility="content-size"
                placeholder={`1-${count}`}
                isValid={isValid}
                onKeyPress={onInputKeyPress}
                showClickableTooltipOnError={false}
                className={classnames('number-input')}
            />
        </Tooltip>
    );

    return (
        <div className="pagination-holder">
            <Tooltip title={previousIconTooltipText}>
                <Button
                    flexibility="content-size"
                    color="default"
                    appearance="minimal"
                    icon="bc-icon-arrow-left-nav"
                    onClick={onLeftClick}
                    disabled={isLeftIconDisabled}
                />
            </Tooltip>
            <Divider type="vertical" />
            {leftButtons.map((number) => (
                <Button
                    key={number}
                    flexibility="content-size"
                    color="default"
                    appearance="minimal"
                    onClick={number !== current ? onClick : undefined}
                    data-key={number}
                    className={classnames(number === current && 'defaultCursor')}
                    active={number === current}
                >
                    {number}
                </Button>
            ))}
            {areLeftDotsVisible ? (
                areRightDotsVisible ? (
                    dotedButton()
                ) : (
                    <>
                        {dotedButton()}
                        {Input}
                        {dotedButton()}
                    </>
                )
            ) : null}
            {centerButtons.map((number) => (
                <Button
                    key={number}
                    flexibility="content-size"
                    color="default"
                    appearance="minimal"
                    onClick={number !== current ? onClick : undefined}
                    data-key={number}
                    className={classnames(number === current && 'defaultCursor')}
                    active={number === current}
                >
                    {number}
                </Button>
            ))}
            {areRightDotsVisible && (
                <>
                    {dotedButton()}
                    {Input}
                    {dotedButton()}
                </>
            )}
            {rightButtons.map((number) => (
                <Button
                    key={number}
                    flexibility="content-size"
                    color="default"
                    appearance="minimal"
                    onClick={number !== current ? onClick : undefined}
                    data-key={number}
                    className={classnames(number === current && 'defaultCursor')}
                    active={number === current}
                >
                    {number}
                </Button>
            ))}
            <Divider type="vertical" />
            <Tooltip title={nextIconTooltipText}>
                <Button
                    flexibility="content-size"
                    color="default"
                    appearance="minimal"
                    icon="bc-icon-arrow-right-nav"
                    onClick={onRightClick}
                    disabled={isRightIconDisabled}
                />
            </Tooltip>
        </div>
    );
}

Pagination.propTypes = {
    /**
     * Fires event when user changes the page
     * (page: Number) => void
     */
    onChange: PropTypes.func,
    /**
     * Initially selected page
     */
    selected: PropTypes.number,
    /**
     * Custom text if element will indicate error
     */
    errorText: PropTypes.string,
    /**
     * Turn on/off pagination's autofocus
     */
    autoFocus: PropTypes.bool,
    /**
     * Initially selected page
     */
    defaultSelected: PropTypes.number,
    /**
     * Total pages count
     */
    count: PropTypes.number.isRequired,
    /**
     * Text for next icon tooltip.
     */
    nextIconTooltipText: PropTypes.string,
    /**
     * Text for previous icon tooltip.
     */
    previousIconTooltipText: PropTypes.string,
    // TODO: bad naming
    supportedKeyCodes: PropTypes.arrayOf(PropTypes.number)
};

Pagination.defaultProps = {
    count: 1,
    errorText: 'Page does not exist',
    supportedKeyCodes: [enterCode],
    nextIconTooltipText: 'Next page',
    previousIconTooltipText: 'Previous page'
};

export default Pagination;
