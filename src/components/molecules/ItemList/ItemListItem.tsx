import React, { cloneElement, FC, isValidElement, MouseEvent, ReactNode } from "react";
import classNames from "classnames";

interface IItemListItemProps {
    /**
     * Unique identifier for the item, used in selection logic.
     */
    id: number | string;
    /**
     * Content displayed inside the item. Typically a text label.
     */
    children?: ReactNode;
    /**
     * Disables the item, preventing interaction.
     */
    disabled?: boolean;
    /**
     * Callback triggered when the item is clicked.
     */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Custom render function for the item.<br/>
     * Receives item data and should return a React element (e.g. `<a>`, router `<Link>`).<br/>
     * The returned element will be cloned with item list classes, click handler, and disabled state injected automatically.
     */
    render?: (itemData: { id: number | string }) => ReactNode;
}

/**
 * ItemListItem represents a single option inside the ItemList.
 */
const ItemListItem: FC<IItemListItemProps> = ({ id, children, disabled, onClick, className, render }) => {
    if (render) {
        const renderedElement = render({ id });

        if (isValidElement(renderedElement)) {
            const originalOnClick = (renderedElement.props as { onClick?: (event: MouseEvent) => void }).onClick;

            const propsToApply = {
                className: classNames("itemListItem", renderedElement.props.className, className, {
                    itemListItem_disabled: disabled
                }),
                onClick: (event: MouseEvent<HTMLButtonElement>) => {
                    if (disabled) return;
                    originalOnClick?.(event);
                    if (!event.defaultPrevented) {
                        onClick?.(event);
                    }
                },
                disabled,
                "data-id": id
            };

            return cloneElement(renderedElement, propsToApply, children);
        }
    }

    return (
        <button
            type="button"
            role="option"
            aria-selected="false"
            className={classNames("itemListItem", className, {
                itemListItem_disabled: disabled
            })}
            onClick={onClick}
            disabled={disabled}
            {...(disabled ? { tabIndex: -1 } : {})}
            data-id={id}
        >
            <span className="ellipsis-text">{children}</span>
        </button>
    );
};

export { IItemListItemProps, ItemListItem as default };
