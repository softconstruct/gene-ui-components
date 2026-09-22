import React, { forwardRef } from "react";
import classNames from "classnames";

// Styles
import "./Editor.scss";

interface IEditorProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * defaultValue description
     */
    defaultValue?: unknown;
    /**
     * placeholder description
     */
    placeholder?: unknown;
    /**
     * readOnly description
     */
    readOnly?: unknown;
    /**
     * autofocus description
     */
    autofocus?: unknown;
    /**
     * onChange description
     */
    onChange?: unknown;
    /**
     * footerActions description
     */
    footerActions?: unknown;
}

/**
 * Editor is an interactive tool designed for creating, editing, and formatting text content within a user interface. It allows users to input text and apply various styles or structures to their content, offering both simple and advanced text manipulation capabilities.
 */
/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
const Editor = forwardRef<unknown, IEditorProps>(
    ({ className, defaultValue, placeholder, readOnly, autofocus, onChange, footerActions }: IEditorProps, ref) => {
        return <div className={classNames("editor", className)}>Editor</div>;
    }
);

export { IEditorProps, Editor as default };
