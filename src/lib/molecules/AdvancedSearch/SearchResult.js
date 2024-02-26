import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import classnames from 'classnames';

// Components
import Badge from '../../atoms/Badge';
import Scrollbar from '../../atoms/Scrollbar';
import LinkButton from '../../atoms/LinkButton/index';
import Empty from '../../atoms/Empty';

// Local components
import SearchResultRow from './SearchResultRow';
import SkeletonSet from './SkeletonSet';

function SearchResult({
    data,
    totalCount,
    noDataText,
    initialData,
    showMoreText,
    totalCountMax,
    totalCountText,
    onShowMoreClick,
    isSearchLoading,
    showMoreIsLoading,
    hasActiveShowMore,
    initialDataDescription
}) {
    const listRef = useRef(null);
    const scrollbarRef = useRef(null);
    const [ableToScroll, setAbleToScroll] = useState(false);
    const [dataLengthSnapshots, setDataLengthSnapshots] = useState([]);
    const [elementTopToScroll, setElementTopToScroll] = useState(0);

    const onShowMoreHandler = useCallback((e) => {
        onShowMoreClick(e);
        setAbleToScroll(true);
    }, []);

    useEffect(() => {
        setDataLengthSnapshots((prev) => [...prev, data.length]);
    }, [data.length]);

    useEffect(() => {
        // Formula for getting the top of the element and adding 29px for showing showMore link and half of the last visible row.
        const scrollToElementTop =
            +listRef?.current?.children[dataLengthSnapshots[dataLengthSnapshots.length - 2] - 1]?.offsetTop + 29;

        if (!isSearchLoading && ableToScroll) {
            setElementTopToScroll(scrollToElementTop);
            setAbleToScroll(false);
        }
    }, [isSearchLoading]);

    return (
        <div className="searchResult">
            {isSearchLoading && <SkeletonSet searchResult count={8} />}
            <Scrollbar
                autoHeightMax={500}
                className={classnames('searchResult__scrollbar', {
                    'searchResult__scrollbar-loading': isSearchLoading
                })}
                ref={scrollbarRef}
                scrollTop={elementTopToScroll}
                withSmoothScroll
            >
                <div className="searchResult__header">
                    <span className="searchResult__text">
                        {(totalCount > 0 && totalCountText) || (initialData.length > 0 && initialDataDescription)}
                    </span>
                    {totalCount > 0 && (
                        <Badge
                            className="searchResult__badge"
                            count={totalCount}
                            maxCount={totalCountMax}
                            size="default"
                            color="primary"
                        />
                    )}
                </div>
                {data?.length > 0 || initialData.length > 0 ? (
                    <ul className="searchResult__list" role="navigation" ref={listRef}>
                        {initialData.length > 0
                            ? initialData.map((elem, index) => <SearchResultRow key={index} element={elem} />)
                            : data?.map((elem, index) => <SearchResultRow key={index} element={elem} />)}
                        {hasActiveShowMore && (
                            <li className="searchResult__showMoreLi">
                                <LinkButton
                                    tabIndex={0}
                                    ariaLabel={showMoreText}
                                    onClick={onShowMoreHandler}
                                    className="searchResult__showMoreLink"
                                >
                                    {showMoreText}
                                </LinkButton>
                            </li>
                        )}
                    </ul>
                ) : (
                    <Empty
                        appearance="without-circles"
                        title={noDataText}
                        type="search"
                        className="searchResult__empty"
                    />
                )}
            </Scrollbar>
        </div>
    );
}

SearchResult.defaultProps = {
    initialDataDescription: 'initial data description',
    isSearchLoading: false,
    showMoreIsLoading: false
};

SearchResult.propTypes = {
    /**
     * total count of data to show in badge
     */
    totalCount: PropTypes.number,
    /**
     * text for no data to display
     */
    noDataText: PropTypes.string,
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
     * text for link under search result
     */
    showMoreText: PropTypes.string,
    /**
     * total max count of data to show totalCountMax+ in badge
     */
    totalCountMax: PropTypes.number,
    /**
     * label text for badge component
     */
    totalCountText: PropTypes.string,
    /**
     * Fires an event when clicked on link under search result
     */
    onShowMoreClick: PropTypes.func,
    /**
     * To control showMore loading state
     */
    showMoreIsLoading: PropTypes.bool,
    /**
     * search loading state
     */
    isSearchLoading: PropTypes.bool,
    /**
     * if hasActive hasActiveShowMore is true you will see show more link under search result
     */
    hasActiveShowMore: PropTypes.bool,
    /**
     * If search field is empty, initialDataDescription is describing witch data is showing by default for example (Recently modified data).
     */
    initialDataDescription: PropTypes.string,
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
    )
};

export default SearchResult;
