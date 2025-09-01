import React, { FC, PointerEvent, useState } from "react";
import classNames from "classnames";

import { CaretDownFilled, IconProps } from "@geneui/icons";

import Loader from "@components/atoms/Loader";
import { Menu, MenuItem } from "@components/molecules/Menu";

// Styles
import "./SplitButton.scss";

interface ISplitButtonProps {
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * Indicates whether the `button` is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * Type <br/>
     * Possible values: `fill | outline`
     */
    type?: "fill" | "outline";
    /**
     * Indicates the action meaning. <br>
     * Possible values: `primary | secondary | inverse`
     */
    appearance?: "primary" | "secondary" | "inverse";
    /**
     * The `Icon` prop accepts a React Functional Component that will be displayed alongside the button text.
     */
    Icon?: FC<IconProps>;
    /**
     * A callback function that is called when the `button` is clicked or entered. <br>
     * It receives an argument containing the event object, which can be a mouse or keyboard event.
     */
    onClick: (e: PointerEvent<HTMLButtonElement>) => void;
    /**
     * Indicates whether the `SplitButton` is in a loading state.
     * When set to `true` a `skeleton` indicator will be shown instead of the `Avatar`.
     */
    loading?: boolean;
}

/**
 * A split button allows users to choose from several related actions. The primary action is displayed as the button label, while additional actions are accessible from a dropdown menu.
 */
const SplitButton: FC<ISplitButtonProps> = ({
    size = "large",
    disabled = false,
    type = "fill",
    appearance = "primary",
    Icon,
    onClick,
    loading
}) => {
    const [propsForPopover, setPropsForPopover] = useState({});

    const buttonsClassNames = `splitButton__button splitButton__button_size_${size} splitButton__button_type_${type} splitButton__button_appearance_${appearance}`;

    return (
        <div className="splitButton">
            {loading ? (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={onClick}
                    className={classNames(buttonsClassNames, "splitButton__button_loading")}
                >
                    {/* todo: change appearance value from "inverse" to "brand" or "neutral", depending on SplitButton "type" and "appearance" */}
                    <Loader size="small" appearance="inverse" />
                </button>
            ) : (
                <>
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onClick}
                        className={classNames(buttonsClassNames, `${Icon ? "splitButton__button_icon_before" : ""}`)}
                    >
                        {Icon && <Icon size={20} className="button__icon" />}
                        <span className="splitButton__text">Button</span>
                    </button>

                    <button
                        type="button"
                        disabled={disabled}
                        className={classNames(buttonsClassNames, "splitButton__button_icon_only")}
                        {...propsForPopover}
                    >
                        <CaretDownFilled className="splitButton__icon" />
                    </button>
                    <Menu
                        onChange={() => {}}
                        setPropsForPopover={setPropsForPopover}
                        swappable
                        position="bottom-right"
                        size="small"
                    >
                        <MenuItem id="0">action 1</MenuItem>
                        <MenuItem id="0">action 2</MenuItem>
                    </Menu>
                </>
            )}
        </div>
    );
};

export { ISplitButtonProps, SplitButton as default };
