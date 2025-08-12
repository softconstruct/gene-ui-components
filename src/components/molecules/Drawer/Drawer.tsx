import React, { FC, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import { X } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Tooltip from "@components/molecules/Tooltip";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./Drawer.scss";

interface IDrawerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Toggles the padding around the Drawer's content area.
     */
    withPadding?: boolean;
    /**
     * The title text displayed in the Drawer's header.
     */
    title?: string;
    /**
     * Determines whether the close (X) button is displayed in the Drawer's header.
     */
    hasCloseButton?: boolean;
    /**
     * Controls the visibility of the Drawer.
     */
    open?: boolean;
    size?: "small" | "medium" | "large";
    direction?: "horizontal " | "vertical";
}

/**
 * Drawer component slides in from the edge of the screen, allowing users to access additional content or actions without leaving the current view. It can be anchored to the left, right, top, or bottom of the screen and typically overlays or pushes the existing content, depending on situation.
 */
const Drawer: FC<IDrawerProps> = ({
    className,
    size = "medium",
    direction = "horizontal",
    withPadding = true,
    title,
    hasCloseButton,
    open
}) => {
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const providerCurrent = geneUIProviderRef.current;
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const isTruncated: boolean = useEllipsisDetection(titleRef);

    const drawerContent = (
        <div
            className={classNames(
                `drawer drawer_variant_portal drawer_direction_${direction} `,
                {
                    drawer_withPadding: withPadding
                },
                className
            )}
        >
            {/* drawer_flow_vertical // drawer_flow_horizontal */}
            <div className={`drawer__wrapper drawer__wrapper_size_${size}`}>
                {(hasCloseButton || title) && (
                    <div className="drawer__header">
                        {title && (
                            <Tooltip text={title} isVisible={isTruncated}>
                                <Text
                                    className="drawer__title ellipsis-text"
                                    variant="labelLargeSemibold"
                                    as="h1"
                                    ref={titleRef}
                                >
                                    {title}
                                </Text>
                            </Tooltip>
                        )}
                        {hasCloseButton && (
                            <Button
                                size="medium"
                                Icon={X}
                                type="button"
                                layout="text"
                                appearance="secondary"
                                className="drawer__closeButton"
                            />
                        )}
                    </div>
                )}
                <div className="drawer__body">
                    <Scrollbar>
                        <div className="drawer__content">Content</div>
                    </Scrollbar>
                </div>
                <div className="drawer__footer">
                    <ButtonGroup className="drawer__buttonGroup" size="medium">
                        <Button className="drawer__button" size="small" appearance="secondary">
                            Secondary
                        </Button>
                        <Button className="drawer__button" size="small" appearance="primary">
                            Primary
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );

    return <>{providerCurrent && open ? createPortal(drawerContent, providerCurrent) : null}</>;
};

export { IDrawerProps, Drawer as default };
