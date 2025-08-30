import React, { FC } from "react";
import classNames from "classnames";

import Button, { IButtonProps } from "@components/atoms/Button";
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
     * An array of action button objects to display in the `empty` component's footer.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * Each object conforms to the `IButtonProps` interface, allowing full customization of each button.
     * @example
     * actions={[
     * { children: 'Cancel', appearance: 'secondary', onClick: handleCancel },
     * { children: 'Reload', appearance: 'primary', onClick: handleReload }
     * ]}
     */
    actions?: IButtonProps[];
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
    actions,
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
                        {actions && actions.length > 0 && (
                            <ButtonGroup size="medium">
                                {actions.map((action: IButtonProps) => {
                                    const { children: buttonChildren } = action;
                                    const key = `action-${buttonChildren}`;
                                    return buttonChildren ? (
                                        <Button key={key} {...action}>
                                            {buttonChildren}
                                        </Button>
                                    ) : null;
                                })}
                            </ButtonGroup>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export { IEmptyProps, Empty as default };
