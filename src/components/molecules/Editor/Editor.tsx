import React, { FC } from "react";
import classNames from "classnames";
import { EditorState } from "draft-js";
import { Editor as EditorComponent } from "react-draft-wysiwyg";

// Styles
import "./Editor.scss";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface IEditorProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Editor component props interface
}

/**
 * Editor is an interactive tool designed for creating, editing, and formatting text content within a user interface. It allows users to input text and apply various styles or structures to their content, offering both simple and advanced text manipulation capabilities.
 */
const Editor: FC<IEditorProps> = ({ className }) => {
    const editorState = EditorState.createEmpty();
    return (
        <div className={classNames("editor", className)}>
            <EditorComponent
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={() => {}}
            />
        </div>
    );
};

export { IEditorProps, Editor as default };
