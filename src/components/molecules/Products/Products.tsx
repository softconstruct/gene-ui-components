import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Products.scss";
import { Globe } from "@geneui/icons";
import Badge from "../../atoms/Badge";
import Divider from "../../atoms/Divider";

interface IProductsProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Products component props interface
}

/**
 * Products component is a menu-based UI element that allows users to switch between different products or services within an ecosystem.
 */
const Products: FC<IProductsProps> = ({ className }) => {
    return (
        <div className={classNames("products", className)}>
            <div className="products__list">
                {/* For products__item add tabindex */}
                <Badge size="small" value={999}>
                    <div className="products__item">
                        <span className="products__item-logo">
                            <Globe size="48" />
                        </span>
                        <span className="products__item-title">Backoffice</span>
                    </div>
                </Badge>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">BME</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">CMS</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Affiliate</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Umbrella</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Agent</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">CRM</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Poker</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Spring</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Product</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Friendship</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Translation Tool</span>
                </div>
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Data Spot</span>
                </div>
            </div>
            <Divider />
            <div className="products__list">
                <div className="products__item">
                    <span className="products__item-logo">
                        <Globe size="48" />
                    </span>
                    <span className="products__item-title">Data Spot</span>
                </div>
            </div>
        </div>
    );
};

export { IProductsProps, Products as default };
