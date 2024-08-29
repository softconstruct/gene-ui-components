import React, { FC } from 'react';

// Styles
import './Grid.scss';

interface IRow extends React.PropsWithChildren {
    className?: string;
}

interface ICol extends React.PropsWithChildren {
    size: number | 'fixed';
}

interface IGridContainer extends React.PropsWithChildren {}

const Row: FC<IRow> = ({ children, className }) => {
    return <div className={`row ${className}`}>{children}</div>;
};

const Col: FC<ICol> = ({ children, size }) => {
    return <div className={`col-${size}`}>{children}</div>;
};

const GridContainer: FC<IGridContainer> = ({ children }) => {
    return <div className="grid-container">{children}</div>;
};

export default {
    Row,
    Col,
    GridContainer
};
