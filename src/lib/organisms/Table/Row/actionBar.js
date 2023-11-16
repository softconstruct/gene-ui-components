import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import classnames from 'classnames';

import ActionsWrapper from './actionsWrapper';

function ActionBar({ children, lastColRef, stickyRightExist }) {
    return (
        <div
            className={classnames('ta-cell', 'right-actions-holder', 'a-square', {
                'sticky sticky-right now-sticky': stickyRightExist
            })}
            ref={lastColRef}
        >
            {children && <ActionsWrapper>{children}</ActionsWrapper>}
        </div>
    );
}

export default memo(ActionBar, isEqual);
