import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { noop } from 'utils';
import { useKeyDown } from 'hooks';
import { checkboxRadioSwitcherConfig, noDataConfig } from 'configs';

// Components
import CustomScrollbar from '../../atoms/Scrollbar';
import Button from '../../atoms/Button';
import Empty from '../../atoms/Empty';
import ExtendedInput from '../../molecules/ExtendedInput';
import CheckboxGroup from '../CheckboxGroup';

// Styles
import '../Dropdown/index.scss';
import './index.scss';

function CheckboxGroupWithSearch({
    className,
    onSave,
    onCancel,
    saveText,
    cancelText,
    onSearch,
    value,
    defaultSelected,
    onChange,
    data: options,
    noDataText,
    noDataWithImage,
    noDataTypes,
    disableSave,
    autofocusSearchField,
    isSaveButtonLoading,
    ...rest
}) {
    const parentRef = useRef(null);
    const scrollbarRef = useRef(null);

    const [query, setQuery] = useState('');
    const [data, setData] = useState(options);
    const [values, setValues] = useState(defaultSelected);
    const [hoveredState, setHoveredState] = useState(-1);

    const handleSearchChange = useCallback(
        (e) => {
            const { value } = e.target;
            onSearch
                ? onSearch(e)
                : setData(() =>
                      options.filter((item) => !value || item.label.toLowerCase().includes(value.toLowerCase()))
                  );

            setQuery(value);
        },
        [onSearch, options]
    );

    const handleChange = useCallback(
        (e) => {
            setValues(e);
            onChange(e);
        },
        [onChange]
    );

    function scroll(type, index) {
        let newIndex = index;

        if (type === 'prev' && data.length - 1 > index) {
            newIndex++;
        } else if (type === 'next' && index !== 0) {
            newIndex--;
        }

        scrollbarRef.current.scrollTop(newIndex * Math.round(scrollbarRef.current.getScrollHeight() / data.length));

        return newIndex;
    }

    useKeyDown(
        (e) => {
            if (e.key === 'ArrowDown') {
                setHoveredState((index) => scroll('prev', index));
            }
            if (e.key === 'ArrowUp') {
                setHoveredState((index) => scroll('next', index));
            }
            if (e.key === 'Enter') {
                onChange(e, hoveredState);

                if (!value && data.length && hoveredState >= 0) {
                    setValues((v) => {
                        const index = v.indexOf(data[hoveredState].value);
                        const newValues = [...v];

                        index > -1 ? newValues.splice(index, 1) : newValues.push(data[hoveredState].value);

                        return newValues;
                    });
                }
            }
        },
        [data, hoveredState, onChange],
        parentRef,
        ['ArrowUp', 'ArrowDown', 'Enter']
    );

    useEffect(() => {
        setData(options);
    }, [options]);

    useEffect(() => {
        value && setValues(value);
    }, [value]);

    return (
        <div ref={parentRef} className={classnames('checkbox-group-with-search-holder', className)}>
            <ul className="c-g-w-s-content">
                <li className="c-g-w-s-head">
                    <ExtendedInput
                        autoFocus={autofocusSearchField}
                        value={query}
                        type="search"
                        onChange={handleSearchChange}
                        icon="bc-icon-search"
                    />
                </li>
                <li>
                    <CustomScrollbar ref={scrollbarRef} autoHeight>
                        {data.length ? (
                            <div className="c-g-w-s-body-content">
                                <CheckboxGroup
                                    hoveredState={hoveredState}
                                    className="grouped-checkbox-with-search"
                                    data={data}
                                    value={values}
                                    onChange={handleChange}
                                    {...rest}
                                />
                            </div>
                        ) : (
                            <div className="empty-data-holder">
                                <Empty
                                    title={noDataText}
                                    appearance="greyscale"
                                    withImage={noDataWithImage}
                                    className="absolute"
                                    type={noDataTypes}
                                    size="small"
                                />
                            </div>
                        )}
                    </CustomScrollbar>
                </li>
                <li className="c-g-w-s-footer">
                    {onCancel && (
                        <Button appearance="minimal" color="default" onClick={onCancel}>
                            {cancelText}
                        </Button>
                    )}
                    {onSave && (
                        <Button
                            disabled={disableSave || isSaveButtonLoading}
                            onClick={onSave}
                            loading={isSaveButtonLoading}
                        >
                            {saveText}
                        </Button>
                    )}
                </li>
            </ul>
        </div>
    );
}

CheckboxGroupWithSearch.propTypes = {
    /** Text for save button * */
    saveText: PropTypes.string,
    /** Text for cancel button * */
    cancelText: PropTypes.string,
    /** Save button click callback * */
    onSave: PropTypes.func,
    /** Cancel button click callback * */
    onCancel: PropTypes.func,
    /** Search input on change callback * */
    onSearch: PropTypes.func,
    /** Initially selected value */
    defaultSelected: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number])),
    /**
     * Disables events
     */
    disabled: PropTypes.bool,
    /**
     * Disables save button
     */
    disableSave: PropTypes.bool,
    /**
     * If data item is typeof string than value will apply both as checkbox label and value,
     * Label: The text of the associated element.
     * Value: The input value
     * Disabled: A checkbox can appear disabled and be unable to change states
     * readOnly: A checkbox can be read-only and unable to change states.
     * required: If true, the input element will be required.
     * isValid: Check validity of input value
     * errorText: Displays custom error text when input value is not valid
     */
    data: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                label: PropTypes.node,
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
                disabled: PropTypes.bool,
                description: PropTypes.string,
                readOnly: PropTypes.bool,
                required: PropTypes.bool,
                isValid: PropTypes.bool,
                errorText: PropTypes.string
            })
        ])
    ),
    /**
     * Custom text for checkAll checkbox
     */
    checkAllText: PropTypes.string,
    /**
     * Displays select all checkbox
     */
    showSelectAll: PropTypes.bool,
    /**
     * Array of values of the input elements
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    /**
     * Fires an event when Checkbox is clicked or "enter" key is pressed
     * (event: SyntheticEvent) => void
     */
    onChange: PropTypes.func,
    /**
     * Additional className which applies to group holder div element
     */
    className: PropTypes.string,
    /**
     * Accepts same values as Checkbox component(check in Checkbox component(molecules) propTable)
     */
    size: PropTypes.oneOf(checkboxRadioSwitcherConfig.size),
    /**
     * Specify "label" position
     */
    labelPosition: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelPosition),
    /**
     * Specify "label" alignment
     */
    labelAlignment: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelAlignment),
    /**
     * Description for checkboxes
     */
    description: PropTypes.string,
    /**
     * Define is field read only or no.
     */
    readOnly: PropTypes.bool,
    /**
     * Define is field required or no.
     */
    required: PropTypes.bool,
    /**
     * Additional state for field validation
     */
    isValid: PropTypes.bool,
    /**
     * Text that will be shown id field is invalid
     */
    errorText: PropTypes.string,
    /**
     * Different types/views for no data view
     */
    noDataTypes: PropTypes.oneOf(noDataConfig),
    /**
     * Showing no data with image
     */
    noDataWithImage: PropTypes.bool,
    /**
     * Custom No data text
     */
    noDataText: PropTypes.string,
    /*
     * When rendering a component, the search field will automatically focused
     */
    autofocusSearchField: PropTypes.bool,
    /*
     * Loader for save button
     */
    isSaveButtonLoading: PropTypes.bool
};

CheckboxGroupWithSearch.defaultProps = {
    onSave: noop,
    onCancel: noop,
    saveText: 'Save',
    cancelText: 'Cancel',
    noDataText: 'No data found',
    noDataWithImage: true,
    noDataTypes: 'image',
    autofocusSearchField: false
};

export default CheckboxGroupWithSearch;
