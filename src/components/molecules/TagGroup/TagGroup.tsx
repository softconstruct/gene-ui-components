import React, { cloneElement, createContext, FC, ReactNode, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { ChevronDown, ChevronUp } from "@geneui/icons";

import useWindowSize from "@hooks/useWindowSize";

// Styles
import "./TagGroup.scss";

import { Button } from "../../../index";
import { ITagProps } from "../Tag";

interface ITagGroupProps {
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
export const TagGroupContext = createContext<ITagGroupProps>;

const TagGroup: FC<ITagGroupProps> = ({ className, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleText = () => setIsExpanded((prev) => !prev);

    const [tags, setTags] = useState(React.Children.toArray(children));
    const [needTruncate, setNeedTruncate] = useState(false);

    const [tagHeight, setTagHeight] = useState(0);

    const parentRef = useRef<HTMLDivElement | null>(null);
    const { width } = useWindowSize();

    useEffect(() => {
        if (parentRef.current && tags.length > 0) {
            const firstTag = parentRef.current?.firstChild as HTMLElement;
            if (firstTag) {
                setTagHeight(firstTag.getBoundingClientRect().height);
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
        <div className={classNames("tagGroup", className)}>
            <div className={classNames("tagGroup__container", { tagGroup__container_expanded: isExpanded })}>
                <div className={classNames("tagGroup__tags", { tagGroup__tags_expanded: isExpanded })} ref={parentRef}>
                    {clonedChildren}
                </div>
            </div>
            {needTruncate && (
                <Button
                    className="tagGroup__showButton"
                    appearance="secondary"
                    size="small"
                    displayType="text"
                    iconAfter
                    Icon={isExpanded ? ChevronUp : ChevronDown}
                    onClick={toggleText}
                >
                    {isExpanded ? "Show less" : "Show more"}
                </Button>
            )}
        </div>
    );
};

export { ITagGroupProps, TagGroup as default };
