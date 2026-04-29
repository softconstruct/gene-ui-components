import React, { CSSProperties, forwardRef, MouseEventHandler, ReactNode } from "react";
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
     * Click handler for interactive item mode.
     * When provided, content is wrapped in a `<button>` and becomes clickable.
     * When omitted, content is rendered as non-interactive (no button, not clickable).
     */
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /**
     * Additional class for the virtual item.
     */
    virtualClassName?: string;
    /**
     * Style for the virtual item.
     */
    virtualStyle?: CSSProperties;
    /**
     * Index for the virtual item.
     */
    virtualIndex?: number;
}

/**
 * Item represents a single option inside the List.
 */
const Item = forwardRef<HTMLLIElement, IItemProps>(
    ({ id, children, disabled, onClick, virtualClassName, virtualStyle, virtualIndex }, ref) => (
        <li
            ref={ref}
            data-index={virtualIndex}
            style={virtualStyle}
            className={classNames("item item_size_large", virtualClassName, {
                item_withCustomChildren: !onClick
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
