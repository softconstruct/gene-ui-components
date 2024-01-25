import React from 'react';
import classnames from 'classnames';

// Helpers
import { PaperWrapper } from '../utils';

// Local components
import Title from '../Title';

function WrapperTableTitle({ paperProps, ...props }) {
    return (
        <PaperWrapper className={classnames({ 'table-loader-container': props.loading })} {...paperProps}>
            <Title {...props} />
        </PaperWrapper>
    );
}

export default WrapperTableTitle;
