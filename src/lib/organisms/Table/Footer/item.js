import React, { useMemo, memo } from 'react';
import classnames from 'classnames';
import isEqual from 'react-fast-compare';

function FooterItem({
    id,
    text,
    index,
    tdStyle,
    initialColWidth,
    colsInfo: {
        [id]: { autoSizeOn, customWidth, autoSizeWidth, defaultCustomWidth }
    },
    stickyColumns
}) {
    const { [index]: colStickyInfo = {} } = stickyColumns;
    const { offset = {}, isStickyRight, isStickyLeft } = colStickyInfo;
    const stickyStatus = String(index) in stickyColumns;
    const { left = 0, right = 0 } = offset;
    const style = { left, right };
    const inlineStyle = {
        width: autoSizeOn ? autoSizeWidth : customWidth || defaultCustomWidth || initialColWidth
    };

    return (
        <>
            {stickyStatus && isStickyLeft && <sub />}
            {stickyStatus && isStickyRight && <sup />}
            <div
                key={id}
                className={classnames('ta-cell ta-footer', {
                    sticky: stickyStatus,
                    'sticky-left': isStickyLeft,
                    'sticky-right': isStickyRight,
                    'now-sticky': isStickyRight || isStickyLeft
                })}
                style={{ ...style, ...tdStyle, ...inlineStyle }}
            >
                <div className="ellipsis-text" title={text || ''}>
                    {text}
                </div>
            </div>
        </>
    );
}

export default memo(FooterItem, isEqual);
