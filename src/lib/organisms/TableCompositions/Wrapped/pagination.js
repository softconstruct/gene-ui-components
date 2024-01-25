import React from 'react';
import classnames from 'classnames';

// Helpers
import { PaperWrapper } from '../utils';

// Local components
import Pagination from '../Pagination';

function WrapperTablePagination({ paperProps, ...props }) {
    return (
        <PaperWrapper className={classnames({ 'table-loader-container': props.loading })} {...paperProps}>
            <Pagination {...props} />
        </PaperWrapper>
    );
}

export default WrapperTablePagination;
