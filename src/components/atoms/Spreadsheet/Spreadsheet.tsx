import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Spreadsheet.scss";

interface ISpreadsheetProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * inset description
     */
    inset?: unknown;
    /**
     * children description
     */
    children?: unknown;
}

/**
 * The Spreadsheet component is a mobile-specific layout container designed to fully cover the Popover in mobile view. It acts as a structured content shell for displaying or editing contextual information triggered by a Popover — giving users a focused, full-screen experience on smaller screens.
 */
const Spreadsheet: FC<ISpreadsheetProps> = ({ inset, children, className }) => {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ children:", children);
    // eslint-disable-next-line no-console
    console.log("🚀 ~ inset:", inset);

    return <div className={classNames("spreadsheet", className)}>Spreadsheet</div>;
};

export { ISpreadsheetProps, Spreadsheet as default };
