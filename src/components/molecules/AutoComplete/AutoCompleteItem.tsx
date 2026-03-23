import React, { FC, ReactNode } from "react";
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
}

/**
 * AutoCompleteItem represents a single option inside the AutoComplete dropdown.
 */
const AutoCompleteItem: FC<IAutoCompleteItemProps> = ({ id, children, disabled, onClick, className }) => {
    return (
        <button
            type="button"
            role="option"
            aria-selected={false}
            className={classNames("autoCompleteItem", className, {
                autoCompleteItem_disabled: disabled
            })}
            onClick={onClick}
            disabled={disabled}
            {...(disabled ? { tabIndex: -1 } : {})}
            data-id={id}
        >
            <span className="autoCompleteItem__label">{children}</span>
        </button>
    );
};

export { IAutoCompleteItemProps, AutoCompleteItem as default };
