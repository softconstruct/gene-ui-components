import React, { FC } from 'react';

// Styles
import './Loader.scss';

interface ILoaderProps {
    /**
     * isBusy description
     */
    isBusy?: unknown;
}

const Loader: FC<ILoaderProps> = ({ isBusy }) => {
    return <div className="loader">Loader</div>;
};

export { ILoaderProps, Loader as default };
