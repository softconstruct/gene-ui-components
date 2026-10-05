import React, { FC, HTMLAttributes, MouseEvent } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Styles
import "./ToolbarButton.scss";

const ICON_SIZE: IconProps["size"] = 20;

const preventSelectionLoss = (event: MouseEvent<HTMLButtonElement>): void => event.preventDefault();

interface IToolbarButtonProps {
    /**
     * The text shown as content of the `button`. Omit it for an icon-only control.
     */
    children?: string;
    /**
     * A React Functional Component rendered before the text.
     */
    IconBefore?: FC<IconProps>;
    /**
     * A React Functional Component rendered after the text.
     */
    IconAfter?: FC<IconProps>;
    /**
     * Marks the control as engaged.
     */
    selected?: boolean;
    /**
     * Indicates whether the `button` is `disabled`, preventing user interaction, focus, click etc.
     */
    disabled?: boolean;
    /**
     * A callback function that is called when the `button` is clicked or entered.
     */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Additional class for the parent element.
     */
    className?: string;
    /**
     * Native tooltip, for a label the control is too narrow to show in full.
     */
    title?: string;
    /**
     * An ARIA label, for a control with no visible text.
     */
    "aria-label"?: string;
    /**
     * The props a popover trigger has to carry - the reference `ref`, the click and keyboard
     * handlers and the `aria-haspopup` / `aria-expanded` state. `Menu` supplies them through
     * `setPropsForPopover`.
     */
    triggerProps?: HTMLAttributes<HTMLButtonElement>;
}

/**
 * The control the Editor's toolbar is built from. Internal to the Editor.
 */
const ToolbarButton: FC<IToolbarButtonProps> = ({
    children,
    IconBefore,
    IconAfter,
    selected,
    disabled,
    onClick,
    className,
    title,
    "aria-label": ariaLabel,
    triggerProps
}) => (
    <button
        type="button"
        className={classNames("toolbarButton", className, {
            toolbarButton_selected: selected,
            toolbarButton_iconStart: !!IconBefore,
            toolbarButton_iconEnd: !!IconAfter,
            toolbarButton_square: !children && !(IconBefore && IconAfter)
        })}
        disabled={disabled}
        title={title}
        aria-label={ariaLabel}
        aria-pressed={selected}
        onClick={onClick}
        {...triggerProps}
        onMouseDown={preventSelectionLoss}
    >
        {IconBefore && <IconBefore size={ICON_SIZE} className="toolbarButton__icon" />}

        {children && <span className="toolbarButton__text ellipsis-text">{children}</span>}

        {IconAfter && <IconAfter size={ICON_SIZE} className="toolbarButton__icon" />}
    </button>
);

export { IToolbarButtonProps, ToolbarButton as default };
