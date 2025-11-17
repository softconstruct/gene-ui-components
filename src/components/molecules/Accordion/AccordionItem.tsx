import React, { FC, useContext, useState } from "react";
// Utils
import classNames from "classnames";

// Icons
import { ChevronDown, ChevronLeft, ChevronRight, Download, Globe, RecycleBin, Tag } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";

// Styles
import "./Accordion.scss";

// Context
import { AccordionContext } from "./Accordion";

const buttonSizes = {
    large: "small",
    medium: "smallNudge",
    small: "smallNudge"
} as const;

const buttonGroupSizes = {
    large: "medium",
    medium: "medium",
    small: "small"
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

interface IAccordionItemProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Tag content text
     */
    title: string;
    /**
     * Disables Accordion
     */
    disabled?: boolean;
    /**
     * Shows or hides actions
     */
    actions?: boolean;
    /**
     * Hides or shows left icon
     */
    withIcon?: boolean;
    // fill Accordion component props interface
}

/**
 * Accordion component organizes content into expandable and collapsible sections, allowing users to reveal or hide detailed information as needed. Each section, or "panel," typically includes a header that summarizes the content and can be clicked to expand or collapse the corresponding panel.
 */
const AccordionItem: FC<IAccordionItemProps> = ({ className, title, disabled, withIcon = true, actions = true }) => {
    const { size } = useContext(AccordionContext);

    const [isExpanded, setIsExpanded] = useState(false);
    const isRTLMode = document.dir === "rtl";
    const chevronHorizontalIcon = isRTLMode ? ChevronLeft : ChevronRight;

    const handleToggleExpanded = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
    };

    return (
        <>
            <div
                className={classNames(`accordionItem accordionItem_size_${size}`, className, {
                    accordionItem_disabled: disabled,
                    accordionItem_expanded: isExpanded
                })}
            >
                <div className="accordionItem__header">
                    <Button
                        size={buttonSizes[size]}
                        appearance="secondary"
                        layout="text"
                        Icon={isExpanded ? ChevronDown : chevronHorizontalIcon}
                        onClick={handleToggleExpanded}
                        disabled={disabled}
                        aria-expanded={isExpanded}
                    />

                    {withIcon && <Tag className="accordionItem__icon" size={iconSizes[size]} />}
                    <Text as="span" variant={textVariants[size]} className="accordionItem__title ellipsis-text">
                        {title}
                    </Text>
                    {actions && (
                        <ButtonGroup size={buttonGroupSizes[size]}>
                            <Button appearance="secondary" layout="text" disabled={disabled} Icon={Globe} />
                            <Button appearance="secondary" layout="text" disabled={disabled} Icon={Download} />
                            <Button appearance="secondary" layout="text" disabled={disabled} Icon={RecycleBin} />
                        </ButtonGroup>
                    )}
                </div>
                {isExpanded && (
                    <div className="accordionItem__body">
                        <div className="accordionItem__content">
                            <Scrollbar>
                                {/* todo: remove text after content implementation */}
                                <span>test</span>
                            </Scrollbar>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export { IAccordionItemProps, AccordionItem as default };
