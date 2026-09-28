import React, { FC, memo, ReactNode, useEffect, useState } from "react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import { redoDepth, undoDepth } from "@tiptap/pm/history";
import classNames from "classnames";

const TEXT_COLORS = [
    { value: "#d93025", label: "Red" },
    { value: "#1a73e8", label: "Blue" },
    { value: "#188038", label: "Green" }
];

const TEXT_CASES = [
    { value: "uppercase", label: "UPPERCASE" },
    { value: "lowercase", label: "lowercase" },
    { value: "capitalize", label: "Capitalize" }
];

const getToolbarState = (editor: TiptapEditor) => ({
    canUndo: undoDepth(editor.state) > 0,
    canRedo: redoDepth(editor.state) > 0,
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    subscript: editor.isActive("subscript"),
    superscript: editor.isActive("superscript"),
    bulletList: editor.isActive("bulletList"),
    orderedList: editor.isActive("orderedList"),
    textTransform: (editor.getAttributes("textStyle").textTransform as string) ?? "",
    color: (editor.getAttributes("textStyle").color as string) ?? ""
});

type ToolbarState = ReturnType<typeof getToolbarState>;

const isToolbarStateEqual = (a: ToolbarState, b: ToolbarState): boolean =>
    a.canUndo === b.canUndo &&
    a.canRedo === b.canRedo &&
    a.bold === b.bold &&
    a.italic === b.italic &&
    a.subscript === b.subscript &&
    a.superscript === b.superscript &&
    a.bulletList === b.bulletList &&
    a.orderedList === b.orderedList &&
    a.textTransform === b.textTransform &&
    a.color === b.color;

/**
 * Bridges the editor's state into React.
 * `@tiptap/react` provides this as `useEditorState`
 */
const useToolbarState = (editor: TiptapEditor | null): ToolbarState | null => {
    const [toolbarState, setToolbarState] = useState<ToolbarState | null>(null);

    useEffect(() => {
        if (!editor) {
            setToolbarState(null);
            return undefined;
        }

        const update = (): void => {
            const next = getToolbarState(editor);

            setToolbarState((previous) => (previous && isToolbarStateEqual(previous, next) ? previous : next));
        };

        update();
        editor.on("transaction", update);

        return () => {
            editor.off("transaction", update);
        };
    }, [editor]);

    return toolbarState;
};

interface IToolbarButtonProps {
    label: string;
    isActive?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: ReactNode;
}

const ToolbarButton: FC<IToolbarButtonProps> = ({ label, isActive, disabled, onClick, children }) => (
    <button
        type="button"
        className={classNames("editor__button", { editor__button_active: isActive })}
        title={label}
        aria-label={label}
        aria-pressed={isActive}
        disabled={disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
    >
        {children}
    </button>
);

interface IEditorToolbarProps {
    editor: TiptapEditor | null;
    disabled?: boolean;
}

const EditorToolbar: FC<IEditorToolbarProps> = ({ editor, disabled = false }) => {
    const toolbarState = useToolbarState(editor);
    const isOff = disabled || !editor || !toolbarState;

    const run = (apply: (chain: ReturnType<TiptapEditor["chain"]>) => { run: () => boolean }): void => {
        if (editor) {
            apply(editor.chain().focus()).run();
        }
    };

    return (
        <div className="editor__header">
            <ToolbarButton
                label="Undo"
                disabled={isOff || !toolbarState?.canUndo}
                onClick={() => run((chain) => chain.undo())}
            >
                ↶
            </ToolbarButton>
            <ToolbarButton
                label="Redo"
                disabled={isOff || !toolbarState?.canRedo}
                onClick={() => run((chain) => chain.redo())}
            >
                ↷
            </ToolbarButton>

            <ToolbarButton
                label="Bold"
                isActive={toolbarState?.bold}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleBold())}
            >
                <b>B</b>
            </ToolbarButton>
            <ToolbarButton
                label="Italic"
                isActive={toolbarState?.italic}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleItalic())}
            >
                <i>I</i>
            </ToolbarButton>
            <ToolbarButton
                label="Subscript"
                isActive={toolbarState?.subscript}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleSubscript())}
            >
                X₂
            </ToolbarButton>
            <ToolbarButton
                label="Superscript"
                isActive={toolbarState?.superscript}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleSuperscript())}
            >
                X²
            </ToolbarButton>

            <select
                aria-label="Text case"
                title="Text case"
                disabled={isOff}
                value={toolbarState?.textTransform ?? ""}
                onChange={(event) =>
                    run((chain) =>
                        event.target.value
                            ? chain.setMark("textStyle", { textTransform: event.target.value })
                            : chain.setMark("textStyle", { textTransform: null }).removeEmptyTextStyle()
                    )
                }
            >
                <option value="">Ab</option>
                {TEXT_CASES.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                aria-label="Text color"
                title="Text color"
                disabled={isOff}
                value={toolbarState?.color ?? ""}
                onChange={(event) =>
                    run((chain) => (event.target.value ? chain.setColor(event.target.value) : chain.unsetColor()))
                }
            >
                <option value="">Color</option>
                {TEXT_COLORS.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <ToolbarButton
                label="Bulleted list"
                isActive={toolbarState?.bulletList}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleBulletList())}
            >
                •
            </ToolbarButton>
            <ToolbarButton
                label="Numbered list"
                isActive={toolbarState?.orderedList}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleOrderedList())}
            >
                1.
            </ToolbarButton>
        </div>
    );
};

const MemoizedEditorToolbar = memo(EditorToolbar);

export { IEditorToolbarProps, MemoizedEditorToolbar as default };
