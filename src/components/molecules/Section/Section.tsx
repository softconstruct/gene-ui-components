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
    // fill Section component props interface
}

const Section: FC<ISectionProps> = ({ className }) => {
    return (
        // IsInset
        <div className={classNames("section section_isInset", className)}>
            {/* Section Header */}
            <div className="section__header">
                <div className="section__title">
                    <Text variant="labelMediumSemibold" as="span">
                        Title
                    </Text>
                    <Text variant="labelSmallMedium" as="span">
                        Subtitle
                    </Text>
                </div>
                <div className="section__header_right ">
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
                <Button Icon={X} size="small" appearance="secondary" layout="fill" onClick={() => ({})}>
                    Swap
                </Button>
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
