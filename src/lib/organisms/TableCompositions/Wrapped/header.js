import React from 'react';
import classnames from 'classnames';

// Helpers
import { PaperWrapper } from '../utils';

// Local components
import Header from '../Header';

function WrapperTableWithHeader({ paperProps, ...props }) {
    return (
        <PaperWrapper className={classnames({ 'table-loader-container': props.loading })} {...paperProps}>
            <Header {...props} />
        </PaperWrapper>
    );
}

export default WrapperTableWithHeader;
