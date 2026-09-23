import React, { forwardRef, useEffect, useRef } from "react";
import classNames from "classnames";
import Quill from "quill";

// Styles
import "./Editor.scss";

import "quill/dist/quill.core.css";

interface IEditorProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * A unique identifier for the editing area.
     */
    id?: string;
    /**
     * Initial HTML content of the editor. Read once, when the component mounts.
     */
    defaultValue?: string;
    /**
     * Text shown inside the editing area while it holds no content.
     * @default "Start writing..."
     */
    placeholder?: string;
    /**
     * Prevents the content from being edited.
     * @default false
     */
    readOnly?: boolean;
    /**
     * An ARIA label for the editing area.
     */
    "aria-label"?: string;
    /**
     * Callback function which triggers when the content is changed by the user.
     * Provides the editor's semantic HTML as its argument.
     */
    onChange?: (value: string) => void;
}

/**
 * Sets an attribute when a value is provided and removes it otherwise, so clearing a prop clears
 * the attribute rather than leaving a stale one behind.
 */
const syncAttribute = (element: HTMLElement, name: string, value?: string): void => {
    if (value === undefined) {
        element.removeAttribute(name);
    } else {
        element.setAttribute(name, value);
    }
};

/**
 * Editor is an interactive tool designed for creating, editing, and formatting text content within a user interface. It allows users to input text and apply various styles or structures to their content, offering both simple and advanced text manipulation capabilities.
 */
const Editor = forwardRef<HTMLDivElement, IEditorProps>(
    (
        {
            className,
            id,
            defaultValue,
            placeholder = "Start writing...",
            readOnly = false,
            "aria-label": ariaLabel,
            onChange
        },
        ref
    ) => {
        const editingAreaRef = useRef<HTMLDivElement>(null);
        const quillRef = useRef<Quill | null>(null);

        const onChangeRef = useRef(onChange);
        const defaultValueRef = useRef(defaultValue);

        useEffect(() => {
            onChangeRef.current = onChange;
        }, [onChange]);

        /**
         * Creates the editor. Runs once: re-running would discard whatever the user had typed.
         */
        useEffect(() => {
            const editingArea = editingAreaRef.current;

            if (!editingArea) {
                return undefined;
            }

            const quill = new Quill(editingArea, { modules: { toolbar: false } });

            quill.root.setAttribute("role", "textbox");
            quill.root.setAttribute("aria-multiline", "true");

            if (defaultValueRef.current) {
                quill.clipboard.dangerouslyPasteHTML(defaultValueRef.current, "silent");
            }

            /**
             * Quill reports every content change, including the ones it makes itself while the
             * initial value is applied; only the user's own edits reach the consumer.
             */
            quill.on("text-change", (_delta, _oldDelta, source) => {
                if (source !== "user") {
                    return;
                }

                onChangeRef.current?.(quill.getSemanticHTML());
            });

            quillRef.current = quill;

            /**
             * Quill has no public `destroy()`, so the nodes it appended are removed manually.
             */
            return () => {
                quillRef.current = null;
                editingArea.innerHTML = "";
            };
        }, []);

        useEffect(() => {
            quillRef.current?.enable(!readOnly);
        }, [readOnly]);

        /**
         * Attributes Quill renders from its own root element rather than from React, so they are
         * kept in step here instead of in the markup below.
         */
        useEffect(() => {
            const root = quillRef.current?.root;

            if (!root) {
                return;
            }

            root.dataset.placeholder = placeholder;
            syncAttribute(root, "id", id);
            syncAttribute(root, "aria-label", ariaLabel);
        }, [placeholder, id, ariaLabel]);

        return (
            <div ref={ref} className={classNames("editor", className)}>
                <div className="editor__header">Header</div>
                <div ref={editingAreaRef} className="editor__body" />
                <div className="editor__footer">Footer</div>
            </div>
        );
    }
);

Editor.displayName = "Editor";

export { IEditorProps, Editor as default };
