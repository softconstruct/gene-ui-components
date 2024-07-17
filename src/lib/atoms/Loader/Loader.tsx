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
    return (
        <span className="loader loader_direction_horizontal loader_size_2xlarge loader_color_brand">
            <svg className="loader__spinner" viewBox="0 0 50 50">
                <circle className="loader__spinner_path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
            </svg>
            <span className="loader__text loader__text_color_brand">Loading Info</span>
        </span>
    );
};

export { ILoaderProps, Loader as default };
