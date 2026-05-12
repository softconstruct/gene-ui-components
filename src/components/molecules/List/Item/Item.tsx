import React, { forwardRef, MouseEventHandler, ReactNode } from "react";
import classNames from "classnames";

// Styles
import "./Item.scss";

interface IItemProps {
    /**
     * Unique identifier for the item, used in selection logic.
     */
    id?: number | string;
    /**
     * Content displayed inside the item. Typically a text label.
     */
    children?: ReactNode;
    /**
     * Disables the item, preventing interaction.
     */
    disabled?: boolean;
    /**
     * Visual size of the item.
     */
    size?: "small" | "medium" | "large";
    /**
     * Click handler for interactive item mode.
     * When provided, content is wrapped in a `<button>` and becomes clickable.
     * When omitted, content is rendered as non-interactive (no button, not clickable).
     */
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /**
     * Index for the virtual item.
     */
    virtualIndex?: number;
}

/**
 * Item represents a single option inside the List.
 */
const Item = forwardRef<HTMLLIElement, IItemProps>(
    ({ id, children, disabled, size = "medium", onClick, virtualIndex }, ref) => (
        <li
            ref={ref}
            data-index={virtualIndex}
            className={classNames("item", `item_size_${size}`, {
                item_interactive: !!onClick
            })}
        >
            {onClick ? (
                <button
                    type="button"
                    role="option"
                    aria-selected="false"
                    className={classNames("item__button", {
                        item__button_disabled: disabled
                    })}
                    onClick={onClick}
                    disabled={disabled}
                    data-id={id}
                >
                    {children}
                </button>
            ) : (
                children
            )}
        </li>
    )
);

export { IItemProps, Item as default };
