import React, { cloneElement, FC, isValidElement, useContext } from "react";
import classNames from "classnames";

import { FolderOpen, IconProps, LineSlash } from "@geneui/icons";

// Component
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

import { BreadcrumbContext } from "./Breadcrumb";

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

    const itemProps: IBreadcrumbItemProps = { path, title, Icon };

    const onClickHandler = () => {
        if (onClick && !isLastItem) {
            onClick(itemProps);
        }
    };

    const renderIcon = () => {
        if (Icon) {
            return <Icon className="breadcrumb__icon" size={20} />;
        }
        if (iconOnly) {
            return <FolderOpen className="breadcrumb__icon" size={20} />;
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
                    className={classNames("breadcrumb__link", {
                        breadcrumb__link_active: isLastItem,
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

            {!isLastItem && <LineSlash size={24} />}
        </li>
    );
};

export { IBreadcrumbItemProps, BreadcrumbItem as default };
