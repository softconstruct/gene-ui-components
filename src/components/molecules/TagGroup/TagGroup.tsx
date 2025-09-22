import React, { Children, cloneElement, createContext, FC, isValidElement, ReactNode, useMemo, useState } from "react";
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

interface ITagGroupContextProps {
    /**
     * Size
     * Possible values: `medium | small`;
     */
    size?: ITagProps["size"];
}

interface ITagGroupProps extends ITagGroupContextProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Provide `<Tag/>` components to be rendered in the `<TagGroup/>`
     */
    children: ReactNode;
    /**
     * Text to display on the toggle button when collapsed.
     * If not provided, only the icon will be shown
     */
    showMoreText?: string;
    /**
     * Text to display on the toggle button when expanded.
     * If not provided, only the icon will be shown
     */
    showLessText?: string;
}

/**
 * Tag Group displays a list of selected options, offering a clear and organized way to present chosen items.
 */
export const TagGroupContext = createContext<ITagGroupContextProps>({});

const TagGroup: FC<ITagGroupProps> = ({ className, children, size = "medium", showMoreText, showLessText }) => {
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
            isValidElement(child) ? cloneElement(child, { ...child.props, size: size as ITagProps["size"] }) : child
        );
    };

    const handleToggleExpanded = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
    };

    const contextValue = useMemo(() => ({ size }), [size]);

    return (
        <TagGroupContext.Provider value={contextValue}>
            <div className={classNames("tagGroup", className)}>
                <div className={classNames("tagGroup__container", { tagGroup__container_expanded: isExpanded })}>
                    <div
                        ref={containerRef}
                        className={classNames("tagGroup__tags", {
                            [`tagGroup__tags_size_${size}`]: !isExpanded
                        })}
                    >
                        {renderChildren(
                            isExpanded ? childrenArray : childrenArray.slice(0, tagVisibility.visibleCount)
                        )}
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
                            {isExpanded ? showLessText : showMoreText}
                        </Button>
                    )}
                </div>
            </div>
        </TagGroupContext.Provider>
    );
};

export { ITagGroupProps, ITagGroupContextProps, TagGroup as default };
