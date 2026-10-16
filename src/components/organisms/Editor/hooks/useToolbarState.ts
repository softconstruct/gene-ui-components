import { useEffect, useState } from "react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import { redoDepth, undoDepth } from "@tiptap/pm/history";

import { parseFontFamily, parseFontSize } from "../Toolbar/helper";
import { IToolbarState } from "../Toolbar/types";

const getToolbarState = (editor: TiptapEditor): IToolbarState => {
    const paragraphAlign = editor.getAttributes("paragraph").textAlign as string | undefined;
    const headingAlign = editor.getAttributes("heading").textAlign as string | undefined;
    const textStyle = editor.getAttributes("textStyle");

    return {
        canUndo: undoDepth(editor.state) > 0,
        canRedo: redoDepth(editor.state) > 0,
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
        fontSize: parseFontSize(textStyle.fontSize as string | undefined)
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

export default useToolbarState;
