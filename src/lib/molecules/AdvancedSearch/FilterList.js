import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { noop } from 'utils';

// Components
import Scrollbar from '../../atoms/Scrollbar';
import LinkButton from '../../atoms/LinkButton';

// Local components
import ListElementWithCheckbox from './ListElementWithCheckbox';
import SkeletonSet from './SkeletonSet';

function FilterList({ data, skeletonCount, onSelect }) {
    const {
        data: filterData,
        isLoading,
        onShowMoreClick,
        showMoreIsLoading,
        sectionNameText,
        hasActiveShowMore,
        showMoreText
    } = data;

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
        setDataLengthSnapshots((prev) => [...prev, filterData?.length]);
    }, [filterData?.length]);

    useEffect(() => {
        const scrollToElementTop =
            +listRef?.current?.children[dataLengthSnapshots[dataLengthSnapshots?.length - 1] - 1]?.offsetTop;

        if (!isLoading && ableToScroll) {
            setElementTopToScroll(scrollToElementTop);
            setAbleToScroll(false);
        }
    }, [isLoading]);

    return (
        <div className="filterList__filter">
            <Scrollbar
                autoHeightMax={500}
                className="filterList__scrollbar"
                style={{
                    height: '100%'
                }}
                ref={scrollbarRef}
                scrollTop={elementTopToScroll}
                withSmoothScroll
            >
                <h6 className="filterList__filterHeader">{sectionNameText}</h6>
                <ul className="filterList__filterList" ref={listRef}>
                    {isLoading ? (
                        <SkeletonSet count={skeletonCount} />
                    ) : (
                        filterData?.map((item, index) => (
                            <ListElementWithCheckbox key={index} onSelect={onSelect} item={item} />
                        ))
                    )}
                    {hasActiveShowMore && (
                        <li className="filterList__showMoreLi">
                            <LinkButton
                                tabIndex={0}
                                ariaLabel={showMoreText}
                                onClick={onShowMoreHandler}
                                className="filterList__showMoreLink"
                            >
                                {showMoreText}
                            </LinkButton>
                        </li>
                    )}
                </ul>
            </Scrollbar>
        </div>
    );
}

FilterList.defaultProps = {
    data: { data: [] },
    onSelect: noop,
    skeletonCount: 5,
    showMoreIsLoading: false
};

FilterList.propTypes = {
    /**
     * data structure for secondary filter
     */
    data: PropTypes.shape({
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
    skeleton: PropTypes.element,
    onSelect: PropTypes.func,
    skeletonCount: PropTypes.number
};

export default FilterList;
