import React, { FC } from "react";
import classNames from "classnames";

import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";

// Styles
import "./Empty.scss";

interface IEmptyProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;

    /**
     * message description
     */
    // message?: unknown;
    /**
     * description description
     */
    // description?: unknown;
}

/**
 * The Empty component visually represents chronological events or steps in a process. It is commonly used in dashboards, order tracking, and activity feeds to display key milestones or updates in a structured manner.
 */
const Empty: FC<IEmptyProps> = ({ className }) => {
    return (
        <div className={classNames("empty", className)}>
            {/* todo: add image source for each state of "Empty" component */}
            {/* <img src="" className="empty__image" alt="empty image" /> */}

            {/* todo: implement "Swap" component for Custom case */}
            <div className="swapComponent" style={{ width: "21rem", height: "14rem", background: "#F4E1EC" }} />

            <div className="empty__content">
                <div className="empty__info">
                    <Text as="p" variant="subheadingMediumSemibold" alignment="center" className="empty__title">
                        {/* todo: add Title text for each state of "Empty" component */}
                        No Data Available
                    </Text>
                    <Text as="p" variant="bodyMediumMedium" alignment="center" className="empty__description">
                        {/* todo: add Description text for each state of "Empty" component */}
                        No data is available for display at this moment.
                    </Text>
                </div>
                <ButtonGroup>
                    <Button size="medium" layout="outline" appearance="secondary">
                        Action 2
                    </Button>
                    <Button size="medium" layout="fill" appearance="primary">
                        Action 1
                    </Button>
                </ButtonGroup>
            </div>

            {/* todo: show Skeleton for "Empty" component if needed */}
            {/* <div className="empty__skeleton"> */}
            {/*     <Skeleton height={140} width={210} /> */}
            {/*     <div className="empty__skeletonContent"> */}
            {/*         <Skeleton height={20} rounded="rounded4X" /> */}
            {/*         <Skeleton height={20} rounded="rounded4X" /> */}
            {/*     </div> */}
            {/* </div> */}
        </div>
    );
};

export { IEmptyProps, Empty as default };
