import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { noop } from 'utils';

// Components
import Search from '../../molecules/Search';
import Dropdown from '../Dropdown';

// Styles
import './index.scss';

const SearchWithDropdownConfig = {
    flexibility: ['default-width', 'full-width']
};

function SearchWithDropdown({ onChange, searchProps, dropdownProps, flexibility, hideDropdown, dataKey }) {
    const { defaultValue } = searchProps;

    const [query, setQuery] = useState(defaultValue);
    const [dataKeys, setDataKeys] = useState(() => dropdownProps.defaultValue || []);

    const handleSearch = useCallback(
        (e) => {
            const query = e.target.value;
            setQuery(query);
            onChange({ query, dataKeys });
        },
        [onChange, dataKeys]
    );

    const handleDropdown = useCallback(
        (items) => {
            const dataKeys = Array.isArray(items) ? items.map((item) => item[dataKey]) : items[dataKey];

            setDataKeys(dataKeys);
            onChange({ query, dataKeys });
        },
        [query, onChange, dataKey]
    );

    return hideDropdown ? (
        <Search {...searchProps} inputSize="big" appearance="minimal" onChange={handleSearch} />
    ) : (
        <div className={classnames('search-dropdown-mix', `f-${flexibility}`)}>
            <Search {...searchProps} inputSize="big" appearance="minimal" onChange={handleSearch} />
            {!hideDropdown && (
                <div className="dropDown">
                    <Dropdown
                        {...dropdownProps}
                        inputSize="big"
                        appearance="minimal"
                        flexibility="content-size"
                        onChange={handleDropdown}
                    />
                </div>
            )}
        </div>
    );
}

SearchWithDropdown.propTypes = {
    /**
     * Called when the user attempts to change the value,
     * OnChange({ query: string, dataKey: array })
     */
    onChange: PropTypes.func,
    /**
     * Accepts same props as search component(molecules)
     */
    searchProps: PropTypes.shape({ ...Search.propTypes }),
    /**
     * Accpets same props as dropdown component(organisms)
     */
    dropdownProps: PropTypes.shape({ ...Dropdown.propTypes }),
    /**
     * Control component passing `default-width` or `full-width`,
     */
    flexibility: PropTypes.oneOf(SearchWithDropdownConfig.flexibility),
    /**
     * Hides dropdown
     */
    hideDropdown: PropTypes.bool,
    /**
     * unique value in dropdown items
     */
    dataKey: PropTypes.string
};

SearchWithDropdown.defaultProps = {
    searchProps: {},
    flexibility: SearchWithDropdownConfig.flexibility[0],
    onChange: noop,
    hideDropdown: false,
    dataKey: 'dataKey'
};

export default SearchWithDropdown;
