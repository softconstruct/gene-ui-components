import { useEffect, useState } from "react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";

import { parseFontFamily, parseFontSize } from "../Toolbar/helper";
import { IToolbarState } from "../Toolbar/types";

const getRenderedFontSize = (editor: TiptapEditor): number | undefined => {
    try {
        const { node } = editor.view.domAtPos(editor.state.selection.from);
        const element = node instanceof Element ? node : node.parentElement;

        if (!element) {
            return undefined;
        }

        const rendered = Number.parseFloat(window.getComputedStyle(element).fontSize);

        return Number.isNaN(rendered) ? undefined : Math.round(rendered);
    } catch {
        return undefined;
    }
};

const getToolbarState = (editor: TiptapEditor): IToolbarState => {
    const paragraphAlign = editor.getAttributes("paragraph").textAlign as string | undefined;
    const headingAlign = editor.getAttributes("heading").textAlign as string | undefined;
    const textStyle = editor.getAttributes("textStyle");

    return {
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        headingLevel: ([1, 2, 3] as const).find((level) => editor.isActive("heading", { level })) ?? 0,
        strike: editor.isActive("strike"),
        textAlign: paragraphAlign ?? headingAlign ?? "",
        underline: editor.isActive("underline"),
        subscript: editor.isActive("subscript"),
        superscript: editor.isActive("superscript"),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        code: editor.isActive("code"),
        link: editor.isActive("link"),
        linkHref: (editor.getAttributes("link").href as string) ?? "",
        color: (textStyle.color as string) ?? "",
        backgroundColor: (textStyle.backgroundColor as string) ?? "",
        fontFamily: parseFontFamily((textStyle.fontFamily as string) ?? ""),
        fontSize: parseFontSize(textStyle.fontSize as string | undefined) ?? getRenderedFontSize(editor)
    };
};

const isToolbarStateEqual = (previous: IToolbarState, next: IToolbarState): boolean =>
    (Object.keys(previous) as (keyof IToolbarState)[]).every((key) => previous[key] === next[key]);

/**
 * Bridges the editor's state into React.
 * `@tiptap/react` provides this as `useEditorState`
 */
const useToolbarState = (editor: TiptapEditor | null): IToolbarState | null => {
    const [toolbarState, setToolbarState] = useState<IToolbarState | null>(null);

    useEffect(() => {
        if (!editor) {
            setToolbarState(null);
            return undefined;
        }

        const update = (): void => {
            if (editor.isDestroyed) {
                return;
            }

            const next = getToolbarState(editor);

            setToolbarState((previous) => (previous && isToolbarStateEqual(previous, next) ? previous : next));
        };

        const handleTransaction = ({ transaction }: { transaction: Transaction }): void => {
            if (!transaction.docChanged && !transaction.selectionSet && !transaction.storedMarksSet) {
                return;
            }

            update();
        };

        update();
        editor.on("transaction", handleTransaction);

        return () => {
            editor.off("transaction", handleTransaction);
        };
    }, [editor]);

    return toolbarState;
};

export default useToolbarState;
