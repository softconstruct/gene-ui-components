import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';

// Local Components
import FilterList from './FilterList';
import SearchResult from './SearchResult';

function Content({
    data,
    totalCount,
    noDataText,
    initialData,
    showMoreText,
    totalCountMax,
    totalCountText,
    isSearchLoading,
    onShowMoreClick,
    hasActiveShowMore,
    primaryFilterData,
    secondaryFilterData,
    initialDataDescription
}) {
    const [clonedPrimaryFilterData, setClonedPrimaryFilterData] = useState({ ...primaryFilterData });
    const [clonedSecondaryFilterData, setClonedSecondaryFilterData] = useState({ ...secondaryFilterData });

    useEffect(() => setClonedPrimaryFilterData({ ...primaryFilterData }), [primaryFilterData]);
    useEffect(() => setClonedSecondaryFilterData({ ...secondaryFilterData }), [secondaryFilterData]);

    const newFilterData = useCallback(
        (clonedData, selectedElement) => ({
            ...clonedData,
            data: clonedData?.data.map((elem) => {
                if (elem.id === selectedElement.id) {
                    elem.checked = !elem.checked;
                }
                return elem;
            })
        }),
        []
    );

    const handleSelectPrimary = useCallback(
        (selectedElement) => {
            const newPrimaryFilterData = newFilterData(clonedPrimaryFilterData, selectedElement);
            setClonedPrimaryFilterData(newPrimaryFilterData);
            primaryFilterData.onChange(newPrimaryFilterData.data);
        },
        [clonedPrimaryFilterData]
    );

    const handleSelectSecondary = useCallback(
        (selectedElement) => {
            const newSecondaryFilterData = newFilterData(clonedSecondaryFilterData, selectedElement);
            setClonedSecondaryFilterData(newSecondaryFilterData);
            secondaryFilterData.onChange(newSecondaryFilterData.data);
        },
        [clonedSecondaryFilterData.data]
    );

    const skeletonCount = useMemo(
        () => (primaryFilterData && secondaryFilterData ? 5 : 11),
        [primaryFilterData, secondaryFilterData]
    );

    return (
        <div className="advancedSearch__content">
            <div
                className={classnames('advancedSearch__searchResult', {
                    'advancedSearch__searchResult-border': primaryFilterData || secondaryFilterData
                })}
            >
                <SearchResult
                    data={data}
                    noDataText={noDataText}
                    totalCount={totalCount}
                    initialData={initialData}
                    showMoreText={showMoreText}
                    totalCountMax={totalCountMax}
                    totalCountText={totalCountText}
                    onShowMoreClick={onShowMoreClick}
                    isSearchLoading={isSearchLoading}
                    hasActiveShowMore={hasActiveShowMore}
                    initialDataDescription={initialDataDescription}
                />
            </div>
            {(primaryFilterData || secondaryFilterData) && (
                <div className="advancedSearch__filters">
                    {primaryFilterData && (
                        <FilterList
                            data={primaryFilterData}
                            skeletonCount={skeletonCount}
                            onSelect={handleSelectPrimary}
                        />
                    )}
                    {secondaryFilterData && primaryFilterData && <div className="advancedSearch__divider" />}
                    {secondaryFilterData && (
                        <FilterList
                            data={secondaryFilterData}
                            skeletonCount={skeletonCount}
                            onSelect={handleSelectSecondary}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

Content.defaultProps = {};
Content.propTypes = {};

export default Content;
