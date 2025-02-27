import React, {
    Children,
    cloneElement,
    createContext,
    Dispatch,
    FC,
    FunctionComponentElement,
    JSX,
    ReactElement,
    ReactNode,
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

// import { IconProps } from "@geneui/icons";
import Loader from "../../atoms/Loader";
import { IMenuItemProps } from "./MenuItem";

const findPathOfDefaultOpened = (menu: ReactNode | ReactElement[], path: number[] = []): number[] | null => {
    if (!Array.isArray(menu)) return null;
    for (let i = 0; i < menu?.length; i++) {
        const item = menu[i];

        if (item.props?.defaultOpened) {
            return [...path, i];
        }

        if (item.props.children && Array.isArray(item.props.children)) {
            const childPath = findPathOfDefaultOpened(item.props.children, [...path, i]);
            if (childPath) {
                return childPath;
            }
        }
    }

    return null;
};

export interface OnchangeHandlerType {
    index: number;
    id: number | string;
    isBack?: boolean;
    routeAction?: boolean;
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
    onChange: (paths: number[], id: string | number) => void;
    loadingText?: string;
    swappable?: boolean;
    defaultOpen?: boolean;
    setPropsForPopover: Dispatch<SetStateAction<Record<string, unknown>>>;
}

// interface IMenuData {
//     title: string;
//     selected?: boolean;
//     id: number | string;
//     value: string;
//     IconBefore: FC<IconProps>;
//     IconAfter: FC<IconProps>;
//     danger?: boolean;
//     defaultOpened?: never;
//     isLoading?: boolean;
//     disabled?: boolean;
//     children: ReactNode | IMenuData[];
// }

const cloneChildrenRecursive = (
    children: JSX.Element | JSX.Element[],
    paths: number[],
    props = {},
    regardingPaths: number[] = [],
    isLoading = false,
    loadingText = ""
): FunctionComponentElement<IMenuItemProps>[] | FunctionComponentElement<HTMLElement> => {
    if (isLoading) {
        return (
            <div className="menu__loader">
                <Loader text={loadingText} textPosition="below" />
            </div>
        );
    }
    // console.log(emptyText, 22222);
    // if (Array.isArray(children) && !children.length) {
    //     return (
    //         <div className="menu__empty">
    //             <h1>{emptyText}</h1>
    //         </div>
    //     );
    // }

    return Children.map(children, (child, i) => {
        const isActive = paths?.length && i === paths[0];

        const childProps =
            isActive && child.props?.children
                ? {
                      ...props,
                      activeElement: paths.length === 1,
                      children: cloneChildrenRecursive(
                          child.props?.children,
                          paths.slice(1),
                          props,
                          [...regardingPaths, i],
                          child.props.isLoading,
                          child.props.loadingText,
                          child.props.emptyText
                      )
                  }
                : props;

        // Return the cloned element with new props
        return cloneElement(child, {
            ...child.props,
            ...childProps,
            regardingPaths
        });
    });
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
    defaultOpen = false
}) => {
    const [path, setPath] = useState<number[]>([]);

    useEffect(() => {
        const defaultPath = findPathOfDefaultOpened(children);
        if (defaultPath) {
            setPath(defaultPath);
        }
    }, []);

    const onChangeHandler = ({ index, id, isBack, routeAction }: OnchangeHandlerType) => {
        onChange(path, id);
        if (routeAction) {
            if (isBack) {
                const newSteps = path.slice(0, -1);
                onChange(newSteps, id);
                setPath(newSteps);
            } else {
                setPath((prev) => [...prev, index]);
            }
        }
        if (!isBack) {
            onChange([...path, index], id);
        }
    };

    const memoizedMenuContextValue: IMenuContextProps = useMemo(
        () => ({
            onChangeHandler,
            swappable
        }),
        [onChangeHandler, swappable]
    );

    const clonedChildren = cloneChildrenRecursive(children, path);

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
