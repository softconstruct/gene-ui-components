import React, {
    Children,
    Dispatch,
    FC,
    KeyboardEvent as ReactKeyboardEvent,
    MouseEvent as ReactMouseEvent,
    ReactElement,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import classNames from "classnames";

import Loader from "@components/atoms/Loader";
// Components
import { IPopoverProps, IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import Empty from "@components/molecules/Empty";

// Hooks
import { useClickOutside } from "@hooks/index";

// Styles
import "./AutoComplete.scss";

import AutoCompleteFooter from "./AutoCompleteFooter";

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
     * Indicates whether the autocomplete is in a loading state. If true, a loading indicator is displayed instead of the items.
     */
    loading?: boolean;
    /**
     * The text to display alongside the loader when loading is true.
     */
    loadingText?: string;
    /**
     * Text to display when there are no items to show (no results).
     */
    emptyText?: string;
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
    /**
     * When true, shows the footer with the \"Show more\" button.
     */
    showMore?: boolean;
    /**
     * Callback when the \"Show more\" button is clicked.
     */
    onShowMore?: () => void;
    /**
     * Text for the \"Show more\" button.
     */
    showMoreLabel?: string;
    /**
     * Callback when the open state changes.
     */
    onOpenChange?: (isOpen: boolean) => void;
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
    open,
    loading,
    loadingText,
    emptyText,
    showMore,
    onShowMore,
    showMoreLabel,
    onOpenChange
}) => {
    const [isOpenState, setIsOpenState] = useState<boolean>(false);
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    useEffect(() => {
        if (open !== undefined) {
            setIsOpenState(open);
        }
    }, [open]);

    useEffect(() => {
        if (onOpenChange) {
            onOpenChange(isOpenState);
        }
    }, [isOpenState, onOpenChange]);

    useClickOutside(
        (e) => {
            if (!isOpenState) return;

            const onTargetClick =
                e.target instanceof Node &&
                popoverRef.current.referenceElement?.current instanceof Node &&
                popoverRef.current.referenceElement.current.contains(e.target);

            if (!onTargetClick) {
                setIsOpenState(false);
                if (onOpenChange) {
                    onOpenChange(false);
                }
            }
        },
        [popoverRef.current.floatingElement]
    );

    const toggleAutoCompleteOpen = useCallback(() => {
        setIsOpenState((prev) => !prev);
    }, []);

    const enhanceTriggerPropsRef = useRef<(triggerProps: GenericObject) => GenericObject>();

    const enhanceTriggerProps = useCallback(
        (triggerProps: GenericObject): GenericObject => {
            if (!triggerProps || typeof triggerProps !== "object") {
                return triggerProps;
            }

            const { onClick, onKeyDown, ...rest } = triggerProps as {
                onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
                onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
                [key: string]: unknown;
            };

            return {
                ...rest,
                onClick: (event: ReactMouseEvent<HTMLElement>) => {
                    onClick?.(event);
                    if (!event.defaultPrevented) {
                        toggleAutoCompleteOpen();
                    }
                },
                onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
                    onKeyDown?.(event);
                    if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        toggleAutoCompleteOpen();
                    }
                }
            };
        },
        [toggleAutoCompleteOpen]
    );

    enhanceTriggerPropsRef.current = enhanceTriggerProps;

    const setReferenceProps = useCallback(
        (value: SetStateAction<GenericObject>) => {
            const enhanceFn = enhanceTriggerPropsRef.current;
            if (!enhanceFn) {
                if (typeof value === "function") {
                    setPropsForPopover((prev) => value(prev));
                } else {
                    setPropsForPopover(value);
                }
                return;
            }

            if (typeof value === "function") {
                setPropsForPopover((prev) => {
                    const nextValue = value(prev);
                    return enhanceFn(nextValue);
                });
            } else {
                setPropsForPopover(enhanceFn(value));
            }
        },
        [setPropsForPopover]
    );

    const hasChildren = useMemo(() => Children.count(children) > 0, [children]);

    const content = useMemo(() => {
        if (loading) {
            return (
                <div className="autoComplete__loader">
                    <Loader text={loadingText} textPosition="below" />
                </div>
            );
        }
        if (!hasChildren) {
            return (
                <div className="autoComplete__empty">
                    <Empty description={emptyText} appearance="noResult" size="small" />
                </div>
            );
        }
        return (
            <div className="autoComplete__inner">
                <Scrollbar className="autoComplete__scrollbar">
                    <div className={classNames("autoComplete", className, "autoComplete__content")}>{children}</div>
                </Scrollbar>
                {showMore && (
                    <AutoCompleteFooter
                        showMore={showMore}
                        onShowMore={onShowMore}
                        showMoreLabel={showMoreLabel}
                        disabled={!hasChildren}
                    />
                )}
            </div>
        );
    }, [children, className, emptyText, hasChildren, loading, loadingText, onShowMore, showMore, showMoreLabel]);

    return (
        <Popover
            setProps={setReferenceProps}
            size={popoverSizeMapping[size]}
            position={position}
            withArrow={false}
            open={isOpenState}
            margin={4}
            ref={popoverRef}
        >
            <PopoverBody withPadding className="autoComplete__body" withScrollbar={false}>
                {content}
            </PopoverBody>
        </Popover>
    );
};

export { IAutoCompleteProps, AutoComplete as default };
