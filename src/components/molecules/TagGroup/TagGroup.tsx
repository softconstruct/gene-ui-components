import React, { cloneElement, createContext, FC, JSX, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

import { ChevronDown, ChevronUp } from "@geneui/icons";

import useWindowSize from "@hooks/useWindowSize";

// Styles
import "./TagGroup.scss";

import { Button } from "../../../index";

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

const everyPixel = 7.18;
const smallButtonSize = 24;
const mediumButtonSize = 32;
const elementPadding = 8;
const iconSize = 20;
const elementGap = 8;
const preParentPadding = 4;
const innerGap = 16;

const TagGroup: FC<ITagGroupProps> = ({ className, children, size = "medium" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleText = () => setIsExpanded((prev) => !prev);
    const parentRef = useRef<HTMLDivElement | null>(null);
    const { width } = useWindowSize();

    const [firstGroup, setFirstGroup] = useState<JSX.Element[]>([]);
    const [secondGroup, setSecondGroup] = useState<JSX.Element[]>([]);

    const memoizedTagGroupContextValue = useMemo(
        () => ({
            size
        }),
        [size]
    );

    const buttonSize = size === "medium" ? mediumButtonSize : smallButtonSize;

    const removeTag = (index: number, elementCalculatedWith: number, isFirstGroup: boolean) => {
        if (isFirstGroup) {
            setFirstGroup((prevTags) => {
                if (!prevTags[index]) return prevTags;

                const newTags = prevTags
                    .filter((_, i) => i !== index)
                    .map((tag, i) =>
                        React.cloneElement(tag, { onClose: () => removeTag(i, elementCalculatedWith, true) })
                    );

                setSecondGroup((prevSecondGroup) => {
                    if (prevSecondGroup.length === 0) return prevSecondGroup;

                    const firstItemFromSecondGroup = prevSecondGroup[0];
                    const newSecondGroup = prevSecondGroup.slice(1);

                    const reIndexedSecondGroup = newSecondGroup.map((child, i) => {
                        return React.cloneElement(child, {
                            onClose: () => removeTag(i, elementCalculatedWith, false)
                        });
                    }); // bad idea for reindexing

                    const newElementWidth = firstItemFromSecondGroup.props.text.length * everyPixel;
                    const newElementCalculatedWidth =
                        newElementWidth + buttonSize + iconSize + elementPadding + innerGap;

                    if (elementCalculatedWith >= newElementCalculatedWidth) {
                        const clonedElement = React.cloneElement(firstItemFromSecondGroup, {
                            onClose: () => removeTag(newTags.length, elementCalculatedWith, true)
                        });

                        setFirstGroup([...newTags, clonedElement]);
                        return reIndexedSecondGroup;
                    }

                    return prevSecondGroup;
                });

                return newTags;
            });
        } else {
            setSecondGroup((prevTags) => {
                const newTags = prevTags
                    .filter((_, i) => i !== index)
                    .map((tag, i) =>
                        React.cloneElement(tag, { onClose: () => removeTag(i, elementCalculatedWith, false) })
                    ); // bad idea for reindexing

                return newTags;
            });
        }
    };

    useEffect(() => {
        const parentWidth = parentRef.current?.offsetWidth;
        let calculatedWidth = 0;
        let secondGroupIndex = 0;

        const newFirstGroup: JSX.Element[] = [];
        const newSecondGroup: JSX.Element[] = [];

        React.Children.map(children, (child, index) => {
            const typedChild = child as JSX.Element;
            const textWidthOfElement = typedChild.props.text.length * everyPixel;

            const elementCalculatedWith =
                textWidthOfElement + buttonSize + iconSize + elementPadding + innerGap + elementGap;
            calculatedWidth += elementCalculatedWith;

            if (parentWidth) {
                if (calculatedWidth < parentWidth - preParentPadding) {
                    if (!newFirstGroup.includes(typedChild)) {
                        const clonedElement = cloneElement(typedChild, {
                            size,
                            onClose: () => removeTag(index, elementCalculatedWith, true)
                        });

                        newFirstGroup.push(clonedElement);
                    }
                } else if (!newSecondGroup.includes(typedChild) && !newFirstGroup.includes(typedChild)) {
                    const localIndex = secondGroupIndex;

                    const clonedElement = cloneElement(typedChild, {
                        size,
                        onClose: () => removeTag(localIndex, elementCalculatedWith, false)
                    });

                    newSecondGroup.push(clonedElement);
                    secondGroupIndex++;
                }
            }
        });

        setFirstGroup(newFirstGroup);
        setSecondGroup(newSecondGroup);
    }, [children, width, parentRef.current]);

    return (
        <TagGroupContext.Provider value={memoizedTagGroupContextValue}>
            <div className={classNames("tagGroup", className)}>
                <div
                    className={classNames("tagGroup__container", { tagGroup__container_expanded: isExpanded })}
                    ref={parentRef}
                >
                    <div className={classNames("tagGroup__tags", { tagGroup__tags_expanded: isExpanded })}>
                        {firstGroup}
                        {isExpanded && secondGroup}
                    </div>
                    {!!secondGroup?.length && (
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
            </div>
        </TagGroupContext.Provider>
    );
};

export { ITagGroupProps, TagGroup as default };
