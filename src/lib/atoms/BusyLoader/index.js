import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from '../Icon';

// Styles
import './index.scss';

function BubbleLoader() {
    return (
        <div className="bubble-loader">
            <div className="dot dot1" />
            <div className="dot dot2" />
        </div>
    );
}

function BusyLoader(props) {
    const { type, isBusy, children, className, loadingText, spinnerSize } = props;

    return type === 'bar' ? (
        <div className="bar-loader" />
    ) : isBusy ? (
        <div className={classnames('loader-holder', className)}>
            {type === 'spinner' ? <Icon type={`bc-icon-loader s-${spinnerSize}`} /> : <BubbleLoader />}
            {loadingText && <div className="loader-text">{loadingText}</div>}
        </div>
    ) : (
        children
    );
}

BusyLoader.propTypes = {
    /**
     * Show loader
     */
    isBusy: PropTypes.bool,
    /**
     * Any valid React node. Renders when "isBusy" is set to false
     */
    children: PropTypes.node,
    /**
     * Show some text when loading
     */
    loadingText: PropTypes.string,
    /**
     * Loader available type/style
     */
    type: PropTypes.oneOf(['spinner', 'bubbles', 'bar']),
    /**
     * Loader size
     */
    spinnerSize: PropTypes.oneOf(['small', 'medium', 'big'])
};

BusyLoader.defaultProps = {
    isBusy: true,
    children: null,
    type: 'spinner',
    spinnerSize: 'small'
};

export default BusyLoader;
