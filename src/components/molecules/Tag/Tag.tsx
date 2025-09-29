import React, { FC, useRef } from "react";
import classNames from "classnames";

// Icons
import { CircleAlert, IconProps, Tag as TagIcon, TriangleAlert, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./Tag.scss";

type TagStatus = "rest" | "error" | "warning";

interface ITagProps {
    /**
     * Tag content text
     */
    text: string;
    /**
     * Tag status <br/>
     * Possible values: `rest | error | warning`
     * @default "rest"
     */
    status?: TagStatus;
    /**
     * Disables tag
     */
    disabled?: boolean;
    /**
     * Tag size <br/>
     * Possible values: `medium | small`
     */
    size?: "medium" | "small";
    /**
     * Hides or shows left icon
     */
    withIcon?: boolean;
    /**
     * Callback function that calls when close button is pressed
     */
    onClose?: () => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Tab index for keyboard navigation
     */
    tabIndex?: number;
    /**
     * ARIA label for the remove button (X button). Provides descriptive text for screen readers to announce the remove action. Essential for accessibility since the remove button is an interactive element with an action but no visible text.
     */
    ariaLabel?: string;
}

const icons: Record<TagStatus, FC<IconProps>> = {
    rest: TagIcon,
    warning: TriangleAlert,
    error: CircleAlert
} as const;

/**
 * Tag is used to label, categorize, and organize content within an interface. It can be used to highlight keywords, topics, or attributes related to an item. Tags enhance user navigation and search functionality by providing a quick way to filter and identify relevant information.
 */
const Tag: FC<ITagProps> = ({
    className,
    text,
    status = "rest",
    disabled,
    size = "medium",
    withIcon = true,
    onClose,
    tabIndex,
    ariaLabel
}) => {
    const textRef = useRef<HTMLSpanElement | null>(null);
    const isTruncated = useEllipsisDetection(textRef, [text]);

    const Icon = icons[status];

    const handleButtonClick = () => {
        onClose?.();
    };

    return (
        <div
            className={classNames("tag", `tag_size_${size}`, className, {
                [`tag_status_${status}`]: !disabled,
                tag_disabled: disabled,
                tag_withIcon: withIcon
            })}
        >
            {withIcon && <Icon className="tag__icon" size={20} />}
            <Tooltip text={text} isVisible={isTruncated}>
                <Text variant="labelMediumMedium" as="span" className="tag__text ellipsis-text">
                    {text}
                </Text>
            </Tooltip>
            <Button
                className="tag__button"
                appearance="secondary"
                layout="text"
                Icon={X}
                size={size}
                onClick={handleButtonClick}
                disabled={disabled}
                tabIndex={tabIndex}
                ariaLabel={ariaLabel || text}
            />
        </div>
    );
};

export { ITagProps, Tag as default };
