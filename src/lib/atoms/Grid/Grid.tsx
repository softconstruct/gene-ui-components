import React, { FC } from 'react';

// Styles
import './Grid.scss';

interface IGridProps {
    /**
     * Col description
     */
    Col?: unknown;
    /**
     * Row description
     */
    Row?: unknown;
}

const Grid: FC<IGridProps> = ({ Col, Row }) => {
    return <div className="grid">Grid</div>;
};

export { IGridProps, Grid as default };
