import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { childrenOf } from 'utils';
import Icon from '../../atoms/Icon';
import Divider from '../../atoms/Divider';

function MenuItem(props) {
    const {
        index,
        onClick,
        isHeader,
        item: { title, divider, className, children, description, icon, highlighted }
    } = props;

    if (divider) {
        return <Divider type="horizontal" className={classnames({ 'full-width': divider.hasFullWidth })} />;
    }

    const handleClick = (e) => {
        onClick(e, props.item, isHeader, index);
    };

    return (
        <>
            <div
                className={classnames(className, 'menu-item', {
                    header: isHeader,
                    highlighted,
                    'act-direction': isHeader || children
                })}
                onClick={handleClick}
            >
                {icon && <Icon type={icon} className="menu-custom-icon" />}
                <div className="menu-text">
                    <p>{title}</p>
                    {description && <p className="small-text">{description}</p>}
                </div>
                {children && <Icon className="menu-icon" type={`bc-icon-arrow-${isHeader ? 'left' : 'right'}`} />}
            </div>
            {isHeader && <Divider type="horizontal" className="full-width" />}
        </>
    );
}

MenuItem.propTypes = {
    /**
     * Item title
     */
    title: PropTypes.string,
    /**
     * Divider between items
     */
    divider: PropTypes.shape({
        /**
         * Controls width of divider
         */
        hasFullWidth: PropTypes.bool
    }),
    /**
     * Css class name for element
     */
    className: PropTypes.string,
    /**
     * fires event when user click on item
     * (event: Event, item: object, isHeader: Boolean, index: Number) => void,
     */
    onClick: PropTypes.func,
    /**
     * Item content
     */
    description: PropTypes.string,
    /**
     * Item's children data if item is header
     */
    children: childrenOf([MenuItem])
};

export default MenuItem;
