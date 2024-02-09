import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dayjs from 'dayjs';

// Helpers
import { advancedSearchConfig } from 'configs';
import { useDebounce, useKeyDown, useClickOutside } from 'hooks';
import { noop } from 'utils';

// Components
import PopoverV2 from '../../atoms/PopoverV2';
import ExtendedInput from '../ExtendedInput';

// Local components
import Content from './Content';

// Styles
import './index.scss';

function AdvancedSearch({
    data,
    isOpen,
    position,
    onSearch,
    totalCount,
    noDataText,
    initialData,
    showMoreText,
    totalCountMax,
    totalCountText,
    onOutsideClick,
    onShowMoreClick,
    isSearchLoading,
    openedInputWidth,
    closedInputWidth,
    hasActiveShowMore,
    primaryFilterData,
    secondaryFilterData,
    extendedInputConfigs,
    initialDataDescription
}) {
    const parentRef = useRef(null);
    const searchRef = useRef(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [initialDataState, setInitialDataState] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [isOpenControlled, setIsOpenControlled] = useState(false);
    const debouncedSearchValue = useDebounce(searchValue, 300);

    useEffect(() => {
        setIsOpenControlled(isOpen !== undefined);
    }, [isOpen]);

    useEffect(() => {
        if (debouncedSearchValue === null) return;
        onSearch(debouncedSearchValue);
    }, [debouncedSearchValue]);

    const openPopoverHandler = (e) => {
        e && (e.currentTarget.onFocus = true);
        if (!popoverOpen) setPopoverOpen(true);
    };

    const closePopoverHandler = useCallback(() => setPopoverOpen(false), []);

    useKeyDown(
        (e) => {
            switch (e.key) {
                case 'Escape':
                    searchRef?.current && searchRef?.current?.blur();
                    closePopoverHandler();
                    break;
                default:
                    break;
            }
        },
        [close, focus, blur, popoverOpen],
        parentRef,
        ['Escape']
    );

    // initial data setter
    useEffect(() => {
        setInitialDataState(debouncedSearchValue?.length > 0 ? [] : initialData);
    }, [debouncedSearchValue]);

    const inputAndPopoverWidthVariable = useMemo(
        () => ({
            '--advanced-search-width': (isOpenControlled ? isOpen : popoverOpen)
                ? `${openedInputWidth}vw`
                : closedInputWidth
        }),
        [popoverOpen, isOpenControlled, isOpen]
    );

    const handleOutsideClick = useClickOutside(() => onOutsideClick());

    return (
        <div
            className={classnames('advancedSearch', {
                'advancedSearch-left': position === advancedSearchConfig.positions.left
            })}
            ref={handleOutsideClick}
        >
            <div
                className={classnames('advancedSearch__wrapper', {
                    'advancedSearch__wrapper-left': position === advancedSearchConfig.positions.left
                })}
                style={inputAndPopoverWidthVariable}
                ref={parentRef}
            >
                <PopoverV2
                    position="bottom"
                    screenType="desktop"
                    isOpen={isOpenControlled ? isOpen : popoverOpen}
                    scrollbarNeeded={false}
                    extendTargetWidth={false}
                    className="advancedSearch__popover"
                    onClickOutside={closePopoverHandler}
                    containerParent={parentRef?.current}
                    Content={
                        <Content
                            data={data}
                            noDataText={noDataText}
                            totalCount={totalCount}
                            showMoreText={showMoreText}
                            totalCountMax={totalCountMax}
                            initialData={initialDataState}
                            totalCountText={totalCountText}
                            onShowMoreClick={onShowMoreClick}
                            isSearchLoading={isSearchLoading}
                            primaryFilterData={primaryFilterData}
                            hasActiveShowMore={hasActiveShowMore}
                            secondaryFilterData={secondaryFilterData}
                            initialDataDescription={initialDataDescription}
                        />
                    }
                >
                    <ExtendedInput
                        canClear
                        clickableIcon
                        ref={searchRef}
                        value={searchValue}
                        description={false}
                        icon="bc-icon-search"
                        flexibility="content-size"
                        onChange={({ target }) => setSearchValue(target.value)}
                        onClick={openPopoverHandler}
                        onFocus={openPopoverHandler}
                        placeholder="Advanced Search"
                        className="advancedSearch__extendedInput"
                        {...extendedInputConfigs}
                    />
                </PopoverV2>
            </div>
            <div
                data-comment="for-popover-accessibility-to-close"
                tabIndex="0"
                style={{ height: 0, width: 0, opacity: 0 }}
                onFocus={closePopoverHandler}
            />
        </div>
    );
}

AdvancedSearch.propTypes = {
    /**
     * Position of the AdvancedSearch component.
     * If set to 'right', it will stretch from right to left, and if set to 'left', it will stretch from left to right.
     * By default, the component stretches from right to left.
     */
    position: PropTypes.oneOf(Object.values(advancedSearchConfig.positions)),
    /**
     * Width of closed AdvancedSearch input.
     * if you set number it will be px, or you can set string for Example 20vw
     */
    closedInputWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Width of opened AdvancedSearch input.
     * It can be only with a number and it will be converted to vw(viewport's width), which is equal to viewport %
     */
    openedInputWidth: PropTypes.number,
    /**
     * See ExtendedInput components docs
     */
    extendedInputConfigs: PropTypes.shape({
        ...ExtendedInput.propTypes
    }),
    /**
     * data structure for primary filter
     */
    primaryFilterData: PropTypes.shape({
        sectionNameText: PropTypes.string,
        onChange: PropTypes.func,
        hasActiveShowMore: PropTypes.bool,
        showMoreText: PropTypes.string,
        showMoreIsLoading: PropTypes.bool,
        onShowMoreClick: PropTypes.func,
        isLoading: PropTypes.bool,
        data: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.string,
                checked: PropTypes.bool,
                icon: PropTypes.string
            })
        )
    }),
    /**
     * data structure for secondary filter
     */
    secondaryFilterData: PropTypes.shape({
        sectionNameText: PropTypes.string,
        onChange: PropTypes.func,
        hasActiveShowMore: PropTypes.bool,
        showMoreText: PropTypes.string,
        showMoreIsLoading: PropTypes.bool,
        onShowMoreClick: PropTypes.func,
        isLoading: PropTypes.bool,
        data: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.string,
                checked: PropTypes.bool,
                icon: PropTypes.string
            })
        )
    }),
    /**
     * Fires an event when input changes and returns value of input (used 300ms debounce)
     */
    onSearch: PropTypes.func, // Pass typed value using some debounce
    /**
     * Fires event when user clicks on outside of component.
     */
    onOutsideClick: PropTypes.func,
    /**
     * If search field is empty, initialDataDescription is describing witch data is showing by default for example (Recently modified data).
     */
    initialDataDescription: PropTypes.string,
    /**
     * If search field is empty, will show initialData for example (Recently modified data).
     */
    initialData: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string,
            id: PropTypes.string,
            title: PropTypes.string,
            type: PropTypes.string,
            name: PropTypes.string,
            date: PropTypes.shape({
                labelText: PropTypes.string,
                date: PropTypes.oneOfType([
                    PropTypes.instanceOf(dayjs),
                    PropTypes.instanceOf(Date),
                    PropTypes.string,
                    PropTypes.number
                ])
            }),
            actions: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    icon: PropTypes.string.isRequired,
                    onClick: PropTypes.func,
                    description: PropTypes.string
                })
            )
        })
    ),
    /**
     * if hasActive hasActiveShowMore is true you will see show more link under search result
     */
    hasActiveShowMore: PropTypes.bool,
    /**
     * text for link under search result
     */
    showMoreText: PropTypes.string,
    /**
     * To control showMore loading state
     */
    showMoreIsLoading: PropTypes.bool,
    /**
     * Fires an event when clicked on link under search result
     */
    onShowMoreClick: PropTypes.func,
    /**
     * search loading state
     */
    isSearchLoading: PropTypes.bool,
    /**
     * total count of data to show in badge
     */
    totalCount: PropTypes.number,
    /**
     * total max count of data to show totalCountMax+ in badge
     */
    totalCountMax: PropTypes.number,
    /**
     * label text for badge component
     */
    totalCountText: PropTypes.string,
    /**
     * data structure
     * */
    data: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string,
            id: PropTypes.string,
            title: PropTypes.string,
            type: PropTypes.string,
            name: PropTypes.string,
            date: PropTypes.shape({
                labelText: PropTypes.string,
                date: PropTypes.oneOfType([
                    PropTypes.instanceOf(dayjs),
                    PropTypes.instanceOf(Date),
                    PropTypes.string,
                    PropTypes.number
                ])
            }),
            actions: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    icon: PropTypes.string.isRequired,
                    onClick: PropTypes.func,
                    description: PropTypes.string
                })
            )
        })
    ),
    /**
     * text for no data to display
     */
    noDataText: PropTypes.string,
    /**
     * A boolean prop to control the popover's open and close states from outside the component.
     */
    isOpen: PropTypes.bool
};

AdvancedSearch.defaultProps = {
    onSearch: noop,
    openedInputWidth: 65,
    onShowMoreClick: noop,
    onOutsideClick: noop,
    closedInputWidth: '200px',
    hasActiveShowMore: false,
    showMoreIsLoading: false,
    showMoreText: 'Show more',
    noDataText: 'No Data to Display',
    position: advancedSearchConfig.positions.right,
    initialDataDescription: 'initial data description'
};
export default AdvancedSearch;
