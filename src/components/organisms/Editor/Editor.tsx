import React, { FC, useEffect, useRef, useState } from "react";
import { Editor as TiptapEditor } from "@tiptap/core";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import classNames from "classnames";

// Icons
import { IconProps } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Toolbar from "@components/organisms/Editor/Toolbar/Toolbar";

// Styles
import "./Editor.scss";

const PLACEHOLDER_ATTRIBUTE = "editor-placeholder";

const DEFAULT_ARIA_LABEL = "Rich text editor";

const getEditingAreaAttributes = (id?: string, ariaLabel?: string, readOnly?: boolean): Record<string, string> => ({
    class: "editor__content",
    role: "textbox",
    "aria-multiline": "true",
    "aria-label": ariaLabel ?? DEFAULT_ARIA_LABEL,
    ...(id !== undefined && { id }),
    ...(readOnly && { "aria-readonly": "true" })
});

interface IEditorFooterAction {
    /**
     * A unique identifier for the action.
     */
    id: string;
    /**
     * A React Functional Component rendered as the action's icon.
     */
    Icon: FC<IconProps>;
    /**
     * An ARIA label for the action, which is rendered as an icon only.
     */
    "aria-label"?: string;
    /**
     * A callback function that is called when the action is clicked.
     */
    onClick: () => void;
}

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
     */
    placeholder?: string;
    /**
     * Prevents the content from being edited. The toolbar is disabled alongside it.
     * @default false
     */
    readOnly?: boolean;
    /**
     * An ARIA label for the editing area.
     * @default "Rich text editor"
     */
    "aria-label"?: string;
    /**
     * HEX strings offered in the text and fill color pickers. Twenty colors are shown:
     * a "no color" one, then these, then as many of the editor's own palette as still fit.
     */
    presetColors?: string[];
    /**
     * Actions rendered as icon buttons in the editor's footer. The footer is left out when no
     * action is passed.
     */
    footerActions?: IEditorFooterAction[];
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
    placeholder,
    readOnly = false,
    "aria-label": ariaLabel,
    presetColors,
    footerActions,
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
                StarterKit.configure({
                    heading: {
                        levels: [1, 2, 3]
                    }
                }),
                Subscript,
                Superscript,
                TextAlign.configure({ types: ["heading", "paragraph"] }),
                TextStyleKit.configure({
                    lineHeight: false
                }),
                Placeholder.configure({
                    placeholder: () => placeholderRef.current ?? "",
                    emptyEditorClass: "editor__empty",
                    dataAttribute: PLACEHOLDER_ATTRIBUTE
                })
            ],
            content: defaultValueRef.current,
            editable: !readOnlyRef.current,
            editorProps: {
                attributes: getEditingAreaAttributes(idRef.current, ariaLabelRef.current, readOnlyRef.current)
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
        editor?.setOptions({ editorProps: { attributes: getEditingAreaAttributes(id, ariaLabel, readOnly) } });
    }, [editor, id, ariaLabel, readOnly]);

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

            <div className="editor__viewport">
                <Scrollbar>
                    <div ref={bodyRef} className="editor__body" />
                </Scrollbar>
            </div>

            {footerActions && footerActions.length > 0 && (
                <div className="editor__footer">
                    {footerActions.map(({ id: actionId, Icon, "aria-label": actionLabel, onClick }) => (
                        <Button
                            key={actionId}
                            id={actionId}
                            Icon={Icon}
                            appearance="secondary"
                            layout="text"
                            size="medium"
                            aria-label={actionLabel}
                            onClick={onClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export { IEditorProps, IEditorFooterAction, Editor as default };
