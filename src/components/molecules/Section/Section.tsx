import React, { FC } from "react";
import classNames from "classnames";

import { CheckMarkCircleFilled, X } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";

import "./Section.scss";

interface ISectionProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // /**
    //  * The size of the section.
    //  * Possible values: `small | medium | large`
    //  */
    // size?: "small" | "medium" | "large";
    // /**
    //  * The title text displayed in the section's header.
    //  */
    // title?: string;
    // /**
    //  * The subtitle text displayed below the title in the section's header.
    //  */
    // subtitle?: string;
    // /**
    //  * Content to be displayed in the section's header area.
    //  * When provided, this content will be rendered in the header section.
    //  */
    // headerContent?: React.ReactNode;
    // /**
    //  * The main content of the section, displayed in the body area.
    //  * This content will be scrollable if it exceeds the available space.
    //  */
    // bodyContent?: React.ReactNode;
    // /**
    //  * Content to be displayed in the section's footer area.
    //  * When provided, this content will be rendered in the footer section.
    //  */
    // footerContent?: React.ReactNode;
    // /**
    //  * Action button object to display in the section's footer.
    //  * The object conforms to the `IButtonProps` interface, allowing full customization of the button.
    //  * @example
    //  * action={{ children: 'Submit', appearance: 'primary', onClick: handleSubmit }}
    //  */
    // action?: IButtonProps;
    // /**
    //  * When `true`, displays the header section.
    //  * When `false`, the header section is hidden.
    //  */
    // hasHeader?: boolean;
    // /**
    //  * When `true`, displays the footer section.
    //  * When `false`, the footer section is hidden.
    //  */
    // hasFooter?: boolean;
    // /**
    //  * When `true`, adds padding around the section's body content.
    //  */
    // withPadding?: boolean;
}

const Section: FC<ISectionProps> = ({
    className
    // size,
    // title,
    // subtitle,
    // headerContent,
    // bodyContent,
    // footerContent,
    // action,
    // hasHeader,
    // hasFooter,
    // withPadding
}) => {
    return (
        // IsInset
        <div className={classNames("section section_isInset", className)}>
            {/* Section Header */}
            <div className="section__header">
                <div className="section__title">
                    <Text variant="labelMediumSemibold" as="span" className="ellipsis-text">
                        Title
                    </Text>
                    <Text variant="labelSmallMedium" as="span" className="ellipsis-text">
                        Subtitle
                    </Text>
                </div>
                <div className="section__header_swap ">
                    <Button Icon={X} size="small" appearance="secondary" layout="fill" onClick={() => ({})}>
                        Swap
                    </Button>
                </div>
            </div>

            {/* Section Body border radius change hasBody and hasFooter */}
            <div className="section__body section__body_withPadding section__body_hasHeader section__body_hasFooter">
                <Scrollbar>
                    <div className="section__wrapper">
                        <div className="section__content">
                            <CheckMarkCircleFilled className="section__content_icon" size={24} />
                            <div className="section__content_context">
                                <p className="section__content_title">Swap</p>
                                <p className="section__content_description">Swap</p>
                            </div>
                        </div>
                        <div className="section__content">
                            <CheckMarkCircleFilled className="section__content_icon" size={24} />
                            <div className="section__content_context">
                                <p className="section__content_title">Swap</p>
                                <p className="section__content_description">Swap</p>
                            </div>
                        </div>
                    </div>
                </Scrollbar>
            </div>

            {/* Section Footer */}
            <div className="section__footer">
                <div className="section__footer_swap">
                    <Button Icon={X} size="small" appearance="secondary" layout="fill" onClick={() => ({})}>
                        Swap
                    </Button>
                </div>
                <ButtonGroup className="section__actions" size="medium">
                    <Button name="Primary" size="medium" appearance="secondary" layout="fill" onClick={() => ({})}>
                        Secondary
                    </Button>
                    <Button name="Primary" size="medium" appearance="primary" layout="fill" onClick={() => ({})}>
                        Primary
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export { ISectionProps, Section as default };
