import React, {
    Children,
    cloneElement,
    createContext,
    FC,
    FunctionComponentElement,
    KeyboardEvent,
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
     * Additional descriptive text that appears alongside the `label`,
     * typically displayed as a tooltip triggered by an info icon.
     * Helps provide extra context or guidance to the user.
     */
    infoText?: string;
    /**
     * The text displayed as the label for the segmented control, describing its purpose or function.
     */
    label?: string;
    /**
     * SegmentedControlButton components to display as segments. Renders inside the component.
     */
    children:
        | FunctionComponentElement<ISegmentedControlButtonProps>
        | FunctionComponentElement<ISegmentedControlButtonProps>[];
    /**
     * Helper text to provide context or explain any errors related to the segmented control.
     */
    helperText?: string;
    /**
     * Fires when the user selects one of the control items. Returns the value of the `name` prop from the `SegmentedControlButton`.
     */
    onChange: (name: string) => void;
    /**
     * Size of the segmented control.<br>
     * Possible values: `large | medium | small`
     */
    size?: SizeType;
    /**
     * Specifies whether the segmented control is mandatory for completing a form.
     */
    required?: boolean;
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
    size = "medium"
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

    const keydownHandler = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!wrapperRef.current) return;
        const items = Array.from(wrapperRef.current.querySelectorAll<HTMLButtonElement>('button[role="radio"]'));
        if (items.length === 0) return;

        const currentIndex = items.findIndex(
            (btn) => btn.getAttribute("name") === (selectedElementName || items[0].getAttribute("name"))
        );

        let nextIndex: number;

        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                nextIndex = (currentIndex + 1) % items.length;
                break;
            case "ArrowLeft":
            case "ArrowUp":
                nextIndex = (currentIndex - 1 + items.length) % items.length;
                break;
            case "Home":
                nextIndex = 0;
                break;
            case "End":
                nextIndex = items.length - 1;
                break;
            default:
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
                        status="rest"
                    />
                )}
            </div>
        </SegmentedControlContext.Provider>
    );
};

export { ISegmentedControlProps, SegmentedControl as default };
