import React, { cloneElement, FC, isValidElement, ReactElement, ReactNode, useContext, useState } from "react";
// Utils
import classNames from "classnames";

// Icons & Types
import { ChevronDown, ChevronLeft, ChevronRight, IconProps } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";

// Styles
import "./Accordion.scss";

// Context
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

interface IAccordionItemProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The title text displayed in the accordion header
     */
    title: string;
    /**
     * Disables the accordion item, preventing interaction
     */
    disabled?: boolean;
    /**
     * Icon component to display before the title
     */
    IconBefore?: FC<IconProps>;
    /**
     * Custom actions to display in the header (typically ButtonGroup with Buttons)
     */
    actions?: ReactNode;
    /**
     * Content to display when the accordion item is expanded
     */
    children: ReactNode;
}

/**
 * Accordion component organizes content into expandable and collapsible sections, allowing users to reveal or hide detailed information as needed. Each section, or "panel," typically includes a header that summarizes the content and can be clicked to expand or collapse the corresponding panel.
 */
const AccordionItem: FC<IAccordionItemProps> = ({ className, title, disabled, IconBefore, children, actions }) => {
    const { size } = useContext(AccordionContext);

    const [isExpanded, setIsExpanded] = useState(false);
    const isRTLMode = document.dir === "rtl";
    const chevronHorizontalIcon = isRTLMode ? ChevronLeft : ChevronRight;

    const handleToggleExpanded = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
    };

    const cloneWithDisabled = (element: ReactNode): ReactNode => {
        if (!isValidElement(element)) return element;

        const clonedChildren = React.Children.map(element.props.children, (child) => cloneWithDisabled(child));

        return cloneElement(element as ReactElement, {
            ...element.props,
            disabled: disabled || element.props.disabled,
            children: clonedChildren
        });
    };

    const actionsWithDisabled = disabled && actions ? cloneWithDisabled(actions) : actions;

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

                    {IconBefore && <IconBefore className="accordionItem__icon" size={iconSizes[size]} />}
                    <Text as="span" variant={textVariants[size]} className="accordionItem__title ellipsis-text">
                        {title}
                    </Text>
                    {actionsWithDisabled}
                </div>
                {isExpanded && (
                    <div className="accordionItem__body">
                        <div className="accordionItem__content">
                            <Scrollbar>{children}</Scrollbar>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export { IAccordionItemProps, AccordionItem as default };
