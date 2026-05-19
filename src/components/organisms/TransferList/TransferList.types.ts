import type { IActionableListItem, IActionableListTexts } from "@components/molecules/ActionableList";

type TTransferListDirection = "forward" | "backward";

interface ITransferListPanel {
    /**
     * Stable panel key and drag scope identifier.
     */
    id: string;
    /**
     * Controlled tree for this panel.
     */
    items?: IActionableListItem[];
    /**
     * Uncontrolled initial tree for this panel.
     */
    defaultItems?: IActionableListItem[];
    /**
     * Per-panel ActionableList texts; `searchLabel` is the panel label.
     */
    texts?: Partial<IActionableListTexts>;
}

interface ITransferListTexts {
    /**
     * Aria-label for move selected to the next panel.
     */
    moveForwardAriaLabel: string;
    /**
     * Aria-label for move selected to the previous panel.
     */
    moveBackwardAriaLabel: string;
}

interface ITransferListChangePayload {
    /**
     * Index of the panel items were moved from.
     */
    fromPanelIndex: number;
    /**
     * Index of the panel items were moved to.
     */
    toPanelIndex: number;
    /**
     * Move direction relative to panel order.
     */
    direction: TTransferListDirection;
    /**
     * IDs moved by the action (empty for in-panel reorder).
     */
    movedIds: string[];
    /**
     * Next state for all panels.
     */
    panels: IActionableListItem[][];
}

interface ITransferListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Two to four actionable list panels.
     */
    panels: ITransferListPanel[];
    /**
     * Enables drag-and-drop reorder within a panel and transfer to root rows of adjacent panels.
     */
    draggable?: boolean;
    /**
     * Localized strings for transfer controls.
     */
    texts?: Partial<ITransferListTexts>;
    /**
     * Called after move, cross-panel drag, or in-panel reorder.
     */
    onChange?: (payload: ITransferListChangePayload) => void;
}

export type {
    ITransferListChangePayload,
    ITransferListPanel,
    ITransferListProps,
    ITransferListTexts,
    TTransferListDirection
};
