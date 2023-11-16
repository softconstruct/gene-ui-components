import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { fileSizeDisplay, stopEvent } from 'utils';
import Icon from '../../../../atoms/Icon';

import './index.scss';

function Preview({
    previewImage: {
        name,
        path,
        blob: { size },
        dimensions
    },
    hideName,
    onClose
}) {
    return (
        <div className="media-preview-holder" onClick={onClose}>
            <Icon type="bc-icon-close" />
            <div className="media-preview" onClick={stopEvent}>
                <div className="mp-title ellipsis-text">{!hideName && name}</div>
                <img className="mp-element" src={path} alt={name} />
                <ul className="mp-details">
                    <li>
                        <span>Image size:</span> {fileSizeDisplay(size)}{' '}
                    </li>
                    {dimensions && (
                        <li>
                            <span>Image dimensions: </span>
                            {dimensions.width} x {dimensions.height}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

Preview.propTypes = {
    previewImage: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    dimensions: PropTypes.object,
    name: PropTypes.string,
    path: PropTypes.string,
    blob: PropTypes.object
};

Preview.defaultProps = {
    dimensions: {}
};

export default Preview;
