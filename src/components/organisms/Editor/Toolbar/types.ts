import { FC } from "react";
import type { Editor as TiptapEditor } from "@tiptap/core";

import { IconProps } from "@geneui/icons";

interface IToolbarState {
    canUndo: boolean;
    canRedo: boolean;
    bold: boolean;
    italic: boolean;
    headingLevel: number;
    strike: boolean;
    textAlign: string;
    underline: boolean;
    subscript: boolean;
    superscript: boolean;
    bulletList: boolean;
    orderedList: boolean;
    code: boolean;
    link: boolean;
    linkHref: string;
    color: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize?: number;
}

type ToolbarChain = ReturnType<TiptapEditor["chain"]>;

interface IToolbarAction {
    id: string;
    label: string;
    Icon?: FC<IconProps>;
    divider?: boolean;
    isActive: (state: IToolbarState) => boolean;
    buildChain: (chain: ToolbarChain) => ToolbarChain;
}

export { IToolbarState, IToolbarAction, ToolbarChain };
