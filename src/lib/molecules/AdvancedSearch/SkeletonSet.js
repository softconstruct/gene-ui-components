import React from 'react';
import SkeletonLoader from '../../atoms/SkeletonLoader';

function SkeletonSet({ count, searchResult }) {
    return searchResult ? (
        <ul className="skeleton">
            {Array(count || 1)
                .fill('')
                .map((_, i) => (
                    <li className="skeleton__searchElement" key={i}>
                        <SkeletonLoader duration={+`${2}.0${i}`} width="100%" isBusy />
                    </li>
                ))}
        </ul>
    ) : (
        <ul>
            {Array(count || 1)
                .fill('')
                .map((_, i) => (
                    <li className="skeleton__filter" key={i}>
                        <SkeletonLoader duration={2} height="23px" width="23px" isBusy />
                        <span style={{ width: '10px' }} />
                        <SkeletonLoader
                            duration={+`${2}.0${i}`}
                            height="23px"
                            width={`${Math.floor(Math.random() * 51) + 50}%`}
                            isBusy
                        />
                    </li>
                ))}
        </ul>
    );
}

SkeletonSet.defaultProps = {};

SkeletonSet.propTypes = {};

export default SkeletonSet;
