import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { screenTypes } from 'configs';
import { useDeviceType } from 'hooks';

// Components
import Icon from '../../atoms/Icon';
import Divider from '../../atoms/Divider';

// Styles
import './index.scss';

function Products({ list, activeSlug, onChange, favorites, className, screenType, ...restProps }) {
    const { isMobile } = useDeviceType(screenType);
    const hasFavorites = favorites.length;
    const handleClick = (event) => {
        const { index } = event.currentTarget.dataset;
        const item = list[index];

        onChange && onChange(item);
    };

    return (
        <div className={classnames('products-switcher-holder', className)} {...restProps}>
            {list.map((item, index) => (
                <button
                    key={item.slug}
                    className={classnames('product-item', {
                        active: item.slug === activeSlug
                    })}
                    data-index={index}
                    onClick={handleClick}
                    title={item.title}
                >
                    <Icon type={item.icon} />
                    <p className="ellipsis-text">{item.title}</p>
                </button>
            ))}
            {hasFavorites > 0 && <Divider type="horizontal" size={isMobile ? '76%' : '100%'} />}
            {hasFavorites > 0 &&
                favorites.map((item, index) => (
                    <button
                        key={item.slug}
                        className={classnames('product-item', {
                            active: item.slug === activeSlug
                        })}
                        data-index={index}
                        onClick={handleClick}
                        title={item.title}
                    >
                        <Icon type={item.icon} />
                        <p className="ellipsis-text">{item.title}</p>
                    </button>
                ))}
        </div>
    );
}

const propShape = PropTypes.arrayOf(
    PropTypes.shape({
        /**
         * Product title
         */
        title: PropTypes.string,
        /**
         * Product slug
         */
        slug: PropTypes.string,
        /**
         * Product icon
         */
        icon: PropTypes.string
    })
);

Products.propTypes = {
    /**
     * Array of products data
     */
    list: propShape.isRequired,
    /**
     * Array of favorite products data
     */
    favorites: propShape,
    /**
     * Selected item
     */
    activeSlug: PropTypes.string,
    /**
     * CSS class name for element
     */
    className: PropTypes.string,
    /**
     * Callback fires when click on product
     */
    onClick: PropTypes.func,
    /**
     * Pass screenType to control appearance, weather it should be mobile version etc.
     */
    screenType: PropTypes.oneOf(screenTypes)
};

Products.defaultProps = {
    favorites: []
};

export default Products;
