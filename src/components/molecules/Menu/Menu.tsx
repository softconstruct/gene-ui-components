import React, { Children, cloneElement, FC, ReactElement, useEffect, useState } from "react";
import classNames from "classnames";
// Styles
import "./Menu.scss";

const stepBackArray = (arr) => {
    return arr.length === 1 ? [] : arr.splice(-1, 1);
};

const findPathOfDefaultOpened = (menu, path = []) => {
    for (let i = 0; i < menu?.length; i++) {
        const item = menu[i];

        if (item.props.defaultOpened) {
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

interface IMenuProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    children: ReactElement;
}

/**
 * Menu component provides a list of options or actions available to the user within a specific context. Menus are used to offer additional functionality without cluttering the interface, allowing users to access commands, navigate to different sections, or modify settings quickly and efficiently.
 */
let CHNGED_PATHS = [];

const cloneChildrenRecursive = (children, controlHandler, paths, props, regardingPaths = []) => {
    return Children.map(children, (child, i) => {
        const isActive = paths?.length && i === paths[0];
        // If it's active, process its children with the remaining paths

        if (child.props.defaultOpened) {
            CHNGED_PATHS = [...regardingPaths, i];
        }
        const childProps =
            isActive && child.props?.children
                ? {
                      ...props,
                      activeElement: paths.length === 1,
                      // activeElement: true,
                      children: cloneChildrenRecursive(child.props?.children, controlHandler, paths.slice(1), props, [
                          ...regardingPaths,
                          i
                      ])
                  }
                : props;

        // Return the cloned element with new props
        return cloneElement(child, {
            ...child.props,
            ...childProps,
            controlHandler,
            regardingPaths
            // index: i
        });
    });
};

const Menu: FC<IMenuProps> = ({ className, control, children }) => {
    const [path, setPath] = useState([]);

    useEffect(() => {
        const defaultPath = findPathOfDefaultOpened(children);
        if (defaultPath) {
            setPath(defaultPath);
        }
    }, []);

    const controlHandler = (index, isBack: boolean, routeAction: boolean) => {
        if (routeAction) {
            if (isBack) {
                const newSteps = stepBackArray(path);
                control(newSteps);
                setPath(newSteps);
            } else {
                setPath((prev) => [...prev, index]);
            }
        }
        if (!isBack) {
            control([...path, index]);
        }
    };

    const clonedChildren = cloneChildrenRecursive(children, controlHandler, path);

    useEffect(() => {
        setPath(CHNGED_PATHS);
    }, []);

    return (
        <>
            <div className={classNames("menu menu_isMobile menu_isSwappable", className)}>
                <div className="menu__list menu__list_current">
                    <div className="menu__content">{clonedChildren}</div>
                </div>
            </div>
            {/* <div className={classNames("menu menu_isMobile menu_isSwappable", className)}> */}
            {/*    For web menu // menu_isWeb // menu_size_large // menu_size_medium // menu_size_small For mobile menu // */}
            {/*    menu_isMobile Add class // menu__list_swipeRight // menu__list_swipeLeft // for menu__item */}
            {/*    <div className="menu__list menu__list_current"> */}
            {/*        <button type="button" className="menu__header"> */}
            {/*            <ChevronLeft className="menu__icon" size={16} /> */}
            {/*            <p className="menu__headerTitle">Inner Page Title</p> */}
            {/*        </button> */}
            {/*        <div className="menu__content"> */}
            {/*            <button type="button" className="menu__item"> */}
            {/*                <span className="menu__cell"> */}
            {/*                    <ChevronRight className="menu__icon" size={20} /> */}
            {/*                    <span className="menu__rowTitle">Menu Item</span> */}
            {/*                </span> */}
            {/*                <ChevronRight className="menu__rowIcon" size={16} /> */}
            {/*            </button> */}
            {/*            <button type="button" className="menu__item"> */}
            {/*                <span className="menu__cell"> */}
            {/*                    <span className="menu__rowTitle">Menu Item</span> */}
            {/*                </span> */}
            {/*                <ChevronRight className="menu__rowIcon" size={16} /> */}
            {/*            </button> */}
            {/*            <button type="button" className="menu__item"> */}
            {/*                <span className="menu__cell"> */}
            {/*                    <span className="menu__rowTitle">Menu Item</span> */}
            {/*                </span> */}
            {/*                <ChevronRight className="menu__rowIcon" size={16} /> */}
            {/*            </button> */}
            {/*            <div className="menu__list menu__list_notCurrent menu__list_swipeRight menu__list_current"> */}
            {/*                <button type="button" className="menu__header"> */}
            {/*                    <ChevronLeft className="menu__icon" size={16} /> */}
            {/*                    <p className="menu__headerTitle">Inner Page Title</p> */}
            {/*                </button> */}
            {/*                <div className="menu__content"> */}
            {/*                    <button type="button" className="menu__item"> */}
            {/*                        <span className="menu__cell"> */}
            {/*                            <ChevronRight className="menu__icon" size={20} /> */}
            {/*                            <span className="menu__rowTitle">Menu Item</span> */}
            {/*                        </span> */}
            {/*                        <ChevronRight className="menu__rowIcon" size={16} /> */}
            {/*                    </button> */}
            {/*                    <button type="button" className="menu__item"> */}
            {/*                        <span className="menu__cell"> */}
            {/*                            <span className="menu__rowTitle">Menu Item</span> */}
            {/*                        </span> */}
            {/*                        <ChevronRight className="menu__rowIcon" size={16} /> */}
            {/*                    </button> */}
            {/*                    <button type="button" className="menu__item"> */}
            {/*                        <span className="menu__cell"> */}
            {/*                            <span className="menu__rowTitle">Menu Item</span> */}
            {/*                        </span> */}
            {/*                        <ChevronRight className="menu__rowIcon" size={16} /> */}
            {/*                    </button> */}
            {/*                </div> */}
            {/*            </div> */}
            {/*        </div> */}
            {/*    </div> */}
            {/* </div> */}
        </>
    );
};

export { IMenuProps, Menu as default };
