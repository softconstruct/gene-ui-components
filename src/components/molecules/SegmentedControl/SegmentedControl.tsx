import React, {
    Children,
    cloneElement,
    createContext,
    FC,
    FunctionComponentElement,
    useMemo,
    useRef,
    useState
} from "react";
import classNames from "classnames";

// Styles
import "./SegmentedControl.scss";

// Component
import { HelperText, Label } from "../../../index";
import { ISegmentedControlButtonProps } from "./SegmentedControlButton";

type SizeType = "large" | "medium" | "small";

interface ISegmentedControlContextProps {
    size: SizeType;
    onSelect?: (name: string) => void;
}

interface ISegmentedControlProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Additional descriptive text shown with info icon and tooltip alongside of the label component.
     */
    infoText?: string;
    /**
     * The text content of the `label`.
     * This is the main text displayed within the `label`.
     */
    label?: string;
    /**
     * SegmentedControlButton component. Renders inside the component
     */
    children:
        | FunctionComponentElement<ISegmentedControlButtonProps>
        | FunctionComponentElement<ISegmentedControlButtonProps>[];
    /**
     * The actual text content to be displayed as helper text.
     */
    helperText?: string;
    /**
     *  It works when the user clicks on one of the control items. Returns the value of the `name` prop from the `SegmentedControlButton`.
     */
    onChange: (name: string) => void;
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: SizeType;
    /**
     * Indicates whether the label represents a required field.
     * When set to `true`, a visual indicator (asterisk) will be added to denote that the field is required.
     */
    required?: boolean;
    /**
     *  Determines the component appearance based on its status.<br>
     *  Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
}

export const SegmentedControlContext = createContext<ISegmentedControlContextProps>(
    {} as ISegmentedControlContextProps
);

const SegmentedControl: FC<ISegmentedControlProps> = ({
    className,
    children,
    onChange,
    helperText,
    label,
    infoText,
    required,
    size = "medium",
    status = "rest" as const
}) => {
    const initialSelected = useMemo(() => {
        const arrayChildren = Children.toArray(children) as FunctionComponentElement<ISegmentedControlButtonProps>[];
        const found = arrayChildren.find((child) => child.props.selected);
        return found?.props.name ?? "";
    }, [children]);

    const [selectedElementName, setSelectedElementName] = useState(initialSelected);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const onSelect = (name: string) => {
        setSelectedElementName(name);
        onChange(name);
    };

    const memoizedSegmentedControlContext: ISegmentedControlContextProps = useMemo(() => {
        return {
            size,
            onSelect
        };
    }, [size]);

    const textSizes = size === "large" ? "medium" : size;

    const keydownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!wrapperRef.current) return;
        const items = Array.from(wrapperRef.current.querySelectorAll<HTMLButtonElement>('button[role="radio"]'));
        if (items.length === 0) return;

        const currentIndex = items.findIndex(
            (btn) => btn.getAttribute("name") === (selectedElementName || items[0].getAttribute("name"))
        );

        let nextIndex = currentIndex;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            nextIndex = (currentIndex + 1) % items.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            nextIndex = (currentIndex - 1 + items.length) % items.length;
        } else if (e.key === "Home") {
            nextIndex = 0;
        } else if (e.key === "End") {
            nextIndex = items.length - 1;
        } else {
            return;
        }

        e.preventDefault();
        const nextBtn = items[nextIndex];
        const nextName = nextBtn.getAttribute("name");
        if (nextName) {
            onSelect(nextName);
            nextBtn.focus();
        }
    };

    return (
        <SegmentedControlContext.Provider value={memoizedSegmentedControlContext}>
            <div className={classNames("segmentedControl", className)}>
                {label && <Label text={label} required={required} size={textSizes} infoText={infoText} />}
                <div
                    className="segmentedControl__wrapper"
                    aria-label={label}
                    ref={wrapperRef}
                    onKeyDown={keydownHandler}
                    role="presentation"
                >
                    {Children.map(children, (segment, index) => {
                        const isSelected = selectedElementName
                            ? selectedElementName === segment.props.name
                            : segment.props.selected || index === 0;
                        return cloneElement(segment, {
                            ...segment.props,
                            selected: isSelected
                        });
                    })}
                </div>
                {helperText && (
                    <HelperText
                        text={helperText}
                        className="segmentedControl__helperText"
                        size={textSizes}
                        status={status}
                    />
                )}
            </div>
        </SegmentedControlContext.Provider>
    );
};

export { ISegmentedControlProps, SegmentedControl as default };
