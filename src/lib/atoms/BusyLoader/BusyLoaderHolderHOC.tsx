import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';

interface IBusyLoaderHolderHOC {
    children?: ReactNode;
    loadingText?: string;
    className?: string;
}

const BusyLoaderHolderHOC: FC<IBusyLoaderHolderHOC> = ({ children, loadingText, className }) => {
    return (
        <div className={classnames('loader-holder', className)}>
            {children}
            {loadingText && <div className="loader-text">{loadingText}</div>}
        </div>
    );
};

export default BusyLoaderHolderHOC;
