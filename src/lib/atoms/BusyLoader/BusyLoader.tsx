import React, { FC, ReactNode } from 'react';

// Components
import BusyLoaderHolderHOC from './BusyLoaderHolderHOC';
import Icon from '../Icon';

// Styles
import './BusyLoader.scss';

type BusyLoaderTypes = 'spinner' | 'bubbles' | 'bar';

type BusyLoadersType = { [key in BusyLoaderTypes]: ReactNode };

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
     * Show provided text when loading, it will be ignored in the `type` of `bar`
     */
    loadingText?: string;
    /**
     * Loader available type/style
     */
    type?: BusyLoaderTypes;
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
    const loaders: BusyLoadersType = {
        bar: <div className="bar-loader" />,
        spinner: (
            <BusyLoaderHolderHOC className={className} loadingText={loadingText}>
                {
                    // @ts-ignore
                    <Icon type={`bc-icon-loader s-${spinnerSize}`} />
                }
            </BusyLoaderHolderHOC>
        ),
        bubbles: (
            <BusyLoaderHolderHOC className={className} loadingText={loadingText}>
                <div className="bubble-loader">
                    <div className="dot dot1" />
                    <div className="dot dot2" />
                </div>
            </BusyLoaderHolderHOC>
        )
    };

    return isBusy ? loaders[type] : children;
};

export { IBusyLoaderProps, BusyLoader as default };
