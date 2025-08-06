import React, { FC } from "react";
import classNames from "classnames";

import { X } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";

// Styles
import "./Drawer.scss";

interface IDrawerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Drawer component props interface
}

/**
 * Drawer component slides in from the edge of the screen, allowing users to access additional content or actions without leaving the current view. It can be anchored to the left, right, top, or bottom of the screen and typically overlays or pushes the existing content, depending on situation.
 */
const Drawer: FC<IDrawerProps> = ({ className }) => {
    return (
        <div
            className={classNames("drawer drawer_variant_portal drawer_flow_horizontal drawer_withPadding", className)}
        >
            {/* drawer_flow_vertical // drawer_flow_horizontal */}
            <div className="drawer__wrapper drawer__wrapper_size_medium">
                <div className="drawer__header">
                    <Text variant="labelLargeSemibold" className="drawer__title ellipsis-text" as="h2">
                        Title
                    </Text>
                    <Button size="medium" Icon={X} type="button" layout="text" appearance="secondary" />
                </div>
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
};

export { IDrawerProps, Drawer as default };
