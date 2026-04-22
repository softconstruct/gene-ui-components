import type { IActionableListItem, IActionableListTexts } from "@components/molecules/ActionableList";

type TTransferListDirection = "toTarget" | "toSource";

interface ITransferListTexts {
    /**
     * Left panel title.
     */
    leftTitle: string;
    /**
     * Right panel title.
     */
    rightTitle: string;
    /**
     * Aria-label for move selected to right action.
     */
    moveToTargetAriaLabel: string;
    /**
     * Aria-label for move selected to left action.
     */
    moveToSourceAriaLabel: string;
    /**
     * Optional nested ActionableList text overrides used on both panels.
     */
    listTexts?: Partial<IActionableListTexts>;
}

interface ITransferListChangePayload {
    /**
     * Move action direction.
     */
    direction: TTransferListDirection;
    /**
     * IDs moved by the action.
     */
    movedIds: string[];
    /**
     * Next source tree after move.
     */
    sourceItems: IActionableListItem[];
    /**
     * Next target tree after move.
     */
    targetItems: IActionableListItem[];
}

interface ITransferListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Controlled source tree.
     */
    sourceItems?: IActionableListItem[];
    /**
     * Controlled target tree.
     */
    targetItems?: IActionableListItem[];
    /**
     * Uncontrolled initial source tree.
     */
    defaultSourceItems?: IActionableListItem[];
    /**
     * Uncontrolled initial target tree.
     */
    defaultTargetItems?: IActionableListItem[];
    /**
     * Localized strings.
     */
    texts?: Partial<ITransferListTexts>;
    /**
     * Called after move action with delta and next state.
     */
    onChange?: (payload: ITransferListChangePayload) => void;
}

export type { ITransferListChangePayload, ITransferListProps, ITransferListTexts, TTransferListDirection };
