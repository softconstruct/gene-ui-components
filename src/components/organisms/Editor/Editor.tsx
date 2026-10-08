import React, { FC, useEffect, useRef, useState } from "react";
import { Editor as TiptapEditor } from "@tiptap/core";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import classNames from "classnames";

// Components
import Toolbar from "@components/organisms/Editor/Toolbar/Toolbar";

// Styles
import "./Editor.scss";

const PLACEHOLDER_ATTRIBUTE = "editor-placeholder";

const getEditingAreaAttributes = (id?: string, ariaLabel?: string): Record<string, string> => ({
    class: "editor__content",
    role: "textbox",
    "aria-multiline": "true",
    ...(id === undefined ? {} : { id }),
    ...(ariaLabel === undefined ? {} : { "aria-label": ariaLabel })
});

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
     * Prevents the content from being edited. The toolbar is disabled alongside it.
     * @default false
     */
    readOnly?: boolean;
    /**
     * An ARIA label for the editing area.
     */
    "aria-label"?: string;
    /**
     * HEX strings offered in the text and fill color pickers. Twenty colors are shown:
     * a "no color" one, then these, then as many of the editor's own palette as still fit.
     */
    presetColors?: string[];
    /**
     * Callback function which triggers when the content is changed by the user.
     */
    onChange?: (value: string) => void;
}

/**
 * Editor is an interactive tool designed for creating, editing, and formatting text content within a user interface. It allows users to input text and apply various styles or structures to their content, offering both simple and advanced text manipulation capabilities.
 */
const Editor: FC<IEditorProps> = ({
    className,
    id,
    defaultValue,
    placeholder = "Start writing...",
    readOnly = false,
    "aria-label": ariaLabel,
    presetColors,
    onChange
}) => {
    const bodyRef = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<TiptapEditor | null>(null);

    const placeholderRef = useRef(placeholder);
    const defaultValueRef = useRef(defaultValue);
    const readOnlyRef = useRef(readOnly);
    const idRef = useRef(id);
    const ariaLabelRef = useRef(ariaLabel);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        const hasChanged = placeholderRef.current !== placeholder;
        placeholderRef.current = placeholder;

        if (hasChanged) {
            editor?.view.dispatch(editor.state.tr);
        }
    }, [editor, placeholder]);

    useEffect(() => {
        if (!bodyRef.current) {
            return undefined;
        }

        const instance = new TiptapEditor({
            element: bodyRef.current,
            extensions: [
                StarterKit,
                Subscript,
                Superscript,
                TextAlign.configure({ types: ["heading", "paragraph"] }),
                TextStyleKit.configure({
                    fontFamily: false,
                    fontSize: false,
                    lineHeight: false
                }),
                Placeholder.configure({
                    placeholder: () => placeholderRef.current,
                    emptyEditorClass: "editor__content_empty",
                    dataAttribute: PLACEHOLDER_ATTRIBUTE
                })
            ],
            content: defaultValueRef.current,
            editable: !readOnlyRef.current,
            editorProps: {
                attributes: getEditingAreaAttributes(idRef.current, ariaLabelRef.current)
            }
        });

        setEditor(instance);

        return () => {
            instance.destroy();
        };
    }, []);

    useEffect(() => {
        editor?.setEditable(!readOnly, false);
    }, [editor, readOnly]);

    useEffect(() => {
        editor?.setOptions({ editorProps: { attributes: getEditingAreaAttributes(id, ariaLabel) } });
    }, [editor, id, ariaLabel]);

    useEffect(() => {
        if (!editor) {
            return undefined;
        }

        const handleUpdate = (): void => onChangeRef.current?.(editor.getHTML());
        editor.on("update", handleUpdate);

        return () => {
            editor.off("update", handleUpdate);
        };
    }, [editor]);

    return (
        <div className={classNames("editor", className)}>
            <Toolbar editor={editor} disabled={readOnly} presetColors={presetColors} />

            <div ref={bodyRef} className="editor__body" />
        </div>
    );
};

export { IEditorProps, Editor as default };
