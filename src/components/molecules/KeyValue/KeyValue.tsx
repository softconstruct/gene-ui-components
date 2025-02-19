import React, { createContext, FC, ReactElement, useMemo } from "react";
import classNames from "classnames";

// Styles
import "./KeyValue.scss";

// Components
import { IKeyProps } from "./Key";
import { IValueProps } from "./Value";

interface IKeyValueContextProps {
    /**
     * Size
     * Possible values: `medium | large`;
     */
    size?: "medium" | "large";
}

interface IKeyValueProps extends IKeyValueContextProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Key - Value direction <br/>
     * Possible values: `vertical | horizontal`
     */
    direction?: "vertical" | "horizontal";
    /**
     * Adds space between key and value in horizontal direction.
     */
    spaceBetween?: boolean;
    /**
     * Children - value direction <br/>
     * Possible values: `Key | Value`
     */
    children: [ReactElement<IKeyProps>, ReactElement<IValueProps>];
}

const KeyValueContext = createContext<IKeyValueContextProps>({});

/**
 * Key Value components present data in a key-value format, typically used to display information obtained from other components. A common use case is setting up a Key Value component to show detailed information from a selected table row.
 */
const KeyValue: FC<IKeyValueProps> = ({
    className,
    direction = "vertical",
    size = "medium",
    children,
    spaceBetween = false
}) => {
    const memoizedKeyValueContextValue = useMemo(
        () => ({
            size
        }),
        [size]
    );

    return (
        <KeyValueContext.Provider value={memoizedKeyValueContextValue as IKeyValueContextProps}>
            <div
                className={classNames(`keyValue keyValue_direction_${direction} keyValue_size_${size}`, className, {
                    keyValue_spaceBetween: spaceBetween
                })}
            >
                {children}
            </div>
        </KeyValueContext.Provider>
    );
};

export { IKeyValueProps, KeyValueContext, KeyValue as default };
