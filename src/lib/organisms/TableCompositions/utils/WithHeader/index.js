import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// Components
import SearchWithDropdown from '../../../SearchWithDropdown';

// Styles
import './index.scss';

function WithHeader({
    actions,
    children,
    withSearch,
    handleSearch,
    dropDownData,
    checkAllText,
    leftHeaderActions,
    hideSearchDropdown,
    ...restProps
}) {
    const [data, defaultSelected] = useMemo(() => {
        if (withSearch) {
            const data = dropDownData.filter(({ text }) => !!text);
            const selected = data.map(({ dataKey }) => dataKey);
            return [data, selected];
        }
        const data = dropDownData.map((data) => data.dataKey);
        return [data, data];
    }, [withSearch, dropDownData]);

    return (
        <>
            {(actions || withSearch || leftHeaderActions) && (
                <ul className="paper-actions" {...restProps}>
                    <li className="paper-left-actions">
                        {withSearch ? (
                            <SearchWithDropdown
                                onChange={handleSearch}
                                hideDropdown={hideSearchDropdown}
                                dropdownProps={{
                                    checkAllText,
                                    isMultiSelect: true,
                                    labelKey: 'text',
                                    valueKey: 'dataKey',
                                    data,
                                    defaultValue: defaultSelected
                                }}
                            />
                        ) : null}
                        {leftHeaderActions}
                    </li>
                    <li className="paper-right-actions">{actions}</li>
                </ul>
            )}
            {children}
        </>
    );
}

WithHeader.propTypes = {
    withSearch: PropTypes.bool,
    actions: PropTypes.node,
    leftHeaderActions: PropTypes.node,
    handleSearch: PropTypes.func,
    dropDownData: PropTypes.arrayOf(PropTypes.object),
    checkAllText: PropTypes.string
};

WithHeader.defaultProps = {
    withSearch: false,
    checkAllText: 'All'
};

export default WithHeader;
