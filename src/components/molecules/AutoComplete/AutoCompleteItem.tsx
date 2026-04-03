import React, { cloneElement, FC, isValidElement, ReactNode } from "react";
import classNames from "classnames";

interface IAutoCompleteItemProps {
    /**
     * Unique identifier for the item, used in selection logic.
     */
    id: number | string;
    /**
     * Content displayed inside the autocomplete item. Typically a text label.
     */
    children?: ReactNode;
    /**
     * Disables the item, preventing interaction.
     */
    disabled?: boolean;
    /**
     * Callback triggered when the item is clicked.
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Custom render function for the autocomplete item.<br/>
     * Receives item data and should return a React element (e.g. `<a>`, router `<Link>`).<br/>
     * The returned element will be cloned with autocomplete item classes, click handler, and disabled state injected automatically.
     */
    render?: (itemData: { id: number | string }) => ReactNode;
}

/**
 * AutoCompleteItem represents a single option inside the AutoComplete dropdown.
 */
const AutoCompleteItem: FC<IAutoCompleteItemProps> = ({ id, children, disabled, onClick, className, render }) => {
    if (render) {
        const renderedElement = render({ id });

        if (isValidElement(renderedElement)) {
            const originalOnClick = (renderedElement.props as { onClick?: (event: React.MouseEvent) => void }).onClick;

            const propsToApply = {
                className: classNames("autoComplete__item", renderedElement.props.className, className, {
                    autoComplete__item_disabled: disabled
                }),
                onClick: (event: React.MouseEvent) => {
                    originalOnClick?.(event);
                    if (!event.defaultPrevented) {
                        onClick?.(event as React.MouseEvent<HTMLButtonElement>);
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
            className={classNames("autoComplete__item", className, {
                autoComplete__item_disabled: disabled
            })}
            onClick={onClick}
            disabled={disabled}
            {...(disabled ? { tabIndex: -1 } : {})}
            data-id={id}
        >
            <span className="autoComplete__item_label">{children}</span>
        </button>
    );
};

export { IAutoCompleteItemProps, AutoCompleteItem as default };
