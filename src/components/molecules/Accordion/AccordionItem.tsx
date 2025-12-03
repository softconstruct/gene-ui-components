import React, { FC, ReactNode, useContext, useRef, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";

import { ChevronDown, ChevronLeft, ChevronRight, IconProps } from "@geneui/icons";

// Components
import Button, { IButtonProps } from "@components/atoms/Button";
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

type IAccordionActionProps = Omit<
    IButtonProps,
    "size" | "fullWidth" | "children" | "iconPosition" | "type" | "disabled" | "layout" | "appearance"
>;

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
     * Each object conforms to the `IButtonProps` interface, allowing full customization of each button.
     * For icon-only buttons, use the `Icon` prop instead of `children`.
     * @example
     * actions={[
     *   { Icon: Globe, appearance: 'secondary', layout: 'text', onClick: handleAction },
     *   { Icon: Download, appearance: 'secondary', layout: 'text' }
     * ]}
     */
    actions?: IAccordionActionProps[];
    /**
     * Content to display when the accordion item is expanded
     */
    children: ReactNode;
}

/**
 * Accordion component organizes content into expandable and collapsible sections, allowing users to reveal or hide detailed information as needed. Each section, or "panel," typically includes a header that summarizes the content and can be clicked to expand or collapse the corresponding panel.
 */
const AccordionItem: FC<IAccordionItemProps> = ({ title, Icon, children, actions }) => {
    const { size } = useContext(AccordionContext);

    const [isExpanded, setIsExpanded] = useState(false);
    const titleRef = useRef<HTMLSpanElement | null>(null);
    const isTruncated = useEllipsisDetection(titleRef, [title]);
    const isRTLMode = document.dir === "rtl";
    const chevronHorizontalIcon = isRTLMode ? ChevronLeft : ChevronRight;

    const handleExpandToggle = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
    };

    return (
        <>
            <div
                className={classNames(`accordionItem accordionItem_size_${size}`, {
                    accordionItem_expanded: isExpanded
                })}
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
                    {actions && actions.length > 0 && (
                        <ButtonGroup className="accordionItem__actions" size={size}>
                            {actions.map((action: IAccordionActionProps) => {
                                const { Icon: actionIcon } = action;
                                const actionId = action.id || `accordion-action-${nanoid()}`;
                                return actionIcon ? (
                                    <Button key={actionId} {...action} layout="text" appearance="secondary" />
                                ) : null;
                            })}
                        </ButtonGroup>
                    )}
                </div>
                {isExpanded && (
                    <div className="accordionItem__body">
                        <div className="accordionItem__content">
                            <Scrollbar>
                                <div className="accordionItem__data">{children}</div>
                            </Scrollbar>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export { IAccordionActionProps, IAccordionItemProps, AccordionItem as default };
