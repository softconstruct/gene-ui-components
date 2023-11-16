import React from 'react';
import PropTypes from 'prop-types';

function PaperProp(props) {
    return <div />;
}

const paperDirections = ['row', 'row-reverse', 'column', 'column-reverse'];
const paperWraps = ['wrap', 'nowrap', 'wrap-reverse'];
const justifyContents = [
    'paper-start',
    'paper-end',
    'center',
    'start',
    'end',
    'left',
    'right',
    'normal',
    'space-between',
    'space-around',
    'space-evenly',
    'stretch',
    'inherit',
    'initial',
    'unset'
];
const alignItems = [
    'stretch',
    'normal',
    'center',
    'start',
    'end',
    'paper-start',
    'paper-end',
    'self-start',
    'self-end',
    'baseline',
    'inherit',
    'initial',
    'unset'
];
const cornersRadius = ['none', 'top-radius', 'bottom-radius', 'full-radius'];

PaperProp.propTypes = {
    /**
     * Paper padding. Any padding value valid in css
     */
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Wrapping with paper anything passed as child. Any valid React node
     */
    children: PropTypes.node,
    /**
     * Paper direction
     */
    paperDirection: PropTypes.oneOf(paperDirections),
    /**
     * Paper wrapping
     */
    paperWrap: PropTypes.oneOf(paperWraps),
    /**
     * Paper justify content
     */
    justifyContent: PropTypes.oneOf(justifyContents),
    /**
     * Paper align items
     */
    alignItems: PropTypes.oneOf(alignItems),
    /**
     * Paper corner radius
     */
    cornerRadius: PropTypes.oneOf(cornersRadius),
    /**
     * Will add transparency to the Paper when set to "true"
     */
    isTransparent: PropTypes.bool,
    /**
     * Will add borders to the Paper when set to "true"
     */
    border: PropTypes.bool,
    /**
     * Will add shadow to the Paper when set to "true"
     */
    shadow: PropTypes.bool
};

PaperProp.defaultProps = {
    padding: 0,
    className: '',
    paperDirection: paperDirections[0],
    paperWrap: paperWraps[0],
    justifyContent: justifyContents[0],
    alignItems: alignItems[0],
    cornerRadius: cornersRadius[0],
    shadow: false,
    border: false,
    isTransparent: false
};

export { paperWraps, alignItems, justifyContents, paperDirections, cornersRadius };

export default PaperProp;
