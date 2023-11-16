import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { PaperWrapper, WithTitle } from '../utils';
import Header from '../Header';

function WrapperTableContainer({ name, titleActions, headerActions, className, paperProps, ...headerProps }) {
    return (
        <PaperWrapper
            className={classnames(className, {
                'table-loader-container': headerProps.loading
            })}
            {...paperProps}
        >
            <WithTitle name={name} actions={titleActions}>
                <Header actions={headerActions} {...headerProps} />
            </WithTitle>
        </PaperWrapper>
    );
}

WrapperTableContainer.propTypes = {
    name: PropTypes.string.isRequired,
    titleActions: PropTypes.node,
    headerActions: PropTypes.node,
    ...Header.propTypes
};

export default WrapperTableContainer;
