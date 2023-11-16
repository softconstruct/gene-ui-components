import React from 'react';
import PropTypes from 'prop-types';

const MenuProp = (props) => <div></div>;

MenuProp.counter = 0;

MenuProp.propTypes = {
    /**
     * Menu items data
     */
    data: PropTypes.arrayOf(
        PropTypes.shape({
            /**
             * Title for menu item
             */
            title: PropTypes.string,
            /**
             * Divider between menu items
             */
            divider: PropTypes.shape({
                /**
                 * Controls width of divider
                 */
                hasFullWidth: PropTypes.bool
            }),
            /**
             * Fires event when user click on one of the menu items;
             * (event: Event, item: Object) => void
             */
            onClick: PropTypes.func,
            /**
             * Text value inside menu item
             */
            description: PropTypes.string,
            /**
             * Children elements data for menu item
             */
            children: PropTypes.any
        })
    ),
    /**
     * Fires event when user click on header elements;
     * (event: Event, item: Object) => void
     */
    onBack: PropTypes.func
};

export default MenuProp;
