import React, { FC, PropsWithChildren } from "react";

// Styles
import "./Grid.scss";

export interface IRow extends PropsWithChildren {
    flexible?: boolean;
}

export interface ICol extends PropsWithChildren {
    size: number | "fixed";
    offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const Row: FC<IRow> = ({ children, flexible }) => {
    return <div className={`row ${flexible ? "flexible" : ""}`}>{children}</div>;
};

const Col: FC<ICol> = ({ children, size, offset }) => {
    return <div className={`col-${size} ${offset ? `col-offset-${offset}` : ""}`}>{children}</div>;
};

const GridContainer: FC<PropsWithChildren> = ({ children }) => {
    return <div className="grid-container">{children}</div>;
};

export default {
    Row,
    Col,
    GridContainer
};
