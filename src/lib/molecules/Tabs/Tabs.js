import React, { useState, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { childrenOf } from 'utils';

// Local components
import Tab from './Tab';

// Styles
import './index.scss';

function Tabs(props) {
    const {
        type,
        actions,
        position,
        children,
        fixedSize,
        onChange,
        className,
        defaultActiveKey,
        contentClassName,
        contentPadding
    } = props;
    const holderRef = useRef(null);
    const isControlled = 'activeKey' in props;
    const [active, setActive] = useState(() => defaultActiveKey || getDefaultActiveKey(children));
    const activeKey = isControlled ? props.activeKey : active;

    const handleClick = useCallback(
        (key) => {
            !isControlled && setActive(key);
            onChange && onChange(key);
            holderRef?.current && holderRef.current.scrollTo(0, 0);
        },
        [onChange, isControlled, holderRef.current]
    );

    const { tabs, content, tabContentPadding } = useMemo(
        () => getTabsAndContent(children, activeKey, defaultActiveKey, handleClick),
        [children, activeKey, handleClick]
    );

    return (
        <div
            className={classnames('tabs-holder', className, {
                vertical: position !== 'top',
                reversed: position === 'right',
                horizontal: position === 'top'
            })}
        >
            <div className="tabs-head">
                <div className="tabs-wrapper">
                    <ul
                        className={classnames('tabs-content', `type-${type}`, {
                            'equal-tabs': fixedSize
                        })}
                    >
                        {tabs}
                    </ul>
                </div>
                {actions && position === 'top' && <div className="tabs-actions">{actions}</div>}
            </div>
            <div
                ref={holderRef}
                className={classnames('tabs-content-holder', contentClassName, {
                    'c-type-box': type === 'box'
                })}
                style={{
                    padding: `${(tabContentPadding || contentPadding) / 10}rem`
                }}
            >
                {content}
            </div>
        </div>
    );
}

Tabs.propTypes = {
    /**
     * Any valid react node, will be shown at right side of tab menu bar.
     */
    actions: PropTypes.node,
    /**
     * Prop for specifying which tab is active
     */
    activeKey: PropTypes.string,
    /**
     * Prop for default active tab
     */
    defaultActiveKey: PropTypes.string,
    /**
     * Style of tab menu bar
     */
    type: PropTypes.oneOf(['basic', 'box', 'button', 'text']),
    /**
     * Position of tab menu bar
     */
    position: PropTypes.oneOf(['top', 'left', 'right']),
    /**
     * Size of tabs will be fixed when the value is true
     */
    fixedSize: PropTypes.bool,
    /**
     * Callback function, fired when tab changes
     */
    onChange: PropTypes.func,
    /**
     * Any valid react node
     */
    children: childrenOf([Tab]),
    /**
     * Additional classname for content wrapper
     */
    contentClassName: PropTypes.string,
    /**
     * Padding value for content wrapper
     */
    contentPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Tabs.defaultProps = {
    type: 'basic',
    position: 'top',
    fixedSize: false,
    contentPadding: 19
};

function getDefaultActiveKey(children) {
    let defaultActiveKey;

    React.Children.forEach(children, (child) => {
        if (!defaultActiveKey && !child.props.disabled) {
            defaultActiveKey = child.key;
        }
    });

    return defaultActiveKey;
}

function getTabsAndContent(children, activeKey, defaultActiveKey, handleClick) {
    let content;
    let tabContentPadding;

    const tabs = React.Children.map(children, (child) => {
        const active = child.key === activeKey;

        if (active) {
            content = child.props.children;
            tabContentPadding = child.props.contentPadding;
        }

        return React.cloneElement(child, {
            onClick: () => handleClick(child.key),
            defaultActiveKey,
            activeKey,
            active
        });
    });

    return {
        tabs,
        content,
        tabContentPadding
    };
}

export default Tabs;
