import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';
import Icon from '../../atoms/Icon';
import Option from '../../atoms/Option';
import Popover from '../../atoms/Popover';

import NavigationMenuContent from './Content';
import { getTitlesArray } from './utils';

import './index.scss';

function NavigationMenu({ data, value, onChange, disabled }) {
    const [isOpen, setIsOpen] = useState(false);

    const splitedValue = useMemo(() => value && value.split('/').filter(Boolean), [value]);
    const title = useMemo(() => getTitlesArray(splitedValue, data), [splitedValue, data]);

    const handleChange = useCallback(
        (...args) => {
            setIsOpen(false);
            onChange(...args);
        },
        [onChange]
    );

    const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);

    return (
        <Popover
            isOpen={isOpen}
            extendTargetWidth={false}
            toggleHandler={handleToggle}
            fullHeight
            children={
                <button className="bc-navigation-menu" disabled={disabled}>
                    <div className="bc-navigation-menu_head">
                        {title.map((item, index) => (
                            <span key={index} className="bc-navigation-menu_layer">
                                {item}
                            </span>
                        ))}
                    </div>
                    <Icon type="bc-icon-arrow-down" />
                </button>
            }
            Content={
                <div className="bc-navigation-menu_content">
                    <NavigationMenuContent options={data} onChange={handleChange} splitedValue={splitedValue} />
                </div>
            }
        />
    );
}

NavigationMenu.propTypes = {
    /**
     * This is where you send data (options) for the menu, if you need to send
     * nested options, send the date to the option in the same structure as the options.
     * example => data={[{ id: 'item_1', title: 'Item 1', isHidden: false, data: [ { id: 'item_1_1', title: 'Item 1.1', isHidden: false } ]}]}
     */
    data: PropTypes.arrayOf(PropTypes.shape(Option.propTypes)).isRequired,
    /**
     * For value you need to send id selectable options id,
     * and if you select the nested option, then you need to send the id to the hierarchy.
     * example => 'item_1/item_1_1'
     */
    value: PropTypes.string.isRequired,
    /**
     * onChange handler is called by clicking on the option
     * This callback gives you the option you clicked on and its id and
     * if it is nested then the give and parent option id are associated with a forward slash.
     * (id: NavigationMenu.value, item: Option) => void
     */
    onChange: PropTypes.func,
    /**
     * Disabled status for the navigation menu button
     */
    disabled: PropTypes.bool
};

NavigationMenu.defaultProps = {
    onChange: noop
};

export default NavigationMenu;
