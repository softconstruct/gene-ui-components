import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { positions } from 'configs';
import { useKeyDown, useClickOutside } from 'hooks';
import { noop } from 'utils';

import Scrollbar from '../../atoms/Scrollbar';
import Button from '../../atoms/Button';
import Divider from '../../atoms/Divider';
import ModuleTitle from '../../atoms/ModuleTitle';

import './index.scss';

const horizontalSizes = ['half', 'wide', 'minimal'];

function Overlay({
    position,
    title,
    description,
    horizontalSize,
    headerActions,
    footer,
    children,
    onClose,
    onClickOutside,
    className,
    closeText,
    reduceText,
    extendText,
    withBackDrop,
    onToggle,
    isExtended,
    ...restProps
}) {
    const setRef = useClickOutside(onClickOutside);
    const [extended, setExtended] = useState(!!isExtended);

    const isControlled = useMemo(() => typeof isExtended === 'boolean', [isExtended]);
    const isVertical = useMemo(() => position === 'top' || position === 'bottom', [position]);

    const toggleExtended = useCallback(() => setExtended((prev) => !prev), []);

    const handleToggle = useCallback(
        (event) => {
            isControlled ? onToggle(event, extended) : toggleExtended();
        },
        [onToggle, extended]
    );

    useKeyDown((e) => onClose(e), [], { current: window }, ['Escape']);

    useEffect(() => {
        setExtended(isExtended);
    }, [isExtended]);

    return (
        <>
            <div
                className={classnames(className, 'overlay-holder', `p-${position}`, {
                    't-vertical': isVertical,
                    't-horizontal': !isVertical,
                    's-extended': isVertical && extended,
                    [`s-${horizontalSize}`]: !isVertical
                })}
                {...restProps}
                ref={setRef}
            >
                <div className="overlay-head">
                    <ModuleTitle
                        size="extra-big"
                        title={title}
                        description={description}
                        position={isVertical ? position : 'top'}
                        cornerRadius={isVertical ? 'position-radius' : 'no-radius'}
                    >
                        {headerActions}
                        {isVertical && (
                            <>
                                <Divider type="vertical" />
                                <Button onClick={onClose} appearance="minimal">
                                    {closeText}
                                </Button>
                            </>
                        )}
                    </ModuleTitle>
                    {!isVertical && (
                        <div className="overlay-close">
                            <Button onClick={onClose} icon="bc-icon-close" appearance="minimal" color="default" />
                        </div>
                    )}
                </div>
                <div className="overlay-body">
                    <Scrollbar>
                        <div className="overlay-content">{children}</div>
                        {isVertical && <div className="overlay-footer">{footer}</div>}
                    </Scrollbar>
                    {isVertical && (
                        <button onClick={handleToggle} className="extend-reduce">
                            {extended ? reduceText : extendText}
                        </button>
                    )}
                </div>
            </div>
            {withBackDrop && <div className="overlay-back-drop" />}
        </>
    );
}

Overlay.propTypes = {
    /**
     * Controls position of the element
     */
    position: PropTypes.oneOf(positions),
    /**
     * Title for element
     */
    title: PropTypes.string,
    /**
     * Description text for element
     */
    description: PropTypes.string,
    /**
     * Controls size of the element
     */
    horizontalSize: PropTypes.oneOf(horizontalSizes),
    /**
     * Header action bar,
     * React valid elements
     */
    headerActions: PropTypes.node,
    /**
     * Overlay footer
     * React valid elements
     */
    footer: PropTypes.node,
    /**
     * Overlay content
     * Valid React elements
     */
    children: PropTypes.node,
    /**
     * Fires event when user click on close button
     * (event: Event) => void
     */
    onClose: PropTypes.func,
    /**
     * CSS class for element
     */
    className: PropTypes.string,
    /**
     * Custom text for close button
     */
    closeText: PropTypes.string,
    /**
     * Custom text for reduce button
     */
    reduceText: PropTypes.string,
    /**
     * Custom text for extend button
     */
    extendText: PropTypes.string,
    /**
     * Fires event when user click on outside of content
     * (event: Event) => void
     */
    onClickOutside: PropTypes.func,
    /**
     * Adds a white layer on the background when Overlay opens
     */
    withBackDrop: PropTypes.bool,
    /**
     * with onToggle prop you wash the event listener pressing the open and close button
     * (event: Event, extend: Boolean) => void
     */
    onToggle: PropTypes.func,
    /**
     * using isExtended props you can control the opening of the component
     * if you add this prop then the component becomes controlled from outside
     */
    isExtended: PropTypes.bool
};

Overlay.defaultProps = {
    position: positions[2],
    horizontalSize: horizontalSizes[0],
    closeText: 'Close',
    reduceText: 'Reduce',
    onClickOutside: noop,
    extendText: 'Extend',
    onClose: noop,
    onToggle: noop,
    withBackDrop: false
};

export default Overlay;
