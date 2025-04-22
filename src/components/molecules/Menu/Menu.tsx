import React, {
    Children,
    cloneElement,
    createContext,
    Dispatch,
    FC,
    FunctionComponentElement,
    JSX,
    MutableRefObject,
    ReactElement,
    SetStateAction,
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
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Hooks
import { useClickOutside } from "@hooks/index";

// Styles
import "./Menu.scss";

// Helpers
import { isActiveElementInside } from "./helper";
// Types
import { IMenuItemProps } from "./MenuItem";

export interface OnchangeHandlerType {
    generateId: string;
    id: number | string;
    isBack: boolean;
    closeMenu: boolean;
}

type RelativeRefsSetter = (props: {
    generateId: string;
    popoverFloatingRef: MutableRefObject<ReferenceType | null> | undefined;
}) => void;

type SizeType = "large" | "medium" | "small";

interface IMenuContextProps {
    onChangeHandler: (props: OnchangeHandlerType) => void;
    swappable?: boolean;
    relativeRefsSetter: RelativeRefsSetter;
    size: SizeType;
}

interface IMenuProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The child elements of the menu. These should be <MenuItem/> components.
     */
    children: ReactElement | ReactElement[];
    /**
     *  Indicates whether the menu is in a loading state. If true, a loading indicator is displayed instead of the menu items.
     */
    isLoading?: boolean;
    /**
     * Callback function triggered when a menu item is selected or navigated.
     *
     * paths: An array of strings representing the hierarchical path of the selected item.
     * id: The unique identifier of the selected menu item.
     */
    onChange: (paths: string[], id: string | number) => void;
    /**
     * The text to display alongside the loader when isLoading is true.
     */
    loadingText?: string;
    /**
     *  If true, enables swapping behavior, modifying the appearance or behavior of the menu.
     */
    swappable?: boolean;
    /**
     * A function for setting additional props for the Popover component that wraps the menu.
     */
    setPropsForPopover: Dispatch<SetStateAction<Record<string, unknown>>>;
    size?: SizeType;
}

const cloneChildrenRecursive = (
    children: JSX.Element | JSX.Element[],
    paths: string[],
    props = {},
    isLoading = false,
    loadingText = "",
    pathID = ""
): FunctionComponentElement<IMenuItemProps>[] | ReactElement => {
    if (isLoading) {
        return (
            <div className="menu__loader">
                <Loader text={loadingText} textPosition="below" />
            </div>
        );
    }
    return Children.map(children, (child, i) => {
        const generateId = pathID ? `${pathID}_${i}` : `${i}`;

        return cloneElement(
            child,
            {
                ...props,
                generateId,
                paths
            },
            Array.isArray(child.props?.children)
                ? cloneChildrenRecursive(
                      child.props?.children,
                      paths,
                      props,
                      child.props.isLoading,
                      child.props.loadingText,
                      generateId
                  )
                : child.props?.children
        );
    }) as FunctionComponentElement<IMenuItemProps>[];
};

/**
 * Menu component provides a list of options or actions available to the user within a specific context. Menus are used to offer additional functionality without cluttering the interface, allowing users to access commands, navigate to different sections, or modify settings quickly and efficiently.
 */

export const MenuContext = createContext<IMenuContextProps>({} as IMenuContextProps);

export const popoverSizeMapping = {
    large: "medium",
    medium: "small",
    small: "small"
} as const;

const Menu: FC<IMenuProps> = ({
    className,
    onChange,
    children,
    isLoading,
    loadingText,
    swappable,
    setPropsForPopover,
    size = "medium"
}) => {
    const [isOpenState, setIsOpenState] = useState<boolean>(false);
    const [paths, setPaths] = useState<string[]>([]);
    const [relativeRefs, setRelativeRefs] = useState<Record<string, MutableRefObject<ReferenceType | null>>>({});
    const parentRef = useRef(null);
    const { breakpoint } = useContext(GeneUIDesignSystemContext);

    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    useClickOutside(
        (e) => {
            const onMenuTargetClick =
                e.target instanceof Node &&
                popoverRef.current.referenceElement?.current instanceof Node &&
                popoverRef.current.referenceElement.current.contains(e.target);

            if (onMenuTargetClick) {
                if (isMobileBreakpoint) {
                    setIsOpenState(true);
                } else {
                    setIsOpenState((open) => !open);
                    if (isOpenState) {
                        setPaths([]);
                    }
                }
            } else if (!isMobileBreakpoint) {
                setIsOpenState(false);
                setPaths([]);
            }
        },
        [popoverRef.current.floatingElement, ...Object.values(relativeRefs)]
    );

    useEffect(() => {
        if (paths.length) {
            setIsOpenState(true);
        }
    }, [paths]);

    const onChangeHandler = ({ generateId, id, isBack, closeMenu }: OnchangeHandlerType) => {
        const idToArray = generateId.split("_");
        const currentPath = isBack ? idToArray.slice(0, -1) : idToArray;
        if (closeMenu) {
            setIsOpenState(false);
            setPaths([]);
        } else {
            setPaths(currentPath);
        }

        onChange(currentPath, id);
    };

    const relativeRefsSetter: RelativeRefsSetter = ({ generateId, popoverFloatingRef }) => {
        if (popoverFloatingRef?.current) {
            setRelativeRefs((prev) => ({
                ...prev,
                [generateId]: popoverFloatingRef
            }));
        }
    };

    const memoizedMenuContextValue: IMenuContextProps = useMemo(
        () => ({
            onChangeHandler,
            swappable: isMobileBreakpoint || swappable,
            relativeRefsSetter,
            size
        }),
        [onChangeHandler, swappable, size]
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

    const hasSwappablePaths = !!swappable && !!paths.length;

    const content = useMemo(() => {
        if (isLoading) {
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
            <Scrollbar className="menu__content" onScroll={onScrollHandler}>
                {clonedChildren}
            </Scrollbar>
        );
    }, [isLoading, loadingText, hasSwappablePaths, clonedChildren, onScrollHandler]);

    return (
        <MenuContext.Provider value={memoizedMenuContextValue}>
            <Popover
                setProps={setPropsForPopover}
                size={popoverSizeMapping[size]}
                disableReposition
                position="bottom-left"
                withArrow={false}
                open={isOpenState}
                ref={popoverRef}
                onClose={onCloseHandler}
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
                        className={classNames("menu ", { menu_swappable: isMobileBreakpoint || swappable }, className)}
                    >
                        <div className={classNames("menu__list", { menu__list_current: !swappable })}>{content}</div>
                    </div>
                </PopoverBody>
            </Popover>
        </MenuContext.Provider>
    );
};

export { IMenuProps, Menu as default };
