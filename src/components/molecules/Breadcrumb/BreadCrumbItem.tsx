import React, { FC, useContext } from "react";
import classNames from "classnames";

import { ChevronRight, FolderOpen, IconProps } from "@geneui/icons";

import Text from "@components/atoms/Text";
import { BreadcrumbContext } from "@components/molecules/Breadcrumb/Breadcrumb";
import Tooltip from "@components/molecules/Tooltip";

interface IBreadcrumbItemProps {
    title?: string;
    path?: string;
    /**
     * Icon component to display before the title
     */
    Icon?: FC<IconProps>;
}

const BreadcrumbItem: FC<IBreadcrumbItemProps> = ({ path, title, Icon }) => {
    const { iconOnly, isLastItem } = useContext(BreadcrumbContext);

    // TODO: if iconOnly and has title , need to show tooltip
    // TODO: need to add an icon slash /
    // TODO: need to add render
    // TODO: need isLastItem

    const renderIcon = () => {
        if (Icon) {
            return <Icon className="breadcrumb__icon" size={20} />;
        }
        if (iconOnly) {
            return <FolderOpen className="breadcrumb__icon" size={20} />;
        }
        return null;
    };

    return (
        <li className="breadcrumb__item">
            {/* todo: add the next classNames for icon alignment: "breadcrumb__link_iconOnly" */}
            <Tooltip text={title} isVisible={iconOnly && !!title}>
                <a
                    className={classNames("breadcrumb__link  ", {
                        breadcrumb__link_active: isLastItem,
                        breadcrumb__link_iconOnly: iconOnly
                    })}
                    href={path || ""}
                    tabIndex={0}
                >
                    {renderIcon()}
                    {title && !iconOnly && (
                        <Text as="span" variant="labelMediumSemibold" className="breadcrumb__title">
                            {title}
                        </Text>
                    )}
                </a>
            </Tooltip>

            {/* todo: change "ChevronRight" Icon to "/" as in design file */}
            {!isLastItem && <ChevronRight size={24} />}
        </li>
    );
};

export { IBreadcrumbItemProps, BreadcrumbItem as default };
