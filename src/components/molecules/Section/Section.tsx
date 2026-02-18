import React, { FC, ReactNode, useRef } from "react";
import classNames from "classnames";

// Components
import Button, { IButtonProps } from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./Section.scss";

interface ISectionProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
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
     * Swappable content to be displayed in the section's header area.
     * When provided, this content will be rendered in the header section.
     */
    headerSwappable?: ReactNode;
    /**
     * The main content of the section, displayed in the body area.
     * This content will be scrollable if it exceeds the available space.
     * If provided as a string, it will be rendered as text.
     * Else you can provide any content as children.
     */
    children?: ReactNode;
    /**
     * Swappable content to be displayed in the section's footer area.
     * When provided, this content will be rendered in the footer section.
     */
    footerSwappable?: ReactNode;
    /**
     * Primary action button object to display in the section's footer.
     * The button will always use primary appearance.
     * The object conforms to the `IButtonProps` interface (excluding appearance which is always primary).
     * @example
     * primaryAction={{ children: 'Submit', onClick: handleSubmit }}
     */
    primaryAction?: Omit<IButtonProps, "appearance" | "className">;
    /**
     * When `true`, adds padding around the section's body content.
     */
    inset?: boolean;
    /**
     * Unique identifier for the section.
     */
    id?: string;
}

const Section: FC<ISectionProps> = ({
    className,
    title,
    subtitle,
    headerSwappable,
    children,
    footerSwappable,
    primaryAction,
    inset = true,
    id
}) => {
    const titleRef = useRef<HTMLSpanElement | null>(null);
    const subtitleRef = useRef<HTMLSpanElement | null>(null);

    const isTitleTruncated: boolean = useEllipsisDetection(titleRef);
    const isSubtitleTruncated: boolean = useEllipsisDetection(subtitleRef);

    return (
        // Add className for section section_withPadding
        <div className={classNames("section", className)} id={id}>
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
                    <div className="section__header_swap">
                        {headerSwappable && <div className="section__header_content">{headerSwappable}</div>}
                    </div>
                </div>
            )}
            <div
                className={classNames("section__body", {
                    section__body_hasHeader: !!title,
                    section__body_hasFooter: !!(footerSwappable || primaryAction),
                    section__body_withPadding: inset
                })}
            >
                <Scrollbar>
                    {inset ? (
                        <div className="section__content">{children}</div>
                    ) : (
                        <div className="section__content">{children}</div>
                    )}
                </Scrollbar>
            </div>
            {(footerSwappable || primaryAction) && (
                <div className="section__footer">
                    {footerSwappable && <div className="section__footer_content">{footerSwappable}</div>}
                    {primaryAction && <Button {...primaryAction} appearance="primary" />}
                </div>
            )}
        </div>
    );
};

export { ISectionProps, Section as default };
