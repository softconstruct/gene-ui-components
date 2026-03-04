import React, {
    Children,
    Dispatch,
    FC,
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

    const setReferenceProps = useCallback(
        (value: SetStateAction<GenericObject>) => {
            setPropsForPopover(value);
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
            <>
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
            </>
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
        >
            <PopoverBody withPadding className="autoComplete__body" withScrollbar={false}>
                {content}
            </PopoverBody>
        </Popover>
    );
};

export { IAutoCompleteProps, AutoComplete as default };
