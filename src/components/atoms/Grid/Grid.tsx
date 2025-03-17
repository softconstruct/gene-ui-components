import React, { FC, PropsWithChildren } from "react";

// Styles
import "./Grid.scss";

export interface IColProps extends PropsWithChildren {
    /**
     * Defines the size of the column <br/>
     * Possible values: `1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "fixed"`
     */
    size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "fixed";
    /**
     * Defines the offset of the column <br/>
     * Possible values: `0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12`
     */
    offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const Col: FC<IColProps> = ({ children, size, offset }) => {
    return <div className={`col-${size} ${offset ? `col-offset-${offset}` : ""}`}>{children}</div>;
};

export interface IRowProps extends PropsWithChildren {
    /**
     * Defines whether the row should be flexible or not <br/>
     */
    flexible?: boolean;
}

/**  The 12-column grid system is a flexible and robust layout
  structure designed to help create consistent and organized designs.
  It is based on dividing the design space into 12 equal-width columns, with gutters
  (spacing between columns) and margins (spacing around the edges)
  to ensure a harmonious and responsive layout. */

const Row: FC<IRowProps> = ({ children, flexible }) => {
    return <div className={`row ${flexible ? "flexible" : ""}`}>{children}</div>;
};

const Grid: FC<PropsWithChildren> = ({ children }) => {
    return <div className="grid">{children}</div>;
};

export { Row, Col, Grid };
