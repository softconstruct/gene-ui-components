import React, {
    Children,
    cloneElement,
    createContext,
    Dispatch,
    FC,
    FunctionComponentElement,
    JSX,
    KeyboardEvent as ReactKeyboardEvent,
    MouseEvent as ReactMouseEvent,
    MutableRefObject,
    ReactElement,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { ReferenceType } from "@floating-ui/react";
import classNames from "classnames";

// Components
import Loader from "@components/atoms/Loader";
import { IPopoverProps, IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Hooks
import { useClickOutside } from "@hooks/index";

// Styles
import "./Menu.scss";

// Helpers
import { findPathOfSelected, isActiveElementInside } from "./helper";
// Types
import { IMenuItemProps } from "./MenuItem";

const MENU_GAP_FROM_TARGET = 4;

export interface OnchangeHandlerType {
    generatedId: string;
    id: number | string;
    isBack: boolean;
    closeMenu: boolean;
    item?: IMenuItemProps;
}

type RelativeRefsSetter = (props: {
    generatedId: string;
    popoverFloatingRef: MutableRefObject<ReferenceType | null> | undefined;
}) => void;

type SizeType = "large" | "medium" | "small";

type GenericObject = Record<string, unknown>;

interface IMenuContextProps {
    onChangeHandler: (props: OnchangeHandlerType) => void;
    openSelectedPath?: boolean;
    swappable?: boolean;
    relativeRefsSetter: RelativeRefsSetter;
    size: SizeType;
}

interface IMenuProps {
    /**
     * The child elements of the menu. These should be <MenuItem/> components.
     */
    children: ReactElement | ReactElement[];
    /**
     * Indicates whether the menu is in a loading state. If true, a loading indicator is displayed instead of the menu items.
     */
    loading?: boolean;
    /**
     * The text to display alongside the loader when loading is true.
     */
    loadingText?: string;
    /**
     * Callback function hat returns all provided menu item props when a menu item is selected.
     */
    onChange?: (item: IMenuItemProps) => void;
    /**
     * If true, enables swapping behavior, modifying the appearance and behavior of the menu.
     */
    swappable?: boolean;
    /**
     * A function for setting additional props for the Popover component that wraps the menu.
     */
    setPropsForPopover: Dispatch<SetStateAction<GenericObject>>;
    /**
     * Menu size.<br/>
     * Default value is `small`.<br/>
     * Possible values: `large | medium | small`
     */
    size?: SizeType;
    /**
     * Position of the Menu first popover, relative to the reference (trigger, anchor) element.<br/>
     * Possible values: `bottom-center | bottom-left | bottom-right | left-bottom | left-center` <br/> `left-top | right-bottom | right-center | right-top | top-center | top-left | top-right | auto`
     */
    position?: IPopoverProps["position"];
    /**
     * Controls the open state for menu, for more info see the Popover component open state.
     */
    open?: boolean;
    /**
     * When a path is selected and this prop is true, the menu will open the corresponding page automatically via highlighting selection route.
     */
    openSelectedPath?: boolean;
    /**
     * Called when the open state is changed.
     */
    onOpenChange?: (isOpen: boolean) => void;
}

const cloneChildrenRecursive = (
    children: JSX.Element | JSX.Element[],
    paths: string[],
    props = {},
    pathID = ""
): FunctionComponentElement<IMenuItemProps>[] | ReactElement => {
    return Children.map(children, (child, i) => {
        const generatedId = pathID ? `${pathID}_${i}` : `${i}`;
        return cloneElement(
            child,
            {
                ...props,
                generatedId,
                paths
            },
            child.props.children && typeof child.props.children !== "string"
                ? cloneChildrenRecursive(child.props?.children, paths, props, generatedId)
                : child.props?.children
        );
    }) as FunctionComponentElement<IMenuItemProps>[];
};

export const MenuContext = createContext<IMenuContextProps>({} as IMenuContextProps);

export const popoverSizeMapping = {
    large: "medium",
    medium: "small",
    small: "small"
} as const;

/**
 * Menu component provides a list of options or actions available to the user within a specific context. Menus are used to offer additional functionality without cluttering the interface, allowing users to access commands, navigate to different sections, or modify settings quickly and efficiently.
 */
const Menu: FC<IMenuProps> = ({
    onChange,
    children,
    loading,
    loadingText,
    swappable,
    setPropsForPopover,
    size = "small",
    position = "bottom-left",
    open = false,
    openSelectedPath = false,
    onOpenChange
}) => {
    const [isOpenState, setIsOpenState] = useState<boolean>(true);
    const [paths, setPaths] = useState<string[]>([]);
    const [openSelectedPathState, setOpenSelectedPathState] = useState<boolean>(openSelectedPath);
    const [relativeRefs, setRelativeRefs] = useState<Record<string, MutableRefObject<ReferenceType | null>>>({});
    const parentRef = useRef(null);
    const { breakpoint } = useContext(GeneUIDesignSystemContext);

    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    useEffect(() => {
        setOpenSelectedPathState(openSelectedPath);
    }, [openSelectedPath]);

    const toggleMenuOpen = useCallback(() => {
        if (isMobileBreakpoint) {
            setIsOpenState(true);
            return;
        }

        setIsOpenState((prev) => {
            if (prev) {
                setPaths([]);
            }
            return !prev;
        });
    }, [isMobileBreakpoint]);

    useClickOutside(
        (e) => {
            const onMenuTargetClick =
                e.target instanceof Node &&
                popoverRef.current.referenceElement?.current instanceof Node &&
                popoverRef.current.referenceElement.current.contains(e.target);

            if (!onMenuTargetClick && !isMobileBreakpoint) {
                setIsOpenState(false);
                setPaths([]);
            }
        },
        [popoverRef.current.floatingElement, ...Object.values(relativeRefs)]
    );

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
                        toggleMenuOpen();
                    }
                },
                onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
                    onKeyDown?.(event);
                    if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        toggleMenuOpen();
                    }
                }
            };
        },
        [toggleMenuOpen]
    );

    // Keep the ref updated with the latest function
    enhanceTriggerPropsRef.current = enhanceTriggerProps;

    const setReferenceProps = useCallback(
        (value: SetStateAction<GenericObject>) => {
            const enhanceFn = enhanceTriggerPropsRef.current;
            if (!enhanceFn) {
                // Fallback if ref is not set yet
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

    useEffect(() => {
        const defaultPath = findPathOfSelected(children);
        if (defaultPath && isOpenState && openSelectedPathState && !paths.length) {
            setPaths(defaultPath);
        }
    }, [isOpenState, children, openSelectedPathState, paths]);

    useEffect(() => {
        if (open !== undefined) setIsOpenState(open);
    }, [open]);

    useEffect(() => {
        if (onOpenChange) {
            onOpenChange(isOpenState);
        }
    }, [isOpenState, onOpenChange]);

    const onChangeHandler = ({ generatedId, isBack, closeMenu, item }: OnchangeHandlerType) => {
        if (swappable || isMobileBreakpoint) setOpenSelectedPathState(false);
        const idToArray = generatedId.split("_");
        const currentPath = isBack ? idToArray.slice(0, -1) : idToArray;
        if (closeMenu) {
            if (swappable || isMobileBreakpoint) setOpenSelectedPathState(openSelectedPath);
            setIsOpenState(false);
            setPaths([]);
        } else {
            setPaths(currentPath);
        }
        if (closeMenu && onChange) {
            onChange({
                ...item,
                title: typeof item?.children === "string" ? item?.children : item?.title
            } as IMenuItemProps);
        }
    };

    const relativeRefsSetter: RelativeRefsSetter = ({ generatedId, popoverFloatingRef }) => {
        if (popoverFloatingRef?.current) {
            setRelativeRefs((prev) => ({
                ...prev,
                [generatedId]: popoverFloatingRef
            }));
        }
    };

    const memoizedMenuContextValue: IMenuContextProps = useMemo(
        () => ({
            onChangeHandler,
            swappable: isMobileBreakpoint || swappable,
            relativeRefsSetter,
            openSelectedPath: openSelectedPathState,
            size: size as SizeType
        }),
        [onChangeHandler, swappable, size, isMobileBreakpoint, relativeRefsSetter, openSelectedPathState]
    );

    const clonedChildren = cloneChildrenRecursive(children, paths);

    const onScrollHandler = () => {
        if (isMobileBreakpoint) return;
        if (isOpenState && !swappable) {
            if (!isActiveElementInside(parentRef, ".menu__item_active")) setPaths([]);
        }
    };

    const onCloseHandler = () => {
        if (isMobileBreakpoint) {
            setIsOpenState(false);
            setPaths([]);
        }
    };

    const hasSwappablePaths = (!!swappable || isMobileBreakpoint) && !!paths.length;

    const content = useMemo(() => {
        if (loading) {
            return (
                <div className="menu__loader">
                    <Loader text={loadingText} textPosition="below" />
                </div>
            );
        }
        if (hasSwappablePaths) {
            return clonedChildren;
        }
        return (
            <Scrollbar className="menu__scrollbar" onScroll={onScrollHandler}>
                <div className="menu__content">{clonedChildren}</div>
            </Scrollbar>
        );
    }, [loading, loadingText, hasSwappablePaths, clonedChildren, onScrollHandler]);

    return (
        <MenuContext.Provider value={memoizedMenuContextValue}>
            <Popover
                setProps={setReferenceProps}
                size={popoverSizeMapping[size]}
                position={position}
                withArrow={false}
                open={isOpenState}
                ref={popoverRef}
                onClose={onCloseHandler}
                margin={MENU_GAP_FROM_TARGET}
            >
                <PopoverBody
                    withPadding={false}
                    className={classNames("menu__body", {
                        [`menu__body_size_${size}`]: !isMobileBreakpoint,
                        menu__body_mobile: isMobileBreakpoint
                    })}
                    withScrollbar={false}
                >
                    <div
                        role="menu"
                        ref={parentRef}
                        className={classNames("menu", { menu_swappable: isMobileBreakpoint || swappable })}
                    >
                        <div className={classNames("menu__list", { menu__list_current: !swappable })}>{content}</div>
                    </div>
                </PopoverBody>
            </Popover>
        </MenuContext.Provider>
    );
};

export { IMenuProps, Menu as default };
