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
    Link,
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
import ToolbarColorButton from "@components/organisms/Editor/ToolbarColorButton/ToolbarColorButton";
import ToolbarFontSize from "@components/organisms/Editor/ToolbarFontSize/ToolbarFontSize";
import ToolbarLinkButton from "@components/organisms/Editor/ToolbarLinkButton/ToolbarLinkButton";
import ToolbarMenuButton, {
    IToolbarMenuButtonItem
} from "@components/organisms/Editor/ToolbarMenuButton/ToolbarMenuButton";

const parseFontSize = (fontSize?: string): number | undefined =>
    fontSize?.endsWith("px") ? Math.round(Number.parseFloat(fontSize)) : undefined;

const parseFontFamily = (fontFamily: string): string =>
    fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase();

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
        code: editor.isActive("code"),
        link: editor.isActive("link"),
        linkHref: (editor.getAttributes("link").href as string) ?? "",
        color: (textStyle.color as string) ?? "",
        backgroundColor: (textStyle.backgroundColor as string) ?? "",
        fontFamily: parseFontFamily((textStyle.fontFamily as string) ?? ""),
        fontSize: parseFontSize(textStyle.fontSize as string | undefined)
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
    buildChain: (chain: ToolbarChain) => ToolbarChain;
};

const toMenuItems = (actions: ToolbarAction[], state: ToolbarState | null): IToolbarMenuButtonItem[] =>
    actions.map(({ id, label, Icon, divider, isActive }) => ({
        id,
        label,
        Icon,
        divider,
        selected: state ? isActive(state) : false
    }));

const NO_COLOR = "";

const EDITOR_COLORS = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#B7B7B7",
    "#CCCCCC",
    "#D9D9D9",
    "#EFEFEF",
    "#FFFFFF",
    "#980000",
    "#FF0000",
    "#FF9900",
    "#FFFF00",
    "#00FF00",
    "#00FFFF",
    "#4A86E8",
    "#0000FF",
    "#9900FF",
    "#FF00FF"
];

const PRESET_COLOR_COUNT = 20;

const FONT_FAMILIES_BY_NAME: Record<string, { label: string; value: string }> = {
    arial: { label: "Arial", value: "Arial, Helvetica, sans-serif" },
    "book antiqua": { label: "Book Antiqua", value: "'Book Antiqua', Palatino, 'Palatino Linotype', serif" },
    "courier new": { label: "Courier New", value: "'Courier New', Courier, monospace" },
    georgia: { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
    tahoma: { label: "Tahoma", value: "Tahoma, Verdana, sans-serif" },
    "times new roman": { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
    "trebuchet ms": { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    verdana: { label: "Verdana", value: "Verdana, sans-serif" }
};

const toPresetColors = (customColors: string[] = []): string[] =>
    [NO_COLOR, ...customColors, ...EDITOR_COLORS].slice(0, PRESET_COLOR_COUNT);

const BLOCK_MENU_ACTIONS: ToolbarAction[] = [
    {
        id: "paragraph",
        label: "Normal",
        Icon: TextAlignLeft,
        isActive: (state) => state.headingLevel === 0,
        buildChain: (chain) => chain.setParagraph()
    },
    {
        id: "heading1",
        label: "Heading 1",
        Icon: Globe,
        isActive: (state) => state.headingLevel === 1,
        buildChain: (chain) => chain.setHeading({ level: 1 })
    },
    {
        id: "heading2",
        label: "Heading 2",
        Icon: Globe,
        isActive: (state) => state.headingLevel === 2,
        buildChain: (chain) => chain.setHeading({ level: 2 })
    },
    {
        id: "heading3",
        label: "Heading 3",
        Icon: Globe,
        isActive: (state) => state.headingLevel === 3,
        buildChain: (chain) => chain.setHeading({ level: 3 })
    }
];

const DEFAULT_FONT_FAMILY_LABEL = "Default";

const FONT_FAMILY_MENU_ACTIONS: ToolbarAction[] = [
    {
        id: "default",
        label: DEFAULT_FONT_FAMILY_LABEL,
        isActive: (state) => !FONT_FAMILIES_BY_NAME[state.fontFamily],
        buildChain: (chain) => chain.unsetFontFamily()
    },
    ...Object.entries(FONT_FAMILIES_BY_NAME).map(([name, { label, value }]) => ({
        id: name,
        label,
        isActive: (state: ToolbarState) => state.fontFamily === name,
        buildChain: (chain: ToolbarChain) => chain.setFontFamily(value)
    }))
];

const ALIGN_MENU_ACTIONS: ToolbarAction[] = [
    {
        id: "alignLeft",
        label: "Left Align",
        Icon: TextAlignLeft,
        isActive: (state) => state.textAlign === "left",
        buildChain: (chain) => chain.toggleTextAlign("left")
    },
    {
        id: "alignCenter",
        label: "Centre Align",
        Icon: TextAlignCenter,
        isActive: (state) => state.textAlign === "center",
        buildChain: (chain) => chain.toggleTextAlign("center")
    },
    {
        id: "alignRight",
        label: "Right Align",
        Icon: TextAlignRight,
        isActive: (state) => state.textAlign === "right",
        buildChain: (chain) => chain.toggleTextAlign("right")
    },
    {
        id: "alignJustify",
        label: "Justify Align",
        Icon: TextAlignJustify,
        isActive: (state) => state.textAlign === "justify",
        buildChain: (chain) => chain.toggleTextAlign("justify")
    }
];

const FORMAT_MENU_ACTIONS: ToolbarAction[] = [
    {
        id: "strike",
        label: "Strikethrough",
        Icon: EqualOff,
        isActive: (state) => state.strike,
        buildChain: (chain) => chain.toggleStrike()
    },
    {
        id: "subscript",
        label: "Subscript",
        Icon: EqualOff,
        isActive: (state) => state.subscript,
        buildChain: (chain) => chain.toggleSubscript()
    },
    {
        id: "superscript",
        label: "Superscript",
        Icon: EqualOff,
        divider: true,
        isActive: (state) => state.superscript,
        buildChain: (chain) => chain.toggleSuperscript()
    },
    {
        id: "clearFormat",
        label: "Clear Formatting",
        Icon: RecycleBin,
        isActive: () => false,
        buildChain: (chain) => chain.unsetStrike().unsetSubscript().unsetSuperscript()
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
    presetColors?: string[];
}

const Toolbar: FC<IToolbarProps> = ({ editor, disabled = false, presetColors }) => {
    const toolbarState = useToolbarState(editor);
    const colors = toPresetColors(presetColors);
    const isOff = disabled || !editor || !toolbarState;

    const applyWithFocus = (buildChain: (chain: ToolbarChain) => ToolbarChain): void => {
        if (editor) {
            buildChain(editor.chain().focus()).run();
        }
    };

    const applyWithoutFocus = (buildChain: (chain: ToolbarChain) => ToolbarChain): void => {
        if (editor) {
            buildChain(editor.chain()).run();
        }
    };

    const handleMenuChange =
        (actions: ToolbarAction[]) =>
        (id: string): void => {
            const action = actions.find((item) => item.id === id);

            if (action) {
                applyWithFocus(action.buildChain);
            }
        };

    const applyBackgroundColor = (color: string): void =>
        applyWithoutFocus((chain) => (color ? chain.setBackgroundColor(color) : chain.unsetBackgroundColor()));

    const applyTextColor = (color: string): void =>
        applyWithoutFocus((chain) => (color ? chain.setColor(color) : chain.unsetColor()));

    const applyFontSize = (size: number, returnFocus: boolean): void => {
        const buildFontSizeChain = (chain: ToolbarChain): ToolbarChain => chain.setFontSize(`${size}px`);

        if (returnFocus) {
            applyWithFocus(buildFontSizeChain);
        } else {
            applyWithoutFocus(buildFontSizeChain);
        }
    };

    const applyLink = (href: string): void =>
        applyWithFocus((chain) => chain.extendMarkRange("link").setLink({ href }));

    const removeLink = (): void => applyWithFocus((chain) => chain.extendMarkRange("link").unsetLink());

    const activeBlock = toolbarState ? BLOCK_MENU_ACTIONS.find(({ isActive }) => isActive(toolbarState)) : undefined;
    const activeAlign = toolbarState ? ALIGN_MENU_ACTIONS.find(({ isActive }) => isActive(toolbarState)) : undefined;
    const activeFontFamily = toolbarState ? FONT_FAMILIES_BY_NAME[toolbarState.fontFamily] : undefined;
    const AlignIcon = activeAlign?.Icon ?? TextAlignLeft;

    return (
        <div className="editor__header">
            <ToolbarButton
                IconBefore={ArrowUndo}
                aria-label="Undo"
                disabled={isOff || !toolbarState?.canUndo}
                onClick={() => applyWithFocus((chain) => chain.undo())}
            />
            <ToolbarButton
                IconBefore={ArrowRedo}
                aria-label="Redo"
                disabled={isOff || !toolbarState?.canRedo}
                onClick={() => applyWithFocus((chain) => chain.redo())}
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
            <ToolbarMenuButton
                className="editor__fontFamilyTrigger"
                label={activeFontFamily?.label ?? DEFAULT_FONT_FAMILY_LABEL}
                aria-label="Font"
                disabled={isOff}
                items={toMenuItems(FONT_FAMILY_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(FONT_FAMILY_MENU_ACTIONS)}
            />
            <Divider direction="vertical" className="editor__divider" />
            <ToolbarFontSize value={toolbarState?.fontSize} disabled={isOff} onChange={applyFontSize} />
            <Divider direction="vertical" className="editor__divider" />

            <ToolbarButton
                IconBefore={TextBold}
                aria-label="Bold"
                selected={toolbarState?.bold}
                disabled={isOff}
                onClick={() => applyWithFocus((chain) => chain.toggleBold())}
            />
            <ToolbarButton
                IconBefore={TextItalic}
                aria-label="Italic"
                selected={toolbarState?.italic}
                disabled={isOff}
                onClick={() => applyWithFocus((chain) => chain.toggleItalic())}
            />
            <ToolbarButton
                IconBefore={TextUnderline}
                aria-label="Underline"
                selected={toolbarState?.underline}
                disabled={isOff}
                onClick={() => applyWithFocus((chain) => chain.toggleUnderline())}
            />
            <ToolbarMenuButton
                Icon={TextCase}
                aria-label="Formatting"
                disabled={isOff}
                items={toMenuItems(FORMAT_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(FORMAT_MENU_ACTIONS)}
            />
            <ToolbarColorButton
                Icon={ColorFill}
                aria-label="Fill color"
                disabled={isOff}
                onChange={applyBackgroundColor}
                onClose={() => editor?.commands.focus()}
                color={toolbarState?.backgroundColor}
                recentColors={colors}
            />
            <ToolbarColorButton
                Icon={TextColor}
                aria-label="Text color"
                disabled={isOff}
                onChange={applyTextColor}
                onClose={() => editor?.commands.focus()}
                color={toolbarState?.color}
                recentColors={colors}
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
                onClick={() => applyWithFocus((chain) => chain.toggleBulletList())}
            />
            <ToolbarButton
                IconBefore={TextNumberList}
                aria-label="Numbered list"
                selected={toolbarState?.orderedList}
                disabled={isOff}
                onClick={() => applyWithFocus((chain) => chain.toggleOrderedList())}
            />
            <Divider direction="vertical" className="editor__divider" />

            <ToolbarLinkButton
                Icon={Link}
                aria-label="Link"
                value={toolbarState?.linkHref}
                selected={toolbarState?.link}
                disabled={isOff}
                onChange={applyLink}
                onRemove={removeLink}
            />
            <ToolbarButton
                IconBefore={Globe}
                aria-label="Code"
                selected={toolbarState?.code}
                disabled={isOff}
                onClick={() => applyWithFocus((chain) => chain.toggleCode())}
            />
        </div>
    );
};

const MemoizedToolbar = memo(Toolbar);

export { IToolbarProps, MemoizedToolbar as default };
