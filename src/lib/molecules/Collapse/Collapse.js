import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { conflictPropsLog } from 'utils';

import deepCheck from './utils';

const appearances = ['default', 'minimal'];

const getActiveKeys = (activeKeys, key, accordion, isControlled) =>
    !isControlled && accordion
        ? activeKeys[0] === key
            ? []
            : [key]
        : activeKeys.includes(key)
        ? activeKeys.filter((item) => item !== key)
        : [...activeKeys, key];

function Collapse(props) {
    const { children, defaultActiveKeys, onChange, appearance, accordion, expandIcon, allActive } = props;

    const allKeys = useMemo(() => React.Children.map(children, ({ key }) => key), [children]);

    const isControlled = 'activeKeys' in props;
    const [activeKeysState, setActiveKeysState] = useState(() => (allActive ? allKeys : defaultActiveKeys));
    const activeKeys = isControlled ? props.activeKeys : activeKeysState;

    isControlled && accordion && conflictPropsLog('Collapse', ['activeKeys', 'accordion'], true);

    useEffect(() => {
        accordion && setActiveKeysState((prev) => [prev[0]]);
    }, [accordion]);

    useEffect(() => {
        allActive && setActiveKeysState(allKeys);
    }, [allActive, allKeys]);

    return React.Children.map(children, (child, index) => {
        const { key, props: childProps } = child;

        const handleClick = (e) => {
            const newActiveKeys = getActiveKeys(activeKeys, key, accordion, isControlled);
            !isControlled && setActiveKeysState(newActiveKeys);
            onChange && onChange(newActiveKeys);
            childProps.onClick && childProps.onClick(e, childProps, index);
        };

        return React.cloneElement(child, {
            opened: childProps.opened ?? activeKeys.includes(key),
            onClick: handleClick,
            appearance,
            expandIcon
        });
    });
}

Collapse.propTypes = {
    /**
     * The child or children of Collapse molecule is "Panel"
     */
    children: (props, propName, componentName) => deepCheck(props.children),
    /**
     * Keys provided in array must correspond the keys which are set on child "Panel"'s. Also they will be opened.
     * Using this prop means that you are controlling Collapse molecule
     */
    activeKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * Provide default state of opened "Panel"-s. Note that using this key does not mean to control Collapse
     */
    defaultActiveKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * Fires an event on Panel click((arrayOfKeys: string[]) => void)
     */
    onChange: PropTypes.func,
    /**
     * Collapse appearance
     */
    appearance: PropTypes.oneOf(appearances),
    /**
     * Only one "Panel" can be opened at a time when set to "true"
     */
    accordion: PropTypes.bool,
    /**
     * Use this prop to override default icons of "Panel"(opened: boolean) => ReactElement
     */
    expandIcon: PropTypes.func,
    /**
     * All 'Panel'-s are open/close by this prop
     */
    allActive: PropTypes.bool
};

Collapse.defaultProps = {
    appearance: appearances[1],
    accordion: false,
    defaultActiveKeys: [],
    allActive: false
};

export default Collapse;
