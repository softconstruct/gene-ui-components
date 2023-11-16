import React from 'react';
import classnames from 'classnames';

import { PaperWrapper } from '../utils';
import Title from '../Title';

function WrapperTableTitle({ paperProps, ...props }) {
    return (
        <PaperWrapper className={classnames({ 'table-loader-container': props.loading })} {...paperProps}>
            <Title {...props} />
        </PaperWrapper>
    );
}

export default WrapperTableTitle;
