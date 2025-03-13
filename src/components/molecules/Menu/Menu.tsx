/* eslint-disable default-param-last */
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
    RefObject,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import classNames from "classnames";

import { Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";

import { useClickOutside } from "@hooks/index";

// Styles
import "./Menu.scss";

import Loader from "../../atoms/Loader";
import { IMenuItemProps } from "./MenuItem";

// const findPathOfDefaultOpened = (menu: ReactNode | ReactElement[], path: number[] = []): number[] | null => {
//     if (!Array.isArray(menu)) return null;
//     for (let i = 0; i < menu?.length; i++) {
//         const item = menu[i];

//         if (item.props?.defaultOpened) {
//             return [...path, i];
//         }

//         if (item.props.children && Array.isArray(item.props.children)) {
//             const childPath = findPathOfDefaultOpened(item.props.children, [...path, i]);
//             if (childPath) {
//                 return childPath;
//             }
//         }
//     }

//     return null;
// };

export interface OnchangeHandlerType {
    generateId: string;
    id: number | string;
    isBack: boolean;
}

type RelativeRefsSetter = (props: { generateId: string; popoverBodyRef: MutableRefObject<HTMLElement | null> }) => void;

interface IMenuContextProps {
    onChangeHandler: (props: OnchangeHandlerType) => void;
    swappable?: boolean;
    relativeRefsSetter: RelativeRefsSetter;
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
    /**
     * Controls the open state of the menu. By default, the Menu controls automatically.
     */
    isMenuOpen?: boolean;
    /**
     * A callback function that gets triggered when a click occurs outside of the menu, typically used for closing the menu.
     */
    clickOutside?: () => void;
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

const Menu: FC<IMenuProps> = ({
    className,
    onChange,
    children,
    isLoading,
    loadingText,
    swappable,
    setPropsForPopover,
    isMenuOpen,
    clickOutside
}) => {
    // const [isMenuOpenState, setIsMenuOpenState] = useState(false);
    const [paths, setPaths] = useState<string[]>([]);
    const [relativeRefs, setRelativeRefs] = useState<Record<string, RefObject<HTMLElement>>>({});
    const isMobile = true;
    const popoverRef = useRef(null);

    console.log("🚀 ~ popoverBodyRef:", popoverRef);

    useClickOutside(() => {
        setPaths([]);
        clickOutside?.();
    }, [...Object.values(relativeRefs)]);

    useEffect(() => {
        // if (isMenuOpen !== "undefined") setIsMenuOpenState(!!isMenuOpen);
    }, [isMenuOpen]);

    const onChangeHandler = ({ generateId, id, isBack }: OnchangeHandlerType) => {
        const idToArray = generateId.split("_");
        const currentPath = isBack ? idToArray.slice(0, -1) : idToArray;
        setPaths(currentPath);
        onChange(currentPath, id);
    };

    const relativeRefsSetter: RelativeRefsSetter = ({ generateId, popoverBodyRef }) => {
        if (popoverBodyRef.current) {
            setRelativeRefs((prev) => ({
                ...prev,
                [generateId]: popoverBodyRef
            }));
        }
    };

    const memoizedMenuContextValue: IMenuContextProps = useMemo(
        () => ({
            onChangeHandler,
            swappable,
            relativeRefsSetter
        }),
        [onChangeHandler, swappable]
    );

    const clonedChildren = cloneChildrenRecursive(children, paths);

    return (
        <MenuContext.Provider value={memoizedMenuContextValue}>
            <Popover
                setProps={setPropsForPopover}
                size={isMobile ? "mobile" : "small"}
                disableReposition
                position="bottom-left"
                withArrow={false}
                // open={isMenuOpenState}
                open
                ref={popoverRef}
            >
                <PopoverBody withPadding={false}>
                    <div className={classNames("menu ", { menu_swappable: swappable }, className)}>
                        <div className="menu__list menu__list_current">
                            <Scrollbar className="menu__content">
                                {isLoading ? (
                                    <div className="menu__loader">
                                        <Loader text={loadingText} textPosition="below" />
                                    </div>
                                ) : (
                                    clonedChildren
                                )}
                            </Scrollbar>
                        </div>
                    </div>
                </PopoverBody>
            </Popover>
        </MenuContext.Provider>
    );
};

export { IMenuProps, Menu as default };
