import React, { FC, memo, useEffect, useState } from "react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import { redoDepth, undoDepth } from "@tiptap/pm/history";

import {
    ArrowRedo,
    ArrowUndo,
    ColorFill,
    EqualOff,
    Globe,
    IconProps,
    RecycleBin,
    TextAlignCenter,
    TextAlignJustify,
    TextAlignLeft,
    TextAlignRight,
    TextBold,
    TextBulletList,
    TextCase,
    TextColor,
    TextItalic,
    TextNumberList,
    TextUnderline
} from "@geneui/icons";

// Components
import Divider from "@components/atoms/Divider";
import ToolbarButton from "@components/organisms/Editor/ToolbarButton/ToolbarButton";
import ToolbarMenuButton, {
    IToolbarMenuButtonItem
} from "@components/organisms/Editor/ToolbarMenuButton/ToolbarMenuButton";

const getToolbarState = (editor: TiptapEditor) => {
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
        color: (textStyle.color as string) ?? "",
        backgroundColor: (textStyle.backgroundColor as string) ?? ""
    };
};

type ToolbarState = ReturnType<typeof getToolbarState>;

type ToolbarChain = ReturnType<TiptapEditor["chain"]>;

type ToolbarAction = {
    id: string;
    label: string;
    Icon?: FC<IconProps>;
    divider?: boolean;
    isActive: (state: ToolbarState) => boolean;
    apply: (chain: ToolbarChain, state: ToolbarState) => { run: () => boolean };
};

const toMenuItems = (actions: ToolbarAction[], state: ToolbarState | null): IToolbarMenuButtonItem[] =>
    actions.map(({ id, label, Icon, divider, isActive }) => ({
        id,
        label,
        Icon,
        divider,
        selected: state ? isActive(state) : false
    }));

const COLORS = [
    { value: "#d93025", label: "Red" },
    { value: "#1a73e8", label: "Blue" },
    { value: "#188038", label: "Green" }
];

const FILL_COLOR_MENU_ACTIONS: ToolbarAction[] = COLORS.map(({ value, label }) => ({
    id: `fill-${value}`,
    label,
    isActive: (state) => state.backgroundColor === value,
    apply: (chain, state) =>
        state.backgroundColor === value ? chain.unsetBackgroundColor() : chain.setBackgroundColor(value)
}));

const TEXT_COLOR_MENU_ACTIONS: ToolbarAction[] = COLORS.map(({ value, label }) => ({
    id: `color-${value}`,
    label,
    isActive: (state) => state.color === value,
    apply: (chain, state) => (state.color === value ? chain.unsetColor() : chain.setColor(value))
}));

const BLOCK_MENU_ACTIONS: ToolbarAction[] = [
    {
        id: "paragraph",
        label: "Normal",
        Icon: TextAlignLeft,
        isActive: (state) => state.headingLevel === 0,
        apply: (chain) => chain.setParagraph()
    },
    {
        id: "heading1",
        label: "Heading 1",
        Icon: Globe,
        isActive: (state) => state.headingLevel === 1,
        apply: (chain) => chain.setHeading({ level: 1 })
    },
    {
        id: "heading2",
        label: "Heading 2",
        Icon: Globe,
        isActive: (state) => state.headingLevel === 2,
        apply: (chain) => chain.setHeading({ level: 2 })
    },
    {
        id: "heading3",
        label: "Heading 3",
        Icon: Globe,
        isActive: (state) => state.headingLevel === 3,
        apply: (chain) => chain.setHeading({ level: 3 })
    }
];

const ALIGN_MENU_ACTIONS: ToolbarAction[] = [
    {
        id: "alignLeft",
        label: "Left Align",
        Icon: TextAlignLeft,
        isActive: (state) => state.textAlign === "left",
        apply: (chain) => chain.toggleTextAlign("left")
    },
    {
        id: "alignCenter",
        label: "Centre Align",
        Icon: TextAlignCenter,
        isActive: (state) => state.textAlign === "center",
        apply: (chain) => chain.toggleTextAlign("center")
    },
    {
        id: "alignRight",
        label: "Right Align",
        Icon: TextAlignRight,
        isActive: (state) => state.textAlign === "right",
        apply: (chain) => chain.toggleTextAlign("right")
    },
    {
        id: "alignJustify",
        label: "Justify Align",
        Icon: TextAlignJustify,
        isActive: (state) => state.textAlign === "justify",
        apply: (chain) => chain.toggleTextAlign("justify")
    }
];

const FORMAT_MENU_ACTIONS: ToolbarAction[] = [
    {
        id: "strike",
        label: "Strikethrough",
        Icon: EqualOff,
        isActive: (state) => state.strike,
        apply: (chain) => chain.toggleStrike()
    },
    {
        id: "subscript",
        label: "Subscript",
        Icon: EqualOff,
        isActive: (state) => state.subscript,
        apply: (chain) => chain.toggleSubscript()
    },
    {
        id: "superscript",
        label: "Superscript",
        Icon: EqualOff,
        divider: true,
        isActive: (state) => state.superscript,
        apply: (chain) => chain.toggleSuperscript()
    },
    {
        id: "clearFormat",
        label: "Clear Formatting",
        Icon: RecycleBin,
        isActive: () => false,
        apply: (chain) => chain.unsetStrike().unsetSubscript().unsetSuperscript()
    }
];

const isToolbarStateEqual = (previous: ToolbarState, next: ToolbarState): boolean =>
    (Object.keys(previous) as (keyof ToolbarState)[]).every((key) => previous[key] === next[key]);

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

interface IToolbarProps {
    editor: TiptapEditor | null;
    disabled?: boolean;
}

const Toolbar: FC<IToolbarProps> = ({ editor, disabled = false }) => {
    const toolbarState = useToolbarState(editor);
    const isOff = disabled || !editor || !toolbarState;

    const run = (apply: (chain: ToolbarChain) => { run: () => boolean }): void => {
        if (editor) {
            apply(editor.chain().focus()).run();
        }
    };

    const handleMenuChange =
        (actions: ToolbarAction[]) =>
        (id: string): void => {
            const action = actions.find((item) => item.id === id);

            if (action && toolbarState) {
                run((chain) => action.apply(chain, toolbarState));
            }
        };

    const activeBlock = toolbarState ? BLOCK_MENU_ACTIONS.find(({ isActive }) => isActive(toolbarState)) : undefined;
    const activeAlign = toolbarState ? ALIGN_MENU_ACTIONS.find(({ isActive }) => isActive(toolbarState)) : undefined;
    const AlignIcon = activeAlign?.Icon ?? TextAlignLeft;

    return (
        <div className="editor__header">
            <ToolbarButton
                IconBefore={ArrowUndo}
                aria-label="Undo"
                disabled={isOff || !toolbarState?.canUndo}
                onClick={() => run((chain) => chain.undo())}
            />
            <ToolbarButton
                IconBefore={ArrowRedo}
                aria-label="Redo"
                disabled={isOff || !toolbarState?.canRedo}
                onClick={() => run((chain) => chain.redo())}
            />
            <Divider direction="vertical" className="editor__divider" />
            <ToolbarMenuButton
                className="editor__textStyleTrigger"
                label={activeBlock?.label ?? ""}
                aria-label="Text style"
                disabled={isOff}
                items={toMenuItems(BLOCK_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(BLOCK_MENU_ACTIONS)}
            />
            <Divider direction="vertical" className="editor__divider" />

            <ToolbarButton
                IconBefore={TextBold}
                aria-label="Bold"
                selected={toolbarState?.bold}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleBold())}
            />
            <ToolbarButton
                IconBefore={TextItalic}
                aria-label="Italic"
                selected={toolbarState?.italic}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleItalic())}
            />
            <ToolbarButton
                IconBefore={TextUnderline}
                aria-label="Underline"
                selected={toolbarState?.underline}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleUnderline())}
            />
            <ToolbarMenuButton
                Icon={TextCase}
                aria-label="Formatting"
                disabled={isOff}
                items={toMenuItems(FORMAT_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(FORMAT_MENU_ACTIONS)}
            />
            <ToolbarMenuButton
                Icon={ColorFill}
                aria-label="Fill color"
                disabled={isOff}
                items={toMenuItems(FILL_COLOR_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(FILL_COLOR_MENU_ACTIONS)}
            />
            <ToolbarMenuButton
                Icon={TextColor}
                aria-label="Text color"
                disabled={isOff}
                items={toMenuItems(TEXT_COLOR_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(TEXT_COLOR_MENU_ACTIONS)}
            />
            <Divider direction="vertical" className="editor__divider" />
            <ToolbarMenuButton
                Icon={AlignIcon}
                aria-label="Alignment"
                disabled={isOff}
                items={toMenuItems(ALIGN_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(ALIGN_MENU_ACTIONS)}
            />

            <ToolbarButton
                IconBefore={TextBulletList}
                aria-label="Bulleted list"
                selected={toolbarState?.bulletList}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleBulletList())}
            />
            <ToolbarButton
                IconBefore={TextNumberList}
                aria-label="Numbered list"
                selected={toolbarState?.orderedList}
                disabled={isOff}
                onClick={() => run((chain) => chain.toggleOrderedList())}
            />
            <Divider direction="vertical" className="editor__divider" />
        </div>
    );
};

const MemoizedToolbar = memo(Toolbar);

export { IToolbarProps, MemoizedToolbar as default };
