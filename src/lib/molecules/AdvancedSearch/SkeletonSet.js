import React from 'react';
import SkeletonLoader from '../../atoms/SkeletonLoader';

function SkeletonSet({ count, searchResult }) {
    return searchResult ? (
        <ul className="skeleton">
            {Array(count || 1)
                .fill('')
                .map((_, i) => (
                    <li className="skeleton__searchElement" key={i}>
                        <SkeletonLoader
                            duration={+`${2}.0${i}`}
                            data={[{ col: 12, style: { width: '100%', height: '100%' } }]}
                            isBusy
                        />
                    </li>
                ))}
        </ul>
    ) : (
        <ul>
            {Array(count || 1)
                .fill('')
                .map((_, i) => (
                    <li className="skeleton__filter" key={i}>
                        <SkeletonLoader duration={2} data={[{ col: 1, style: { height: 23, width: 23 } }]} isBusy />
                        <span style={{ width: '10px' }} />
                        <SkeletonLoader duration={+`${2}.0${i}`} data={[{ col: 10, style: { height: 23 } }]} isBusy />
                    </li>
                ))}
        </ul>
    );
}

SkeletonSet.defaultProps = {};

SkeletonSet.propTypes = {};

export default SkeletonSet;
