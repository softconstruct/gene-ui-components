import React, { createContext, FC, ReactNode, useState, cloneElement, useRef, useEffect } from "react";
import classNames from "classnames";
// Styles
import "./TagGroup.scss";
import { ChevronDown, ChevronUp } from "@geneui/icons";
import { ITagProps } from "../Tag";
import { Button } from "../../../index";

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
    // todo: refactor functional part if needed
    const [isExpanded, setIsExpanded] = useState(false);
    const moreTagsQuantity = 12;
    const toggleText = () => setIsExpanded((prev) => !prev);

    const [tags, setTags] = useState(React.Children.toArray(children));

    // const divRef = useRef<HTMLDivElement | null>(null);
    const [needTruncate, setNeedTruncate] = useState(false);

    const [tagHeight, setTagHeight] = useState(0);
    // const tagSpacing = 8;
    // const [hasOverflow, setHasOverflow] = useState(false);

    const parentRef = useRef(null);

    useEffect(() => {
        if (parentRef.current && tags.length > 0) {
            const firstTag = parentRef.current?.firstChild as HTMLElement;
            if (firstTag) {
                setTagHeight(firstTag.getBoundingClientRect().height);
            }
        }
    }, [tags]);

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
                onClose: () => removeTag(index) // Pass removeTag to Tag
            });
        }
        return child;
    });

    useEffect(() => {
        if (!parentRef.current) return;
        const { clientHeight } = parentRef.current;
        console.log("aaa:::", clientHeight, tagHeight);

        setNeedTruncate(clientHeight > tagHeight);
    }, [parentRef.current, parentRef]);

    console.log("needTruncate::: ", needTruncate);

    return (
        <div className={classNames(`tagGroup ${isExpanded ? "tagGroup_extended" : ""}`, className)}>
            <div className="tagGroup__container">
                <div
                    className={classNames("tagGroup__tags", { tagGroup__tags_full: isExpanded })}
                    ref={parentRef}
                    // style={{ height: !isExpanded ? `${tagHeight}px` : '100%' }}
                >
                    {clonedChildren}
                    {/* <Tag text="Tag" onClose={removeTag} /> */}
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
                    text={isExpanded ? "Show less" : `Show ${moreTagsQuantity} more`}
                    onClick={toggleText}
                />
            )}
        </div>
    );
};

export { ITagGroupProps, TagGroup as default };
