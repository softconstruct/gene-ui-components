import React, { FC, memo } from "react";
import type { Editor as TiptapEditor } from "@tiptap/core";

import {
    ArrowRedo,
    ArrowUndo,
    ColorFill,
    EqualOff,
    Globe,
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
import ColorTrigger from "@components/organisms/Editor/Toolbar/ColorTrigger/ColorTrigger";
import FontSizeStepper from "@components/organisms/Editor/Toolbar/FontSizeStepper/FontSizeStepper";
import LinkTrigger from "@components/organisms/Editor/Toolbar/LinkTrigger/LinkTrigger";
import MenuTrigger from "@components/organisms/Editor/Toolbar/MenuTrigger/MenuTrigger";
import ToolbarButton from "@components/organisms/Editor/Toolbar/ToolbarButton/ToolbarButton";

// Hooks
import useRovingFocus from "../hooks/useRovingFocus";
import useToolbarState from "../hooks/useToolbarState";
// Constants
import { DEFAULT_FONT_FAMILY_LABEL, FONT_FAMILIES_BY_NAME } from "./constants";
// Helpers
import { toMenuItems, toPresetColors } from "./helper";
// Types
import { IToolbarAction, IToolbarState, ToolbarChain } from "./types";

const BLOCK_MENU_ACTIONS: IToolbarAction[] = [
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

const FONT_FAMILY_MENU_ACTIONS: IToolbarAction[] = [
    {
        id: "default",
        label: DEFAULT_FONT_FAMILY_LABEL,
        isActive: (state) => !FONT_FAMILIES_BY_NAME[state.fontFamily],
        buildChain: (chain) => chain.unsetFontFamily()
    },
    ...Object.entries(FONT_FAMILIES_BY_NAME).map(([name, { label, value }]) => ({
        id: name,
        label,
        isActive: (state: IToolbarState) => state.fontFamily === name,
        buildChain: (chain: ToolbarChain) => chain.setFontFamily(value)
    }))
];

const ALIGN_MENU_ACTIONS: IToolbarAction[] = [
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

const FORMAT_MENU_ACTIONS: IToolbarAction[] = [
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

interface IToolbarProps {
    editor: TiptapEditor | null;
    disabled?: boolean;
    presetColors?: string[];
}

const Toolbar: FC<IToolbarProps> = ({ editor, disabled = false, presetColors }) => {
    const toolbarState = useToolbarState(editor);
    const { toolbarRef, handleKeyDown } = useRovingFocus(editor);
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
        (actions: IToolbarAction[]) =>
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
        <div
            ref={toolbarRef}
            className="editor__header"
            role="toolbar"
            aria-label="Text formatting"
            onKeyDown={handleKeyDown}
        >
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
            <MenuTrigger
                className="editor__textStyleTrigger"
                label={activeBlock?.label ?? ""}
                aria-label="Text style"
                disabled={isOff}
                items={toMenuItems(BLOCK_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(BLOCK_MENU_ACTIONS)}
            />
            <Divider direction="vertical" className="editor__divider" />
            <MenuTrigger
                className="editor__fontFamilyTrigger"
                label={activeFontFamily?.label ?? DEFAULT_FONT_FAMILY_LABEL}
                aria-label="Font"
                disabled={isOff}
                items={toMenuItems(FONT_FAMILY_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(FONT_FAMILY_MENU_ACTIONS)}
            />
            <Divider direction="vertical" className="editor__divider" />
            <FontSizeStepper value={toolbarState?.fontSize} disabled={isOff} onChange={applyFontSize} />
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
            <MenuTrigger
                Icon={TextCase}
                aria-label="Formatting"
                disabled={isOff}
                items={toMenuItems(FORMAT_MENU_ACTIONS, toolbarState)}
                onChange={handleMenuChange(FORMAT_MENU_ACTIONS)}
            />
            <ColorTrigger
                Icon={ColorFill}
                aria-label="Fill color"
                disabled={isOff}
                onChange={applyBackgroundColor}
                onClose={() => editor?.commands.focus()}
                color={toolbarState?.backgroundColor}
                recentColors={colors}
            />
            <ColorTrigger
                Icon={TextColor}
                aria-label="Text color"
                disabled={isOff}
                onChange={applyTextColor}
                onClose={() => editor?.commands.focus()}
                color={toolbarState?.color}
                recentColors={colors}
            />
            <Divider direction="vertical" className="editor__divider" />
            <MenuTrigger
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

            <LinkTrigger
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
