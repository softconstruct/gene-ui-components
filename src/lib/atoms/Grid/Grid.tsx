import React, { FC } from 'react';

// Styles
import './Grid.scss';

interface IRow extends React.PropsWithChildren {
    className?: string;
}

interface ICol extends React.PropsWithChildren {
    size: number | 'fixed';
    offset: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}

interface IGridContainer extends React.PropsWithChildren {}

const Row: FC<IRow> = ({ children, className }) => {
    return <div className={`row ${className}`}>{children}</div>;
};

const Col: FC<ICol> = ({ children, size, offset }) => {
    return <div className={`col-${size} ${offset ? 'col-offset-' + offset : ''}`}>{children}</div>;
};

const GridContainer: FC<IGridContainer> = ({ children }) => {
    return <div className="grid-container">{children}</div>;
};

export default {
    Row,
    Col,
    GridContainer
};
