import React, { cloneElement, createContext, FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

import { ChevronDown, ChevronUp } from "@geneui/icons";

import useWindowSize from "@hooks/useWindowSize";

// Styles
import "./TagGroup.scss";

import { Button } from "../../../index";
import { ITagProps } from "../Tag";

interface ITagGroupContextProps {
    /**
     * Size
     * Possible values: `medium | small`;
     */
    size?: "medium" | "small";
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
}

/**
 * Tag Group displays a list of selected options, offering a clear and organized way to present chosen items.
 */
export const TagGroupContext = createContext<ITagGroupContextProps>({});

const TagGroup: FC<ITagGroupProps> = ({ className, children, size = "medium" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleText = () => setIsExpanded((prev) => !prev);

    const [tags, setTags] = useState(React.Children.toArray(children));
    const [needTruncate, setNeedTruncate] = useState(false);

    const [tagHeight, setTagHeight] = useState(0);

    const parentRef = useRef<HTMLDivElement | null>(null);
    const { width } = useWindowSize();

    const memoizedTagGroupContextValue = useMemo(
        () => ({
            size
        }),
        [size]
    );

    useEffect(() => {
        if (parentRef.current && tags.length > 0) {
            const firstTag = parentRef.current?.firstChild as HTMLElement;
            if (firstTag && typeof firstTag.getBoundingClientRect === "function") {
                setTagHeight(firstTag.getBoundingClientRect().height + 4);
            }
        }
    }, [tags, parentRef.current]);

    const removeTag = (index: number) => {
        setTags((prevTags) => {
            const newTags = [...prevTags];
            newTags.splice(index, 1);
            return newTags;
        });
    };

    const clonedChildren = tags.map((child, index) => {
        if (React.isValidElement<ITagProps>(child)) {
            return cloneElement(child, {
                ...child.props,
                size,
                onClose: () => removeTag(index)
            });
        }
        return child;
    });

    useEffect(() => {
        if (!parentRef.current) return;
        const { scrollHeight } = parentRef.current;

        setNeedTruncate(scrollHeight > tagHeight);
    }, [parentRef.current, tagHeight, tags, width]);

    return (
        <TagGroupContext.Provider value={memoizedTagGroupContextValue}>
            <div className={classNames("tagGroup", className)}>
                <div className={classNames("tagGroup__container", { tagGroup__container_expanded: isExpanded })}>
                    <div
                        className={classNames("tagGroup__tags", { tagGroup__tags_expanded: isExpanded })}
                        ref={parentRef}
                        style={{ height: !isExpanded ? `${tagHeight}px` : "auto" }}
                    >
                        {clonedChildren}
                    </div>
                </div>
                {needTruncate && (
                    <Button
                        className="tagGroup__showButton"
                        appearance="secondary"
                        size={size}
                        displayType="text"
                        iconAfter
                        Icon={isExpanded ? ChevronUp : ChevronDown}
                        onClick={toggleText}
                    >
                        {isExpanded ? "Show less" : "Show more"}
                    </Button>
                )}
            </div>
        </TagGroupContext.Provider>
    );
};

export { ITagGroupProps, TagGroup as default };
