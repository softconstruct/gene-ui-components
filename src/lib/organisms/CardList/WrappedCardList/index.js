import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import WithTitle from './WithTitle';
import PaperWrapper from './PaperWrapper';
import CardList from '../DefaultCardList';

function WrapperTableContainer({
    name,
    titleActions,
    className,
    paperProps,
    withTitle,
    customSubHeader,
    ...cardProps
}) {
    return (
        <PaperWrapper className={classnames(className)} {...paperProps}>
            {withTitle ? (
                <WithTitle name={name} actions={titleActions}>
                    {customSubHeader}
                    <CardList {...cardProps} />
                </WithTitle>
            ) : (
                <>
                    {customSubHeader}
                    <CardList {...cardProps} />
                </>
            )}
        </PaperWrapper>
    );
}

WrapperTableContainer.propTypes = {
    /**
     * Module title name
     */
    name: PropTypes.node,
    /**
     * Actions for ModuleTitle component
     */
    titleActions: PropTypes.node,
    /**
     * Custom elements for sub header
     */
    customSubHeader: PropTypes.node,
    /**
     * Classname for card list
     */
    className: PropTypes.string,
    /**
     * Props for Paper component
     */
    paperProps: PropTypes.shape({ ...PaperWrapper.propTypes }),
    /**
     * Show/Hide ModuleTitle component
     */
    withTitle: PropTypes.bool,
    ...CardList.propTypes
};

WrapperTableContainer.defaultProps = {
    ...CardList.defaultProps
};

export default WrapperTableContainer;
