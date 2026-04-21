import React, { cloneElement, FC, isValidElement, MouseEvent, ReactNode } from "react";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

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
     * Returns the clicked item props.
     */
    onClick?: (item: IItemListItemProps) => void;
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
const ItemListItem: FC<IItemListItemProps> = ({ id, children, disabled, onClick, render }) => {
    const handleClick = () => {
        onClick?.({ id, children, disabled, onClick, render });
    };

    if (render) {
        const renderedElement = render({ id });

        if (isValidElement(renderedElement)) {
            const originalOnClick = (renderedElement.props as { onClick?: (event: MouseEvent) => void }).onClick;

            const propsToApply = {
                className: classNames("itemListItem", renderedElement.props.className, {
                    itemListItem_disabled: disabled
                }),
                onClick: (event: MouseEvent<HTMLButtonElement>) => {
                    if (disabled) return;
                    originalOnClick?.(event);
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
            className={classNames("itemListItem", {
                itemListItem_disabled: disabled
            })}
            onClick={handleClick}
            disabled={disabled}
            data-id={id}
        >
            {typeof children === "string" ? (
                <Text className="ellipsis-text" as="span" variant="bodyMediumMedium">
                    {children}
                </Text>
            ) : (
                children
            )}
        </button>
    );
};

export { IItemListItemProps, ItemListItem as default };
