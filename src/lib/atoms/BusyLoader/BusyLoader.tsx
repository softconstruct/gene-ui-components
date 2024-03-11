import React, { FC, ReactNode } from 'react';

// Helpers
import classnames from 'classnames';

// Components
import { Icon } from '../../../index';
import BubbleLoader from './BubbleLoader';

// Styles
import './BusyLoader.scss';

interface IBusyLoaderProps {
    /**
     * Show loader
     */
    isBusy?: boolean;
    /**
     * Any valid React node. Renders when "isBusy" is set to false
     */
    children?: ReactNode;
    /**
     * Show some text when loading
     */
    loadingText?: string;
    /**
     * Loader available type/style
     */
    type?: 'spinner' | 'bubbles' | 'bar';
    /**
     * Loader size
     */
    spinnerSize?: 'small' | 'medium' | 'big';
    /**
     * Any custom class name
     */
    className?: string;
}

const BusyLoader: FC<IBusyLoaderProps> = ({ type, isBusy, children, className, loadingText, spinnerSize }) => {
    return type === 'bar' ? (
        <div className="bar-loader" />
    ) : isBusy ? (
        <div className={classnames('loader-holder', className)}>
            {/*@ts-ignore*/}
            {type === 'spinner' ? (
                <Icon type={`bc-icon-loader s-${spinnerSize}`} className={'zzzz'} />
            ) : (
                <BubbleLoader />
            )}
            {loadingText && <div className="loader-text">{loadingText}</div>}
        </div>
    ) : (
        children
    );
};

BusyLoader.defaultProps = {
    isBusy: true,
    children: null,
    type: 'spinner',
    spinnerSize: 'small'
};

BusyLoader.displayName = 'BusyLoader';

export { IBusyLoaderProps, BusyLoader as default };
