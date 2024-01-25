import React from 'react';
import PropTypes from 'prop-types';

// Helpers
import { noop } from 'utils';

// Components
import Portal from '../Portal';

// Local components
import ImagePreview from './ImagePreview';

function ImagePreviewWrapper({ withModal, ...restProps }) {
    return withModal ? (
        <Portal isOpen>
            <ImagePreview {...restProps} withModal={withModal} />
        </Portal>
    ) : (
        <ImagePreview {...restProps} withModal={withModal} />
    );
}

ImagePreviewWrapper.defaultProps = {
    onClose: noop,
    showSize: true,
    withModal: true,
    showRotate: true,
    showDownload: true,
    withMagnifier: false,
    showDimensions: true,
    magnifierDefaultValue: false
};

ImagePreviewWrapper.propTypes = {
    /**
     * Image file display name
     */
    name: PropTypes.string,
    /**
     * Image path to display
     */
    path: PropTypes.string.isRequired,
    /**
     * Event fires when click on close button
     */
    onClose: PropTypes.func,
    /**
     * Need to size or not
     */
    showSize: PropTypes.bool,
    /**
     * Need to download or not
     */
    showDownload: PropTypes.bool,
    /**
     * Need to rotate or not
     */
    showRotate: PropTypes.bool,
    /**
     * Need to dimensions or not
     */
    showDimensions: PropTypes.bool,
    /**
     * With magnifier functionality
     */
    withMagnifier: PropTypes.bool,
    /**
     * default Magnifier switched On
     */
    magnifierDefaultValue: PropTypes.bool,
    /**
     * modal mode
     */
    withModal: PropTypes.bool,
    /**
     * This is for fetch image for example through this prop you can pass token.
     * Provide an Object that will spread in Request Headers:{...customHeaders} in second parameter for fetch function.
     * For example { 'Content-Type': 'application/json'} it will convert fetch(URL,{headers{'Content-Type': 'application/json'}})
     */
    customHeaders: PropTypes.object
};

ImagePreviewWrapper.displayName = 'ImagePreview';

export default ImagePreviewWrapper;
