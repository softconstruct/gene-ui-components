import React, { useRef, useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import isEqual from 'react-fast-compare';

// Helpers
import { guid } from 'utils';

// Components
import SkeletonLoader from '../../../atoms/SkeletonLoader';
import Copy from '../../../molecules/Copy';

function Col({
    id,
    row,
    text,
    index,
    getter,
    prefix,
    colIndex,
    copyable,
    formatter,
    autoSizeOn,
    colRenderer,
    isEditActive,
    customWidth,
    autoSizeWidth,
    copyableValue,
    stickyColumns,
    copyTooltipText,
    copiedTooltipText,
    initialColWidth,
    disabledColumnPin,
    defaultCustomWidth,
    ...restProps
}) {
    const mainRef = useRef(null);
    const guidRef = useRef(null);
    const mounted = useRef(null);
    const { [colIndex]: colStickyInfo = {} } = stickyColumns;
    const { offset = {}, isStickyLeft, isStickyRight } = colStickyInfo;
    const stickyStatus = String(colIndex) in stickyColumns;

    const { left = 0, right = 0 } = offset;
    const style = { left, right };

    const getterValue = getter ? getter(row, index, isEditActive) : text;
    const formattedValue = formatter ? formatter(getterValue, row, index, isEditActive) : getterValue;
    const inlineStyle = {
        width: autoSizeOn ? autoSizeWidth : customWidth || defaultCustomWidth || initialColWidth
    };

    const isValuePromise = formattedValue instanceof Promise;
    const [promiseValue, setPromiseValue] = useState(() => {
        if (isValuePromise) {
            guidRef.current = guid();
            return guidRef.current;
        }
    });

    useEffect(() => {
        mounted.current = true;

        isValuePromise && formattedValue.then((result) => mounted.current && setPromiseValue(result));

        return () => {
            mounted.current = false;
        };
    }, [formattedValue, isValuePromise, mounted.current]);

    const value = isValuePromise ? promiseValue : formattedValue;

    return (
        <>
            {stickyStatus && isStickyLeft && <sub />}
            {stickyStatus && isStickyRight && <sup />}
            <div
                className={classnames('ta-cell', {
                    ...(!disabledColumnPin
                        ? {
                              sticky: stickyStatus,
                              'sticky-left': isStickyLeft,
                              'sticky-right': isStickyRight
                          }
                        : {}),
                    'now-sticky': isStickyRight || isStickyLeft
                })}
                data-id={`${prefix}-${id}`}
                {...restProps}
                style={{ ...style, ...inlineStyle }}
                title={colRenderer ? '' : value}
                ref={mainRef}
            >
                <SkeletonLoader height={20} isBusy={guidRef.current && promiseValue === guidRef.current}>
                    {copyable && value && (
                        <Copy
                            value={value}
                            size="small"
                            className="cursor-pointer copy-icon"
                            copyTooltipText={copyTooltipText}
                            copiedTooltipText={copiedTooltipText}
                        />
                    )}
                    <div className="ellipsis-text">
                        {colRenderer ? colRenderer(value, index, row, isEditActive, formatter) : value}
                    </div>
                </SkeletonLoader>
            </div>
        </>
    );
}

Col.defaultProps = {
    copyTooltipText: 'Copy',
    copiedTooltipText: 'Copied!'
};

export default React.memo(Col, isEqual);
