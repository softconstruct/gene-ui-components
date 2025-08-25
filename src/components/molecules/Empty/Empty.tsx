import React, { FC } from "react";
import classNames from "classnames";

import Button from "@components/atoms/Button";
import Skeleton from "@components/atoms/Skeleton";
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
     * The primary message displayed in the component.
     */
    message: string;
    /**
     * A detailed description to accompany the main message.
     */
    description?: string;
    /**
     * The source URL for a custom image.
     * **Note: This prop is only used when appearance is set to `custom`.
     */
    // src?: unknown;
    /**
     * The text to display on the primary action button.
     * **Note: The primary action button will not be rendered if this prop is not provided.**
     */
    primaryActionText?: string;
    /**
     * The text to display on the secondary action button.
     * **Note: The secondary action button will not be rendered if this prop is not provided.**
     */
    secondaryActionText?: string;
    /**
     * Callback function for the primary action button.
     * This is only relevant if `primaryActionText` is also provided.
     */
    onPrimaryActionClick?: () => void;
    /**
     * Callback function for the secondary action button.
     * This is only relevant if `secondaryActionText` is also provided.
     */
    onSecondaryActionClick?: () => void;
    /**
     * When set to `true`, the component will display a skeleton instead of its content.
     */
    loading?: boolean;
    /**
     * Determines the visual style of the `Empty component`.<br>
     * Possible values: `star | heart | emoji | number`
     */
    // appearance?:
    //     | "noData"
    //     | "noResult"
    //     | "success"
    //     | "warning"
    //     | "info"
    //     | "error"
    //     | "notFound"
    //     | "forbidden"
    //     | "serverError"
    //     | "custom";
}

// const getEmptyImageByAppearance = (appearance: IEmptyProps["appearance"], src?: string) => ({
//     noData: "./src/noData",
//     noResult: "./src/noResult",
//     success: "./src/success",
//     warning: "./src/warning",
//     info: "./src/info",
//     error: "./src/error",
//     notFound: "./src/notFound",
//     forbidden: "./src/forbidden",
//     serverError: "./src/serverError",
//     custom: src
// });

/**
 * The Empty component visually represents chronological events or steps in a process. It is commonly used in dashboards, order tracking, and activity feeds to display key milestones or updates in a structured manner.
 */
const Empty: FC<IEmptyProps> = ({
    className,
    message,
    description,
    // src,
    primaryActionText,
    secondaryActionText,
    onPrimaryActionClick,
    onSecondaryActionClick,
    loading
    // appearance = "noData"
}) => {
    return (
        <div className={classNames("empty", className)}>
            {loading ? (
                <div className="empty__skeleton">
                    <Skeleton height={140} width={210} />
                    <div className="empty__skeletonContent">
                        <Skeleton height={20} rounded="rounded4X" />
                        <Skeleton height={20} rounded="rounded4X" />
                    </div>
                </div>
            ) : (
                <>
                    {/* todo: add image source for each state of "Empty" component */}
                    {/* <img src="getEmptyImageByAppearance(appearance)" className="empty__image" alt="empty image" /> */}

                    {/* todo: implement "Swap" component for Custom case */}
                    <div className="swapComponent" style={{ width: "21rem", height: "14rem", background: "#F4E1EC" }} />

                    <div className="empty__content">
                        <div className="empty__info">
                            <Text as="p" variant="subheadingMediumSemibold" alignment="center" className="empty__title">
                                {message}
                            </Text>
                            {description && (
                                <Text
                                    as="p"
                                    variant="bodyMediumMedium"
                                    alignment="center"
                                    className="empty__description"
                                >
                                    {description}
                                </Text>
                            )}
                        </div>
                        <ButtonGroup size="medium">
                            {!!secondaryActionText && (
                                <Button appearance="secondary" onClick={onSecondaryActionClick} layout="outline">
                                    {secondaryActionText}
                                </Button>
                            )}
                            {!!primaryActionText && (
                                <Button appearance="primary" onClick={onPrimaryActionClick}>
                                    {primaryActionText}
                                </Button>
                            )}
                        </ButtonGroup>
                    </div>
                </>
            )}
        </div>
    );
};

export { IEmptyProps, Empty as default };
