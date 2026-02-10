import React, { FC, useRef } from "react";
import classNames from "classnames";

import Button, { IButtonProps } from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

import "./Section.scss";

interface ISectionProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The size of the section.
     * Possible values: `small | medium | large`
     */
    size?: "small" | "medium" | "large";
    /**
     * The title text displayed in the section's header.
     * When provided, the header section will be rendered.
     * When not provided, the header section will be hidden.
     */
    title?: string;
    /**
     * The subtitle text displayed below the title in the section's header.
     */
    subtitle?: string;
    /**
     * Content to be displayed in the section's header area.
     * When provided, this content will be rendered in the header section.
     */
    headerContent?: React.ReactNode;
    /**
     * The main content of the section, displayed in the body area.
     * This content will be scrollable if it exceeds the available space.
     */
    bodyContent?: React.ReactNode;
    /**
     * Content to be displayed in the section's footer area.
     * When provided, this content will be rendered in the footer section.
     */
    footerContent?: React.ReactNode;
    /**
     * Action button object to display in the section's footer.
     * The object conforms to the `IButtonProps` interface, allowing full customization of the button.
     * @example
     * action={{ children: 'Submit', appearance: 'primary', onClick: handleSubmit }}
     */
    action?: IButtonProps;
    /**
     * When `true`, adds padding around the section's body content.
     */
    withPadding?: boolean;
}

const Section: FC<ISectionProps> = ({
    className,
    // size,
    title,
    subtitle,
    headerContent,
    bodyContent,
    footerContent,
    action,
    withPadding = true
}) => {
    const titleRef = useRef<HTMLSpanElement | null>(null);
    const subtitleRef = useRef<HTMLSpanElement | null>(null);

    const isTitleTruncated: boolean = useEllipsisDetection(titleRef);
    const isSubtitleTruncated: boolean = useEllipsisDetection(subtitleRef);

    return (
        <div className={classNames("section section_isInset", className)}>
            {title && (
                <div className="section__header">
                    <div className="section__title">
                        <Tooltip text={title} isVisible={isTitleTruncated}>
                            <Text variant="labelMediumSemibold" as="span" className="ellipsis-text" ref={titleRef}>
                                {title}
                            </Text>
                        </Tooltip>
                        {subtitle && (
                            <Tooltip text={subtitle} isVisible={isSubtitleTruncated}>
                                <Text variant="labelSmallMedium" as="span" className="ellipsis-text" ref={subtitleRef}>
                                    {subtitle}
                                </Text>
                            </Tooltip>
                        )}
                    </div>
                    <div className="section__header_swap section__header_content">
                        {headerContent && <div className="section__header_content">{headerContent}</div>}
                    </div>
                </div>
            )}
            <div
                className={classNames("section__body", {
                    section__body_withPadding: withPadding,
                    section__body_hasHeader: !!title,
                    section__body_hasFooter: !!(footerContent || action)
                })}
            >
                <Scrollbar>
                    {withPadding ? (
                        <div className="section__wrapper">
                            <div className="section__content">{bodyContent}</div>
                        </div>
                    ) : (
                        <div className="section__content">{bodyContent}</div>
                    )}
                </Scrollbar>
            </div>
            {(footerContent || action) && (
                <div className="section__footer">
                    <div className="section__footer_swap">
                        {footerContent && <div className="section__footer_content">{footerContent}</div>}
                    </div>
                    {action && (
                        <div className="section__footer_actions">
                            <Button {...action} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { ISectionProps, Section as default };
