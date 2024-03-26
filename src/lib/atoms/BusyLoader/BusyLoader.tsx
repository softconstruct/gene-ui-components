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

const BusyLoader: FC<IBusyLoaderProps> = ({
    type = 'spinner',
    isBusy = true,
    children = null,
    className,
    loadingText,
    spinnerSize = 'small'
}) => {
    return type === 'bar' ? (
        <div className="bar-loader" />
    ) : isBusy ? (
        <div className={classnames('loader-holder', className)}>
            {type === 'spinner' ? (
                // @ts-ignore
                <Icon type={`bc-icon-loader s-${spinnerSize}`} />
            ) : (
                <BubbleLoader />
            )}
            {loadingText && <div className="loader-text">{loadingText}</div>}
        </div>
    ) : (
        children
    );
};

export { IBusyLoaderProps, BusyLoader as default };
