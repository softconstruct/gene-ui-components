/* eslint-disable default-param-last */
import React, {
    Children,
    cloneElement,
    createContext,
    Dispatch,
    FC,
    FunctionComponentElement,
    JSX,
    ReactElement,
    SetStateAction,
    useEffect,
    useMemo,
    useState
} from "react";
import classNames from "classnames";

import { Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";

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

interface IMenuContextProps {
    onChangeHandler: (props: OnchangeHandlerType) => void;
    swappable?: boolean;
}

interface IMenuProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    children: ReactElement | ReactElement[];
    isLoading?: boolean;
    onChange: (paths: string[], id: string | number) => void;
    loadingText?: string;
    swappable?: boolean;
    defaultOpen?: boolean;
    setPropsForPopover: Dispatch<SetStateAction<Record<string, unknown>>>;
    isMenuOpen?: boolean;
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
    defaultOpen = false,
    isMenuOpen
}) => {
    // const [isMenuOpenState, setIsMenuOpenState] = useState(false);
    const [paths, setPaths] = useState<string[]>([]);

    useEffect(() => {
        // setIsMenuOpenState(!!isMenuOpen);
    }, [isMenuOpen]);

    useEffect(() => {
        // const defaultPath = findPathOfDefaultOpened(children);
        // if (defaultPath) {
        // setPaths(["4", "4"]);
        // }
        // console.log(isMenuOpenState);
    }, []);

    const onChangeHandler = ({ generateId, id, isBack }: OnchangeHandlerType) => {
        const idToArray = generateId.split("_");
        const currentPath = isBack ? idToArray.slice(0, -1) : idToArray;

        setPaths(currentPath);
        onChange(currentPath, id);
    };

    const memoizedMenuContextValue: IMenuContextProps = useMemo(
        () => ({
            onChangeHandler,
            swappable
        }),
        [onChangeHandler, swappable]
    );

    const clonedChildren = cloneChildrenRecursive(children, paths);

    const popoverCloseHandler = () => {
        // console.log("close");
    };

    return (
        <MenuContext.Provider value={memoizedMenuContextValue}>
            <Popover
                setProps={setPropsForPopover}
                size={swappable ? "mobile" : "small"}
                disableReposition
                position="bottom-left"
                onClose={popoverCloseHandler}
                defaultOpen={defaultOpen}
                withArrow={false}
                // open={isMenuOpenState}
                open
            >
                <PopoverBody withPadding={false}>
                    <div className={classNames("menu menu_isSwappable", { menu_swappable: swappable }, className)}>
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
