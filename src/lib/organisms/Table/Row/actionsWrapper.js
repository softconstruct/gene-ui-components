import React from 'react';
import { isFragment } from 'react-is';

import Button from '../../../atoms/Button';

function ActionsWrapper({ children }) {
    return isFragment(children) || Array.isArray(children) ? (
        <>
            <div className="ta-action ta-a-1">
                <div className="ta-item">
                    <Button icon="bc-icon-more-horizontal" size="big" appearance="minimal" />
                </div>
            </div>
            <div className="ta-action ta-a-2">
                <div className="ta-item">{children}</div>
            </div>
        </>
    ) : (
        <div className="ta-action ta-a-1">
            <div className="ta-item">{children}</div>
        </div>
    );
}

export default ActionsWrapper;
