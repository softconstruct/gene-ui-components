import React, {
    Children,
    cloneElement,
    FC,
    FunctionComponentElement,
    KeyboardEvent,
    MouseEvent,
    useState
} from "react";
// Styles
import "./SegmentedControl.scss";

// Component
import { IconProps } from "@geneui/icons";
import { HelperText, Label } from "../../../index";

// Types
import { IGlobalProps } from "./types";

interface ISegmentedControlProps extends Omit<IGlobalProps, "name" | "children" | "isSelected"> {
    /**
     * The text content of the `label`.
     * This is the main text displayed within the `label`.
     */
    label?: string;
    /**
     * Control component. Renders inside the component
     */
    children: FunctionComponentElement<IGlobalProps> | FunctionComponentElement<IGlobalProps>[];
    /**
     * The actual text content to be displayed as helper text.
     */
    helperText?: string;
    /**
     * Works when the user clicks on one of the buttons. Returns the value that was written as a name in the Control component.
     */
    onChange: (name: string) => void;

    // TODO:remove duplicate types after tests
    /**
     * The `Icon` prop accepts a React Functional Component that will be displayed alongside the button text.
     */
    Icon?: FC<IconProps>;
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * Icon position <br>
     * If the prop is `true` the `Icon` will be shown before  the `text` otherwise after   the `text`.
     */
    iconBefore?: boolean;
    /**
     * Indicates whether the `button` is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     *Displays the selected item
     */
    selected?: boolean;
    /**
     * Additional descriptive text shown with info icon and tooltip alongside of the label component.
     */
    infoText?: string;
}

const SegmentedControl: FC<ISegmentedControlProps> = ({
    children,
    onChange,
    helperText,
    label,
    infoText,
    ...props
}) => {
    const [selectedElementName, setSelectedElementName] = useState("");
    const clickHandler = (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const name =
            target.tagName === "BUTTON" ? target.getAttribute("name") : target.parentElement?.getAttribute("name");
        if (name) {
            onChange(name);
            setSelectedElementName(name);
        }
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            clickHandler(e);
        }
    };

    const textSizes = props.size === "large" ? "medium" : props.size;

    return (
        <div className="segmentedControl">
            <Label labelText={label} required size={textSizes} infoText={infoText} />
            <div
                className="segmentedControl__wrapper"
                onClick={clickHandler}
                onKeyDown={onKeyDown}
                tabIndex={-1}
                aria-label="segmented control"
                role="button"
            >
                {Children.map(children, (el) => {
                    return cloneElement(el, {
                        ...props,
                        ...el.props,
                        isSelected: selectedElementName ? selectedElementName === el.props.name : el.props.isSelected
                    });
                })}
            </div>
            {helperText && <HelperText text={helperText} size={textSizes} />}
        </div>
    );
};

export { ISegmentedControlProps, SegmentedControl as default };
