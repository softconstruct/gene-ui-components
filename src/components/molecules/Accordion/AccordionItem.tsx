import React, { FC, MouseEvent, ReactNode, useContext, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";

import { ChevronDown, ChevronLeft, ChevronRight, IconProps } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./Accordion.scss";

import { AccordionContext } from "./Accordion";

const buttonSizes = {
    large: "small",
    medium: "smallNudge",
    small: "smallNudge"
} as const;

const textVariants = {
    large: "bodyLargeMedium",
    medium: "bodyMediumMedium",
    small: "bodyMediumMedium"
} as const;

const iconSizes = {
    large: 24,
    medium: 20,
    small: 20
} as const;

interface IAccordionActionProps {
    /**
     * The `Icon` component to display in the action button. If not provided, the action button will not be rendered.
     */
    Icon?: FC<IconProps>;
    /**
     * A callback function that is called when the button is clicked.
     */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * HTML id attribute for the button element.
     */
    id?: string;
    /**
     * Specifies the name of the button.
     */
    name?: string;
    /**
     * An ARIA label for the button.
     */
    "aria-label"?: string;
}

interface IAccordionItemProps {
    /**
     * The title text displayed in the accordion header
     */
    title?: string;
    /**
     * Icon component to display before the title
     */
    Icon?: FC<IconProps>;
    /**
     * An array of action button objects to display in the accordion header.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * Each action button is rendered with `layout="text"` and `appearance="secondary"` (these cannot be overridden).
     * For icon-only buttons, use the `Icon` prop (required).
     * @example
     * actions={[
     *   { Icon: Globe, onClick: handleAction },
     *   { Icon: Download }
     * ]}
     */
    actions?: IAccordionActionProps[];
    /**
     * Content to display when the accordion item is expanded
     */
    children: ReactNode;
    /**
     * A unique identifier for the accordion item element.
     * Useful for accessibility purposes, like `aria-labelledby`.
     */
    id?: string;
}

/**
 * Accordion component organizes content into expandable and collapsible sections, allowing users to reveal or hide detailed information as needed. Each section, or "panel," typically includes a header that summarizes the content and can be clicked to expand or collapse the corresponding panel.
 */
const AccordionItem: FC<IAccordionItemProps> = ({ title, Icon, children, actions, id }) => {
    const { size, onToggle } = useContext(AccordionContext);

    const [isExpanded, setIsExpanded] = useState(false);
    const titleRef = useRef<HTMLSpanElement | null>(null);
    const isTruncated = useEllipsisDetection(titleRef, [title]);
    const isRTLMode = document.dir === "rtl";
    const chevronHorizontalIcon = isRTLMode ? ChevronLeft : ChevronRight;
    const hasActions = actions && actions.length > 0;

    const actionsWithIds = useMemo(() => {
        if (!actions) return [];
        return actions.map((action) => ({
            ...action,
            id: action.id || `accordion-action-${nanoid()}`
        }));
    }, [actions]);

    const handleExpandToggle = () => {
        setIsExpanded((prev) => {
            const newValue = !prev;
            onToggle?.({ id, isExpanded: newValue });
            return newValue;
        });
    };

    return (
        <div
            className={classNames(`accordionItem accordionItem_size_${size}`, {
                accordionItem_expanded: isExpanded
            })}
            id={id}
        >
            <div className="accordionItem__header">
                <Button
                    size={buttonSizes[size]}
                    appearance="secondary"
                    layout="text"
                    Icon={isExpanded ? ChevronDown : chevronHorizontalIcon}
                    onClick={handleExpandToggle}
                    aria-expanded={isExpanded}
                />
                {Icon && <Icon className="accordionItem__icon" size={iconSizes[size]} />}
                {title ? (
                    <Tooltip text={title} isVisible={isTruncated}>
                        <Text
                            as="span"
                            variant={textVariants[size]}
                            className="accordionItem__title ellipsis-text"
                            ref={titleRef}
                        >
                            {title}
                        </Text>
                    </Tooltip>
                ) : (
                    <div className="accordionItem__title" />
                )}
                {hasActions && (
                    <ButtonGroup className="accordionItem__actions" size={size}>
                        {actionsWithIds.map((action) => {
                            return action.Icon ? (
                                <Button key={action.id} {...action} layout="text" appearance="secondary" />
                            ) : null;
                        })}
                    </ButtonGroup>
                )}
            </div>
            {isExpanded && (
                <div className="accordionItem__body">
                    <div className="accordionItem__content">
                        <Scrollbar>
                            <div className="accordionItem__inner">{children}</div>
                        </Scrollbar>
                    </div>
                </div>
            )}
        </div>
    );
};

export { IAccordionActionProps, IAccordionItemProps, AccordionItem as default };
