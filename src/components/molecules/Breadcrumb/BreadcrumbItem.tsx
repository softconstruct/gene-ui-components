import React, { cloneElement, FC, isValidElement, useContext } from "react";
import classNames from "classnames";

import { FolderOpen, IconProps, LineSlash } from "@geneui/icons";

// Component
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

import { BreadcrumbContext, IBreadcrumbClickItem } from "./Breadcrumb";
import { BREADCRUMB_ICON_SIZE, BREADCRUMB_SEPARATOR_SIZE } from "./Breadcrumb.constants";

interface IBreadcrumbItemProps {
    /**
     * Text label displayed for this breadcrumb segment.
     */
    title: string;
    /**
     * Optional navigation target for this breadcrumb segment.
     * If provided, the item can be rendered as a link or clickable button.
     */
    path?: string;
    /**
     * Optional icon component rendered before the title.
     */
    Icon?: FC<IconProps>;
}

const BreadcrumbItem: FC<IBreadcrumbItemProps> = ({ path, title, Icon }) => {
    const { iconOnly, isLastItem, render, onClick } = useContext(BreadcrumbContext);

    const itemProps: IBreadcrumbClickItem = { path, title };

    const onClickHandler = () => {
        if (onClick && !isLastItem) {
            onClick(itemProps);
        }
    };

    const renderIcon = () => {
        if (Icon) {
            return <Icon size={BREADCRUMB_ICON_SIZE} />;
        }
        if (iconOnly) {
            return <FolderOpen size={BREADCRUMB_ICON_SIZE} />;
        }
        return null;
    };

    const itemContent = (
        <>
            {renderIcon()}
            {title && !iconOnly && (
                <Text as="span" variant="labelMediumSemibold" className="breadcrumb__title">
                    {title}
                </Text>
            )}
        </>
    );

    const linkData = { path, title, isActive: isLastItem, Icon };

    const interactiveElement = (() => {
        if (render && path && !isLastItem) {
            const renderedElement = render(linkData);
            if (isValidElement(renderedElement)) {
                const propsToApply = {
                    className: classNames("breadcrumb__link", {
                        breadcrumb__link_active: isLastItem,
                        breadcrumb__link_iconBefore: !!Icon && !iconOnly,
                        breadcrumb__link_iconOnly: iconOnly
                    }),
                    tabIndex: 0,
                    onClick: onClickHandler
                };
                return cloneElement(renderedElement, { ...propsToApply }, itemContent);
            }
        }

        if (isLastItem) {
            return (
                <span
                    className={classNames("breadcrumb__link breadcrumb__link_active", {
                        breadcrumb__link_iconBefore: !!Icon && !iconOnly,
                        breadcrumb__link_iconOnly: iconOnly
                    })}
                    aria-current="page"
                >
                    {itemContent}
                </span>
            );
        }

        return (
            <button
                type="button"
                className={classNames("breadcrumb__link", {
                    breadcrumb__link_iconBefore: !!Icon && !iconOnly,
                    breadcrumb__link_iconOnly: iconOnly
                })}
                tabIndex={0}
                onClick={onClickHandler}
            >
                {itemContent}
            </button>
        );
    })();

    return (
        <li className="breadcrumb__item">
            <Tooltip text={title} isVisible={iconOnly && !!title}>
                {interactiveElement}
            </Tooltip>

            {!isLastItem && <LineSlash size={BREADCRUMB_SEPARATOR_SIZE} />}
        </li>
    );
};

export { IBreadcrumbItemProps, BreadcrumbItem as default };
