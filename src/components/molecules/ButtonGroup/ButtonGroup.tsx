import React, { FC, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";

import { HorizontalDots } from "@geneui/icons";

import Button from "@components/atoms/Button";
import { Popover, PopoverBody } from "@components/atoms/Popover";

// Styles
import "./ButtonGroup.scss";

interface IButtonGroupProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill ButtonGroup component props interface

    children: ReactNode;

    direction: "horizontal" | "vertical";
}

/**
 * A button group clusters multiple buttons together. Use button groups in toolbars, forms, and modals, etc.
 */
const ButtonGroup: FC<IButtonGroupProps> = ({ className, children, direction }) => {
    const [SplitChildren, setSplitChildren] = useState(children);
    const [propsForContent, setPropsForContent] = useState({});
    const [otherChildProps, setOtherChildProps] = useState<React.JSX.Element["props"][]>([]);
    const isShowMenuButton = Array.isArray(children) && children.length > 3;

    useEffect(() => {
        if (isShowMenuButton && Array.isArray(SplitChildren)) {
            const child = SplitChildren.slice(0, 3);
            setSplitChildren(child);

            const otherChild = SplitChildren.slice(3, children.length) as React.JSX.Element[];
            const childProps = otherChild.map((el) => el.props);

            setOtherChildProps(childProps);
        }
    }, [isShowMenuButton]);

    return (
        <>
            <div className={classNames(`buttonGroup buttonGroup_${direction}`, className)}>
                {SplitChildren}
                {isShowMenuButton && (
                    <>
                        <Button
                            onClick={() => {}}
                            Icon={HorizontalDots}
                            displayType="text"
                            appearance="secondary"
                            {...propsForContent}
                        />
                        <Popover setProps={setPropsForContent} title="" position="bottom-left" padding={5}>
                            <PopoverBody>
                                {otherChildProps.map((el) => (
                                    <Button {...el} />
                                ))}
                            </PopoverBody>
                        </Popover>
                    </>
                )}
            </div>
        </>
    );
};

export { IButtonGroupProps, ButtonGroup as default };
