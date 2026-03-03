import React, { Dispatch, FC, ReactElement, SetStateAction, useCallback, useEffect, useState } from "react";
import classNames from "classnames";

// Components
import { IPopoverProps, Popover, PopoverBody } from "@components/atoms/Popover";

// Styles
import "./AutoComplete.scss";

type SizeType = "large" | "medium" | "small";

const popoverSizeMapping = {
    large: "medium",
    medium: "small",
    small: "small"
} as const;

type GenericObject = Record<string, unknown>;

interface IAutoCompleteProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The content of the autocomplete dropdown. These should be `AutoCompleteItem` components.
     */
    children: ReactElement | ReactElement[];
    /**
     * A function for setting additional props for the Popover component that wraps the autocomplete.
     * This will be provided by the parent (e.g. SearchField/TextField) and applied to the anchor element.
     */
    setPropsForPopover: Dispatch<SetStateAction<GenericObject>>;
    /**
     * Autocomplete size.<br/>
     * Default value is `small`.<br/>
     * Possible values: `large | medium | small`
     */
    size?: SizeType;
    /**
     * Position of the autocomplete popover, relative to the reference (trigger, anchor) element.<br/>
     * Possible values: `bottom-center | bottom-left | bottom-right | left-bottom | left-center` <br/>
     * `left-top | right-bottom | right-center | right-top | top-center | top-left | top-right | auto`
     */
    position?: IPopoverProps["position"];
    /**
     * Controls the open state for autocomplete, for more info see the Popover component open state.
     * If omitted, the component manages its own open state.
     */
    open?: boolean;
}

/**
 * Autocomplete component enhances input fields by providing real-time suggestions as the user types. As users begin entering text, a list of potential matches is dynamically generated, allowing them to quickly select from these options instead of typing the entire input manually.
 */
const AutoComplete: FC<IAutoCompleteProps> = ({
    className,
    children,
    setPropsForPopover,
    size = "small",
    position = "bottom-left",
    open
}) => {
    const [isOpenState, setIsOpenState] = useState<boolean>(true);

    useEffect(() => {
        if (open !== undefined) {
            setIsOpenState(open);
        }
    }, [open]);

    const setReferenceProps = useCallback(
        (value: SetStateAction<GenericObject>) => {
            // For now we simply forward Popover's props to the parent setter.
            // The parent (e.g. TextField/SearchField) will apply these to the anchor element.
            setPropsForPopover(value);
        },
        [setPropsForPopover]
    );

    return (
        <Popover
            setProps={setReferenceProps}
            size={popoverSizeMapping[size]}
            position={position}
            withArrow={false}
            open={isOpenState}
            margin={4}
        >
            <PopoverBody withPadding className="autoComplete__body" withScrollbar={false}>
                <div className={classNames("autoComplete", className)}>{children}</div>
            </PopoverBody>
        </Popover>
    );
};

export { IAutoCompleteProps, AutoComplete as default };
