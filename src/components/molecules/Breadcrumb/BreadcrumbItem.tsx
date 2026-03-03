import React, { cloneElement, FC, isValidElement, useContext } from "react";
import classNames from "classnames";

import { FolderOpen, IconProps, LineSlash } from "@geneui/icons";

import Text from "@components/atoms/Text";
import { BreadcrumbContext } from "@components/molecules/Breadcrumb/Breadcrumb";
import Tooltip from "@components/molecules/Tooltip";

interface IBreadcrumbItemProps {
    title: string;
    path?: string;
    /**
     * Icon component to display before the title
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

    // TODO: need to add an icon slash /

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
