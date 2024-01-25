import React, { useState, useCallback, forwardRef } from 'react';
import PropTypes from 'prop-types';

// Components
import ExtendedInput from '../ExtendedInput';

const Search = forwardRef(({ onChange, placeholder, defaultValue, className, ...restProps }, ref) => {
    const [value, setValue] = useState(defaultValue);

    const handleChange = useCallback(
        (e) => {
            setValue(e.target.value);
            onChange && onChange(e, e.target.value);
        },
        [onChange]
    );

    return (
        <ExtendedInput
            ref={ref}
            placeholder={placeholder}
            onChange={handleChange}
            {...restProps}
            value={value}
            type="text"
            icon="bc-icon-search"
            className={`search-holder ${className}`}
        />
    );
});

Search.propTypes = {
    /**
     * Fires an event when the value of the 'Search' input changes.
     * Expected function signature: (event: Event, value: string) => void.
     */
    onChange: PropTypes.func,
    /**
     * Placeholder for search input
     */
    placeholder: PropTypes.string,
    /**
     * Initial value of 'Search'.
     */
    defaultValue: PropTypes.string,
    /**
     * External/additional className for component
     */
    className: PropTypes.string
};

Search.defaultProps = {
    placeholder: 'Search',
    className: ''
};

export default Search;
