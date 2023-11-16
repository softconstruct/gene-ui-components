import React from 'react';
import classnames from 'classnames';

import { PaperWrapper } from '../utils';
import Pagination from '../Pagination';

function WrapperTablePagination({ paperProps, ...props }) {
    return (
        <PaperWrapper className={classnames({ 'table-loader-container': props.loading })} {...paperProps}>
            <Pagination {...props} />
        </PaperWrapper>
    );
}

export default WrapperTablePagination;
