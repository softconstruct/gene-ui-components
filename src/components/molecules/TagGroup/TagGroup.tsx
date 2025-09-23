import React, { Children, cloneElement, FC, isValidElement, ReactNode, useMemo, useState } from "react";
import classNames from "classnames";

// Icons
import { ChevronDown, ChevronUp } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import type { ITagProps } from "@components/molecules/Tag/Tag";

// Hooks
import useWindowSize from "@hooks/useWindowSize";

// Styles
import "./TagGroup.scss";

// Custom hooks
import { useTagVisibility } from "./useTagVisibility";

interface ITagGroupProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Size for all `<Tag/>` components within the `<TagGroup/>`.<br/>
     * Possible values: `medium | small`;
     */
    size?: ITagProps["size"];
    /**
     * Provide `<Tag/>` components to be rendered in the `<TagGroup/>`
     */
    children: ReactNode;
    /**
     * A function to dynamically generate the toggle button's text.
     * It receives the `expanded` state and returns the string to display.
     */
    renderToggleText?: (expanded: boolean) => string;
}

/**
 * Tag Group displays a list of selected options, offering a clear and organized way to present chosen items.
 */
const TagGroup: FC<ITagGroupProps> = ({ className, children, size = "medium", renderToggleText }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const childrenArray = useMemo(() => Children.toArray(children), [children]);
    const { width } = useWindowSize();

    const { tagVisibility, containerRef } = useTagVisibility({
        childrenArray,
        isExpanded,
        width
    });

    const renderChildren = (childrenToRender: ReactNode[]) => {
        return childrenToRender.map((child) =>
            isValidElement(child) ? cloneElement(child, { ...child.props, size }) : child
        );
    };

    const handleToggleExpanded = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
    };

    return (
        <div className={classNames("tagGroup", className)}>
            <div className={classNames("tagGroup__container", { tagGroup__container_expanded: isExpanded })}>
                <div
                    ref={containerRef}
                    className={classNames("tagGroup__tags", {
                        [`tagGroup__tags_size_${size}`]: !isExpanded
                    })}
                >
                    {renderChildren(isExpanded ? childrenArray : childrenArray.slice(0, tagVisibility.visibleCount))}
                </div>
                {tagVisibility.shouldShowToggleButton && (
                    <Button
                        className="tagGroup__showButton"
                        appearance="secondary"
                        size={size}
                        layout="text"
                        iconPosition="after"
                        Icon={isExpanded ? ChevronUp : ChevronDown}
                        onClick={handleToggleExpanded}
                    >
                        {renderToggleText?.(isExpanded) || ""}
                    </Button>
                )}
            </div>
        </div>
    );
};

export { ITagGroupProps, TagGroup as default };
