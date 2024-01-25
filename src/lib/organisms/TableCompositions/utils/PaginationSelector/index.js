import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { Logger, noop } from 'utils';

// Components
import Pagination from '../../../../molecules/Pagination';
import Dropdown from '../../../Dropdown';

// Styles
import './index.scss';

function PaginationSelector({
    maxPage,
    totalCount,
    startNumber,
    currentPage,
    selectorData,
    selectorProps,
    noItemsText,
    selectedPage,
    showSelector,
    onPageChange,
    selectorValue,
    showPagination,
    onSelectorChange,
    defaultOpenedPage,
    fabricateSelectorLabel,
    ...paginationProps
}) {
    'value' in paginationProps && Logger.warn(`'value' prop will not be applied to DropDown`);

    const controlledProps = useMemo(
        () =>
            currentPage || selectedPage
                ? { selected: currentPage || selectedPage }
                : { defaultSelected: defaultOpenedPage },
        [currentPage, selectedPage, defaultOpenedPage]
    );

    const representingNums = useMemo(() => {
        if (totalCount) {
            const endNumber = startNumber + selectorValue;
            const showCount = `${startNumber + 1}-${endNumber >= totalCount ? totalCount : endNumber}`;
            const result = fabricateSelectorLabel(showCount, totalCount) || `${showCount} of ${totalCount}`;

            return result;
        }

        return noItemsText;
    }, [totalCount, startNumber, fabricateSelectorLabel, noItemsText, selectorValue]);

    const dropdownValue = useMemo(
        () =>
            selectorValue === totalCount && selectorData.find((item) => item.value === 'all') ? 'all' : selectorValue,
        [selectorValue, totalCount, selectorData]
    );

    return (
        <ul className="ta-pagination-holder">
            <li>
                <div className="pagination-drop">
                    {showSelector && (
                        <>
                            <Dropdown
                                flexibility="content-size"
                                {...selectorProps}
                                hasSearch={false}
                                onChange={onSelectorChange}
                                data={selectorData}
                                value={dropdownValue}
                                position="top"
                            />
                            <p>{representingNums}</p>
                        </>
                    )}
                </div>
            </li>
            <li>
                {showPagination && (
                    <Pagination count={maxPage} onChange={onPageChange} {...controlledProps} {...paginationProps} />
                )}
            </li>
        </ul>
    );
}

PaginationSelector.propTypes = {
    showSelector: PropTypes.bool,
    defaultOpenedPage: PropTypes.number,
    showPagination: PropTypes.bool,
    noItemsText: PropTypes.string,
    totalCount: PropTypes.number.isRequired,
    fabricateSelectorLabel: PropTypes.func
};

PaginationSelector.defaultProps = {
    defaultOpenedPage: 1,
    selectorData: [],
    noItemsText: '0 items',
    showSelector: true,
    showPagination: true,
    fabricateSelectorLabel: noop
};

export default PaginationSelector;
