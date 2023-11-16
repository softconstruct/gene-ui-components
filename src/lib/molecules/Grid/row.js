import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useWidth } from 'hooks';

import Col from './col';
import './index.scss';

function Row(props) {
    const ref = useRef();
    const width = useWidth(ref);

    return (
        <div ref={ref} className={classnames('grid-holder', props.className)}>
            <div
                className="grid-items-group"
                style={{
                    width: `calc(100% + ${props.gutter / 10}rem)`,
                    margin: `-${props.padding / 20}rem -${props.gutter / 20}rem`
                }}
            >
                {React.Children.map(
                    props.children,
                    (child) =>
                        React.isValidElement(child) &&
                        React.cloneElement(child, {
                            __count: props.span,
                            __parentWidth: width,
                            __padding: props.padding,
                            __gutter: props.gutter
                        })
                )}
            </div>
        </div>
    );
}

Row.propTypes = {
    /**
     * Defines the space between horizontally
     */
    gutter: PropTypes.number,
    /**
     * Defines the number of grids the component is going to use
     */
    span: PropTypes.number,
    /**
     * Defines the space between vertically
     */
    padding: PropTypes.number,
    /**
     * 	The content of the component.
     */
    children: PropTypes.oneOfType([PropTypes.bool, PropTypes.node, PropTypes.element, PropTypes.instanceOf(Col)])
};

Row.defaultProps = {
    gutter: 20,
    padding: 20,
    span: 12
};

export default Row;
