export interface IActionableListItem {
    /**
     * Unique item identifier.
     */
    id: string;
    /**
     * Main row title.
     */
    title: string;
    /**
     * Optional tooltip text for the info icon.
     */
    infoText?: string;
    /**
     * Child nodes — parent rows infer counts from `children.length` / subtree for the "Selected x/y" label.
     */
    children?: IActionableListItem[];
    /**
     * When this is a **boolean**, the row is **controlled**: keep `items` in sync via `onItemsChange`; row toggles use `onItemCheck`, toolbar select all uses `onSelectAllChange`.
     * When **omitted**, the list stores selection internally while you still pass normal `items` (id, title, infoText, children).
     */
    checked?: boolean;
}

export interface IActionableListTexts {
    /**
     * Search field label.
     */
    searchLabel: string;
    /**
     * Search input placeholder.
     */
    searchPlaceholder: string;
    /**
     * Label before the bulk "selected items" count (toolbar row).
     */
    bulkSelectedItemsLabel: string;
    /**
     * Label for filtered items count.
     */
    filteredItemsLabel: string;
    /**
     * Label for total items count.
     */
    totalItemsLabel: string;
    /**
     * Prefix for selected/total row counter.
     */
    selectedItemsLabel: string;
    /**
     * Loading text near spinner.
     */
    loadingTitle: string;
    /**
     * Empty state title for no data.
     */
    noDataTitle: string;
    /**
     * Empty state description for no data.
     */
    noDataDescription: string;
    /**
     * Empty state title when search returns no results.
     */
    noResultsTitle: string;
    /**
     * Empty state description when search returns no results.
     */
    noResultsDescription: string;
    /**
     * Accessible label for expand/collapse button.
     */
    expandButtonAriaLabel: string;
}

export interface IActionableListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Tree items to render.
     */
    items?: IActionableListItem[];
    /**
     * Enables checkbox variant.
     */
    withCheckbox?: boolean;
    /**
     * Enables drag and drop variant.
     */
    draggable?: boolean;
    /**
     * Optional controlled loading state.
     */
    loading?: boolean;
    /**
     * Text and localization values.
     */
    texts?: Partial<IActionableListTexts>;
    /**
     * Emits whenever nested data changes (check/reorder).
     */
    onItemsChange?: (items: IActionableListItem[]) => void;
    /**
     * Emits when a **row** checkbox toggles (not the toolbar Select all): the row from `items` (after update),
     * branch `checked`, and full `items` tree.
     */
    onItemCheck?: (item: IActionableListItem, checked: boolean, items: IActionableListItem[]) => void;
    /**
     * Emits when the toolbar **Select all** checkbox is toggled: target `checked` state and full updated `items` tree.
     */
    onSelectAllChange?: (checked: boolean, items: IActionableListItem[]) => void;
    /**
     * Emits debounced search value.
     */
    onSearch?: (value: string) => void;
}
