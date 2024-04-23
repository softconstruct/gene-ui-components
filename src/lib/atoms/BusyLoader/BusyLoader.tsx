import React, { FC, ReactNode } from 'react';

// Components
import BusyLoaderHolderHOC from './BusyLoaderHolderHOC';
import Icon from '../Icon';

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
     * Show provided text when loading, it will be ignored in the `type` of `bar`
     */
    loadingText?: string;
    /**
     * Loader available type/style </br>
     * Possible values: `spinner | bubbles | bar`
     */
    type?: 'spinner' | 'bubbles' | 'bar';
    /**
     * Loader size </br>
     * Possible values: `small | medium | big`
     */
    spinnerSize?: 'small' | 'medium' | 'big';
    /**
     * Any custom class name
     */
    className?: string;
}

type BusyLoadersType = { [key in NonNullable<IBusyLoaderProps['type']>]: ReactNode };

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

    return isBusy ? <>{loaders[type]}</> : children;
};

export { IBusyLoaderProps, BusyLoader as default };
