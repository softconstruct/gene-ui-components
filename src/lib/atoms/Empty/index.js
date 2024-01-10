import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import dataGreyscale from 'src/assets/media/empty-state/greyscale/data.svg';
import imageGreyscale from 'src/assets/media/empty-state/greyscale/image.svg';
import searchGreyscale from 'src/assets/media/empty-state/greyscale/search.svg';
import messageGreyscale from 'src/assets/media/empty-state/greyscale/message.svg';
import dataTransparent from 'src/assets/media/empty-state/transparent/data.svg';
import imageTransparent from 'src/assets/media/empty-state/transparent/image.svg';
import searchTransparent from 'src/assets/media/empty-state/transparent/search.svg';
import messageTransparent from 'src/assets/media/empty-state/transparent/message.svg';
import dataWithCircles from 'src/assets/media/empty-state/with-circles/data.svg';
import imageWithCircles from 'src/assets/media/empty-state/with-circles/image.svg';
import searchWithCircles from 'src/assets/media/empty-state/with-circles/search.svg';
import dataWithoutCircles from 'src/assets/media/empty-state/without-circles/data.svg';
import imageWithoutCircles from 'src/assets/media/empty-state/without-circles/image.svg';
import searchWithoutCircles from 'src/assets/media/empty-state/without-circles/search.svg';
import messageWithoutCircles from 'src/assets/media/empty-state/without-circles/message.svg';

import './index.scss';

const images = {
    'with-circles': {
        data: dataWithCircles,
        image: imageWithCircles,
        search: searchWithCircles,
        message: messageWithoutCircles
    },
    'without-circles': {
        data: dataWithoutCircles,
        image: imageWithoutCircles,
        search: searchWithoutCircles,
        message: messageWithoutCircles
    },
    greyscale: {
        data: dataGreyscale,
        image: imageGreyscale,
        search: searchGreyscale,
        message: messageGreyscale
    },
    transparent: {
        data: dataTransparent,
        image: imageTransparent,
        search: searchTransparent,
        message: messageTransparent
    }
};

const appearances = ['with-circles', 'without-circles', 'greyscale', 'transparent'];
const types = ['data', 'image', 'search', 'message'];
const sizes = ['big', 'medium', 'small'];

function Empty({ appearance, type, size, title, subTitle, className, withImage, ...restProps }) {
    return (
        <div {...restProps} className={classnames('empty-state-holder', `s-${size}`, className)}>
            {withImage && (
                <div className="empty-state-image">
                    <img alt="Empty" src={images[appearance][type]} />
                </div>
            )}
            {title && <div className="empty-state-title">{title}</div>}
            {subTitle && <div className="empty-state-subtitle">{subTitle}</div>}
        </div>
    );
}

Empty.propTypes = {
    /**
     * Available style varieties of Empty atom to display
     */
    appearance: PropTypes.oneOf(appearances),
    /**
     * Types of data Empty atom should represent
     */
    type: PropTypes.oneOf(types),
    /**
     * Empty atom size
     */
    size: PropTypes.oneOf(sizes),
    /**
     * Will add a title to the "Empty" atom. Any valid React node
     */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * Will add a subtitle to the "Empty" atom. Any valid React node
     */
    subTitle: PropTypes.string,
    /**
     * When set to "true" Empty atom will show a predefined image based on "appearance" and "type" props
     */
    withImage: PropTypes.bool,
    /**
     * Additional className
     */
    className: PropTypes.string
};

Empty.defaultProps = {
    appearance: appearances[0],
    type: types[0],
    size: sizes[0],
    withImage: true,
    title: 'No Data to Display'
};

export default Empty;
